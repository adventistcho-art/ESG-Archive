import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucket: string;
  private useLocalStorage: boolean;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    this.useLocalStorage = !accessKeyId || accessKeyId === 'your-access-key';

    if (!this.useLocalStorage) {
      this.s3Client = new S3Client({
        region: this.configService.get<string>('AWS_REGION', 'ap-northeast-2'),
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
        },
      });
      this.bucket = this.configService.get<string>('AWS_S3_BUCKET', 'esg-archive-uploads');
    }
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = path.extname(file.originalname);
    const key = `${folder}/${uuid()}${ext}`;

    if (this.useLocalStorage) {
      // Local file storage fallback
      const uploadDir = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, `${uuid()}${ext}`);
      fs.writeFileSync(filePath, file.buffer);
      return `/uploads/${folder}/${path.basename(filePath)}`;
    }

    // S3 upload
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return `https://${this.bucket}.s3.amazonaws.com/${key}`;
  }
}
