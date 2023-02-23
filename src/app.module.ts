import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { URI } from './configs/db.config';
import { ProductsModule } from './products/products.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(URI),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
