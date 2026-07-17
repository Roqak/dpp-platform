import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passport } from '../entities/passport.entity';
import { CreatePassportDto } from '../dto/create-passport.dto';
import { CarbonService } from './carbon.service';
import { PdfService } from './pdf.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PassportsService implements OnModuleInit {
  constructor(
    @InjectRepository(Passport)
    private passportRepo: Repository<Passport>,
    private carbonService: CarbonService,
    private pdfService: PdfService,
  ) {}

  async onModuleInit() {
    const count = await this.passportRepo.count();
    if (count === 0) {
      console.log('🌱 Seeding database with demo passports...');
      await this.seed();
    }
  }

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

  async generatePdf(passport: Passport): Promise<Buffer> {
    return this.pdfService.generate(passport);
  }

  private generatePassportId(country: string, category: string): string {
    const countryCode = country.slice(0, 2).toUpperCase();
    const catCode = category.slice(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const uuid = uuidv4().split('-')[0].toUpperCase();
    return `DPP-${countryCode}-${year}-${catCode}-${uuid}`;
  }

  private async seed() {
    const companies = [
      {
        name: 'FTN Cocoa Processors Plc',
        product: 'Nigerian Cocoa Beans — FTN Premium Grade',
        sku: 'FTN-CB-2025-Q3',
        category: 'cocoa-beans',
        origin: 'Nigeria',
        weight: 25000,
        packaging: 'Jute bags',
      },
      {
        name: 'Atlantic Lithium Ghana',
        product: 'Lithium Carbonate — Battery Grade',
        sku: 'ALG-LC-2025-Q2',
        category: 'lithium-carbonate',
        origin: 'Ghana',
        weight: 15000,
        packaging: 'Industrial drums',
      },
      {
        name: 'Nyobolt Energy',
        product: 'Lithium-Ion Battery Cells — Type A',
        sku: 'NYO-BC-2025-Q1',
        category: 'batteries',
        origin: 'UK',
        weight: 5000,
        packaging: 'Recyclable cartons',
      },
      {
        name: 'SIFCA Group',
        product: 'Sustainable Palm Oil — RSPO Certified',
        sku: 'SIF-PO-2025-Q3',
        category: 'palm-oil',
        origin: 'Côte d\'Ivoire',
        weight: 30000,
        packaging: 'Flexitanks',
      },
      {
        name: 'Savannah Cotton',
        product: 'Raw Cotton — Grade A',
        sku: 'SAV-RC-2025-Q2',
        category: 'cotton-raw',
        origin: 'Mali',
        weight: 20000,
        packaging: 'Compressed bales',
      },
    ];

    const passports: Passport[] = [];

    for (let i = 0; i < 20; i++) {
      const company = companies[i % companies.length];
      const passportId = this.generatePassportId(company.origin, company.category);
      const publicUrl = `https://passports.dpp-platform.com/p/${passportId}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(publicUrl)}`;

      const passport = this.passportRepo.create({
        passportId,
        productName: company.product,
        sku: `${company.sku}-${String(i + 1).padStart(3, '0')}`,
        category: company.category,
        manufacturer: company.name,
        countryOfOrigin: company.origin,
        materials: [
          {
            name: company.category.replace('-', ' '),
            percentage: 100,
            origin: company.origin,
          },
        ],
        weightKg: company.weight + Math.floor(Math.random() * 5000),
        packaging: {
          type: company.packaging,
          recyclable: true,
        },
        carbonFootprint: this.carbonService.calculate(company.category, company.weight),
        complianceStatus: {
          euDpp: 'compliant',
          eudr: 'geolocation_verified',
          gs1: 'standard_format',
        },
        qrCodeUrl,
        publicUrl,
      });

      passports.push(passport);
    }

    await this.passportRepo.save(passports);
    console.log(`✅ Seeded ${passports.length} demo passports`);
  }
}
