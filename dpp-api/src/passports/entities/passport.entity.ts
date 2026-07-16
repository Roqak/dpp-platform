import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('passports')
export class Passport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  passportId: string;

  @Column()
  productName: string;

  @Column({ nullable: true })
  sku: string;

  @Column()
  category: string;

  @Column()
  manufacturer: string;

  @Column()
  countryOfOrigin: string;

  @Column({ type: 'simple-json', nullable: true })
  materials: { name: string; percentage: number; origin: string }[];

  @Column({ type: 'float', nullable: true })
  weightKg: number;

  @Column({ type: 'simple-json', nullable: true })
  packaging: { type: string; recyclable: boolean };

  @Column({ type: 'simple-json', nullable: true })
  carbonFootprint: {
    totalKgCo2e: number;
    perKg: number;
    breakdown: Record<string, number>;
  };

  @Column({ type: 'simple-json', nullable: true })
  complianceStatus: {
    euDpp: string;
    eudr: string;
    gs1: string;
  };

  @Column({ nullable: true })
  qrCodeUrl: string;

  @Column({ nullable: true })
  publicUrl: string;

  @Column({ nullable: true })
  pdfUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
