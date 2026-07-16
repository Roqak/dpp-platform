import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
}
