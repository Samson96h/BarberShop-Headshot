// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { BarberServices, User } from '@app/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Types } from 'mongoose';
// import { status } from '@app/common';

// import { CreateBarberServiceDto } from '../dto/create-barber-service.dto';
// import { IBarberRepository } from '../interfaces/barber.repository';
// import { MediaMongoService } from '../services/media-mongo.service';
// import { UpdateBarberServiceDto } from '../dto/update-barber.dto';


// @Injectable()
// export class BarbersMongoRepository implements IBarberRepository {
//     constructor(
//         @InjectModel(BarberServices.name)
//         private readonly barberModel: Model<BarberServices>,

//         @InjectModel(User.name)
//         private readonly userModel: Model<User>,

//         private readonly mediaService: MediaMongoService,
//     ) { }

//     async createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
//         const existingService = await this.barberModel.findOne({ user: userId });

//         if (existingService) {
//             throw new BadRequestException('You already have service.');
//         }

//         if (file) {
//             await this.mediaService.uploadUserImage(userId, file);
//         }

//         const image = await this.mediaService.getUserImage(userId);

//         const service = await this.barberModel.create({
//             user: new Types.ObjectId(userId),
//             ...dto
//         });

//         return {
//             service,
//             portfolioPath: image ? image.path : null
//         };
//     }

//     async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
//         const service = await this.barberModel.findOne({ user: userId });

//         if (!service) {
//             throw new NotFoundException('Service not found');
//         }

//         if (file) {
//             await this.mediaService.uploadUserImage(userId, file);
//         }

//         const image = await this.mediaService.getUserImage(userId);

//         const updated = await this.barberModel.findOneAndUpdate(
//             { user: userId },
//             { $set: dto },
//             { new: true }
//         );

//         return {
//             service: updated,
//             portfolioPath: image ? image.path : null,
//         };
//     }

//     async findAllBarbers() {
//         return this.userModel.find({ role: status.BARBER });
//     }

//     async findOneBarber(userId: string) {
//         const barber = await this.userModel.findOne({ _id: userId, role: status.BARBER });

//         if (!barber) {
//             throw new NotFoundException('Barber not found');
//         }

//         return barber;
//     }

//     async removeService(userId: string) {
//         const service = await this.barberModel.findOne({ user: userId });

//         if (!service) {
//             throw new NotFoundException('Service not found');
//         }

//         await this.barberModel.findOneAndDelete({ _id: service._id });

//         return { message: 'Service deleted' };
//     }

//     async getMyService(userId: string) {
//         const service = await this.barberModel.findOne({ user: userId }).populate('user').lean();

//         const image = await this.mediaService.getUserImage(userId);

//         return {
//             ...service,
//             portfolioImage: image ? image.path : null
//         };
//     }

//     async getAllServices() {
//         return this.barberModel.find().populate('user');
//     }

//     async getOneService(serviceId: string) {
//         const service = await this.barberModel.findById(serviceId).populate('user').lean();

//         if (!service) {
//             throw new NotFoundException('Service not found');
//         }

//         const ownerId = service.user?._id || service.user;

//         const image = await this.mediaService.getUserImage(ownerId.toString());

//         return {
//             ...service,
//             portfolioImage: image ? image.path : null
//         };
//     }
// }