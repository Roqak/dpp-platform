import { Controller, Get, Post, Body, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PassportsService } from './services/passports.service';
import { CreatePassportDto } from './dto/create-passport.dto';
import { Passport } from './entities/passport.entity';

@ApiTags('passports')
@Controller('passports')
export class PassportsController {
  constructor(private readonly passportsService: PassportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Digital Product Passport' })
  @ApiResponse({ status: 201, description: 'Passport created', type: Passport })
  create(@Body() dto: CreatePassportDto): Promise<Passport> {
    return this.passportsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all passports' })
  findAll(): Promise<Passport[]> {
    return this.passportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a passport by ID' })
  findOne(@Param('id') id: string): Promise<Passport | null> {
    return this.passportsService.findOne(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generate PDF for a passport' })
  @ApiResponse({ status: 200, description: 'PDF generated' })
  async generatePdf(@Param('id') id: string, @Res() res: Response): Promise<void> {
    const passport = await this.passportsService.findOne(id);
    if (!passport) {
      res.status(404).json({ message: 'Passport not found' });
      return;
    }
    const pdf = await this.passportsService.generatePdf(passport);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${passport.passportId}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  }
}
