import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const PORT = process.env.PORT
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);

  const config = new DocumentBuilder().setTitle('Nest Cource API').setDescription(
    'API documentation for nestjs cource').setVersion('1.0.0').setContact(
      'Vazgen', 'vazge.locomotiv.ru', 'ooo@getPrismaClient.com').build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('/docs', app, document)
  await app.listen(PORT ?? 3000);
  console.log(PORT, "CLIENTS")
}
bootstrap();
