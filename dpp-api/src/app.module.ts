import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passport } from './passports/entities/passport.entity';
import { PassportsModule } from './passports/passports.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dpp.db',
      entities: [Passport],
      synchronize: true,
      logging: false,
    }),
    PassportsModule,
  ],
})
export class AppModule {}
