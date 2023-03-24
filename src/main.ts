import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('PORT');
  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  app.useGlobalFilters(new AllExceptionsFilter(logger));
  await app.listen(PORT);
}
bootstrap();
