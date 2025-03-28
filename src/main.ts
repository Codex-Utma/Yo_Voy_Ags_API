import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Yo Voy Ags App API')
      .setDescription('The Yo Voy Ags App API description')
      .setVersion('1.0')
      .addServer(
        `http://localhost:${process.env.PORT ?? 3000}`,
        'Local environment',
      )
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
