import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsModule } from './chats/chats.module';
import mongoose from 'mongoose';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ChatsModule
  ],
  controllers: [AppController],
  providers: []
})
export class AppModule {
  private readonly isDev: boolean = process.env.MODE === 'dev';

  constructor() {
    mongoose.set('debug', this.isDev);
  }
}
