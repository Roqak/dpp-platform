import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passport } from './entities/passport.entity';
import { PassportsController } from './passports.controller';
import { PassportsService } from './services/passports.service';
import { CarbonService } from './services/carbon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Passport])],
  controllers: [PassportsController],
  providers: [PassportsService, CarbonService],
})
export class PassportsModule {}
