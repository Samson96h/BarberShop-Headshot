import { Module } from '@nestjs/common';
import { AdminAppController } from './admin-app.controller';
import { AdminAppService } from './admin-app.service';

@Module({
  imports: [],
  controllers: [AdminAppController],
  providers: [AdminAppService],
})
export class AdminAppModule {}
