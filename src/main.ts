import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());


  app.use(['/api'], basicAuth({
    challenge: true,
    users: {
      [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
    },
  }));

  const config = new DocumentBuilder()
    .setTitle(process.env.DOC_BUILDER_TITLE)
    .setDescription(process.env.DOC_BUILDER_DESC)
    .setVersion(process.env.DOC_VERSION)
    .addTag(process.env.DOC_ADD_TAG)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen((process.env.PORT) ? process.env.PORT : 3000);
}
bootstrap();
