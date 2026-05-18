import { v4 as uuid } from 'uuid';

export async function handleImageUploadMongo(userId: string, file: Express.Multer.File) {
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