import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passport } from '../entities/passport.entity';
import { CreatePassportDto } from '../dto/create-passport.dto';
import { CarbonService } from './carbon.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PassportsService {
  constructor(
    @InjectRepository(Passport)
    private passportRepo: Repository<Passport>,
    private carbonService: CarbonService,
  ) {}

  async create(dto: CreatePassportDto): Promise<Passport> {
    const passportId = this.generatePassportId(dto.countryOfOrigin, dto.category);
    const publicUrl = `https://passports.dpp-platform.com/p/${passportId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

    const carbonFootprint = dto.weightKg
      ? this.carbonService.calculate(dto.category, dto.weightKg)
      : null;

    const passport = this.passportRepo.create({
      passportId,
      productName: dto.productName,
      sku: dto.sku,
      category: dto.category,
      manufacturer: dto.manufacturer,
      countryOfOrigin: dto.countryOfOrigin,
      materials: dto.materials,
      weightKg: dto.weightKg,
      packaging: dto.packaging,
      carbonFootprint,
      complianceStatus: {
        euDpp: 'compliant',
        eudr: 'geolocation_verified',
        gs1: 'standard_format',
      },
      qrCodeUrl,
      publicUrl,
    });

    return this.passportRepo.save(passport);
  }

  async findAll(): Promise<Passport[]> {
    return this.passportRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Passport | null> {
    return this.passportRepo.findOne({ where: { passportId: id } });
  }

  private generatePassportId(country: string, category: string): string {
    const countryCode = country.slice(0, 2).toUpperCase();
    const catCode = category.slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const uuid = uuidv4().split('-')[0].toUpperCase();
    return `DPP-${countryCode}-${year}-${catCode}-${uuid}`;
  }
}
