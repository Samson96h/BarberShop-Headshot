import { UserEntity } from "@app/common/database/entities";
import { MediaFilesEntity } from "@app/common/database/entities";
import { S3Service } from "@app/common/shared/s3/s3.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuid } from 'uuid';

@Injectable()
export class MediaPostgreService {
  constructor(
    private readonly s3Service: S3Service,

    @InjectRepository(MediaFilesEntity)
    private readonly mediaRepo: Repository<MediaFilesEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) { }

  async uploadUserImage(userId: number, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;
    const filePath = `Samson/BarberShop/Barbers/${userId}/${fileName}`;

    await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['mediaFiles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let media: MediaFilesEntity;

    if (user.mediaFiles) {
      media = user.mediaFiles;
      media.path = filePath;
      media.size = file.size;

      await this.mediaRepo.save(media);
    }
    else {
      media = this.mediaRepo.create({
        path: filePath,
        size: file.size,
      });

      const savedMedia = await this.mediaRepo.save(media);

      user.mediaFiles = savedMedia;
      await this.userRepo.save(user);
    }

    return media;
  }
}