import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { SenderService } from './sender.service';

@Module({
  providers: [TemplateService, SenderService],
  exports: [SenderService],
})
export class EmailModule {}