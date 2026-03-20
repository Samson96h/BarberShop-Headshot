import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const awsConfig = this.configService.get('AWS_CONFIG');

    

    if (!awsConfig?.bucket) {
      throw new Error('Missing S3 bucket name in AWS_CONFIG');
    }

    this.bucket = awsConfig.bucket;

    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async putObject(file: Buffer, fileName: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: file,
      ContentType: contentType,
    });

    return this.s3Client.send(command);
  }


  async deleteObject(fileName: string) {
    const input: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(input);
    const response = await this.s3Client.send(command);
    console.log(`Deleted from S3: ${fileName}`);
    return response;
  }

  async getObject(fileName: string) {
    const input: GetObjectCommandInput = {
      Bucket: this.bucket,
      Key: fileName,
    };

    const command = new GetObjectCommand(input);
    const response = await this.s3Client.send(command);
    const stream = response.Body as Readable;

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }

    const fileBuffer = Buffer.concat(chunks);
    return fileBuffer;
  }
}
