import { NestFactory } from '@nestjs/core';
import { AdminAppModule } from './admin-app.module';

async function bootstrap() {
  const PORT = process.env.PORT_ADMIN
  const app = await NestFactory.create(AdminAppModule);
  await app.listen(PORT ?? 3000);
  console.log(PORT)
}
bootstrap();
