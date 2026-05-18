import { v4 as uuid } from 'uuid';

export async function handleImageUploadPostgre(userId: string, file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;
    const filePath = `Samson/BarberShop/Barbers/${userId}/${fileName}`;

    await this.s3Service.putObject(file.buffer, filePath, file.mimetype);

    const image = await this.mediaFilesRepository.findOne({where: {user: {id: +userId}}});

    image.path= filePath
    image.size = file.size


    return image
    
  }