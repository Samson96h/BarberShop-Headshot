import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BarberServices, User, UserImage } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { Model, Types } from 'mongoose';


import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { UpdateBarberServiceDto } from './dto/update-barber.dto';
import { S3Service } from '@app/common/shared/s3/s3.service';
import { status } from '@app/common';



@Injectable()
export class BarbersService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(BarberServices.name)
    private readonly barberModel: Model<BarberServices>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(UserImage.name)
    private readonly imageModel: Model<UserImage>
  ) { }


  private async handleImageUpload(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;
    const filePath = `Samson/BarberShop/Barbers/${userId}/${fileName}`;

    await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

    return this.imageModel.findOneAndUpdate(
      { user: userId },
      { path: filePath, size: file.size },
      { upsert: true, new: true }
    );
  }
  
  async createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
    const existingService = await this.barberModel.findOne({ user: userId });

    if (existingService) {
      throw new BadRequestException("You already have services.");
    }

    if (file) {
      await this.handleImageUpload(userId, file);
    }

    return this.barberModel.create({ 
      user: new Types.ObjectId(userId),
      ...dto 
    });
  }

  async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
    const service = await this.barberModel.findOne({ user: userId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (file) {
      await this.handleImageUpload(userId, file);
    }

    return this.barberModel.findOneAndUpdate(
      { user: userId },
      { $set: dto },
      { new: true }
    );
  }

  async findAllBarbers() {
    const services = await this.userModel.find()
    return services.filter(e => e.role === status.BARBER);
  }

  async findOneBarber(userId: string) {
    const barber = await this.userModel.findOne({
      _id: userId,
      role: status.BARBER,
    });

    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    return barber;
  }


  // async createService(userId: string, dto: CreateBarberServiceDto) {
  //   const service = await this.barberModel.findOne({ user: userId })

  //   if (service) {
  //     throw new BadRequestException("You already have services, please either change the old ones or delete them and then add new ones.")
  //   }

  //   return this.barberModel.create({ user: userId, ...dto })
  // }

  // async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
  //   const service = await this.barberModel.findOne({ user: userId });
  //   if (!service) {
  //     throw new NotFoundException('Service not found');
  //   }

  //   if (file) {
  //     const fileExtension = file.originalname.split('.').pop();
  //     const fileName = `${uuid()}.${fileExtension}`;
  //     const filePath = `barbershop/portfolios/${userId}/${fileName}`;
  //     await this.s3Service.putObject(file.buffer, filePath, file.mimetype);


  //     const existingImage = await this.imageModel.findOne({ user: userId });

  //     if (existingImage) {

  //       existingImage.path = filePath;
  //       existingImage.size = file.size;
  //       await existingImage.save();

  //     } else {

  //       await this.imageModel.create({
  //         user: userId,
  //         path: filePath,
  //         size: file.size,
  //       });
  //     }
  //   }

  //   return this.barberModel.findOneAndUpdate(
  //     { user: userId },
  //     { $set: dto },
  //     { new: true }
  //   );
  // }

  async removeService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndDelete({ _id: service._id })
  }


  async getMyService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId }).populate('user').lean();
    const image = await this.imageModel.findOne({ user: userId }).lean();

    return {
      ...service,
      portfolioImage: image ? image.path : null
    };
  }

  async getAllServices() {
    return this.barberModel.find().populate('user')
  }


  async getOneService(serviceId: string) {
    console.log('Searching for ID:', serviceId);

    const service = await this.barberModel
      .findById(serviceId)
      .populate('user')
      .lean();

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const ownerId = service.user?._id || service.user;

    let portfolioPath

    if (ownerId) {
      const image = await this.imageModel
        .findOne({ user: ownerId })
        .lean();
      portfolioPath = image ? image.path : null;
    }

    return {
      ...service,
      portfolioImage: portfolioPath,
    };
  }
}
