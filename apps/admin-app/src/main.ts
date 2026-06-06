import { NestFactory } from '@nestjs/core';

import { AdminAppModule } from './admin-app.module';
import { TranslationExceptionFilter } from '@app/common/exception_filter';


async function bootstrap() {
  const PORT = process.env.PORT_ADMIN
  const app = await NestFactory.create(AdminAppModule);
  
  await app.listen(PORT ?? 3000);

  app.useGlobalFilters(app.get(TranslationExceptionFilter))

  console.log(PORT, 'ADMIN')
}
bootstrap();
