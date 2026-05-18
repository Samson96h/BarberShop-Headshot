import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { S3Service } from '@app/common/shared/s3/s3.service';
import { UserImage } from '@app/common';

@Injectable()
export class MediaMongoService {
    constructor(
        private readonly s3Service: S3Service,

        @InjectModel(UserImage.name)
        private readonly imageModel: Model<UserImage>,
    ) { }

    async uploadUserImage(userId: string, file: Express.Multer.File) {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuid()}.${fileExtension}`;
        const filePath = `Samson/BarberShop/Barbers/${userId}/${fileName}`;

        await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

        const image = await this.imageModel.findOneAndUpdate(
            { user: new Types.ObjectId(userId) },
            {
                path: filePath,
                size: file.size,
            },
            { upsert: true, new: true },
        );

        return image;
    }

    async getUserImage(userId: string) {
        return this.imageModel
            .findOne({ user: new Types.ObjectId(userId) })
            .lean();
    }
}