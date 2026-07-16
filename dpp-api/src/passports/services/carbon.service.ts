import { Injectable } from '@nestjs/common';

// Simple lookup table for POC — open-source LCA emission factors
const EMISSION_FACTORS: Record<string, Record<string, number>> = {
  'cocoa-beans': { agriculture: 2.3, processing: 0.8, transport: 1.1 },
  'palm-oil': { agriculture: 3.1, processing: 1.2, transport: 0.9 },
  'cotton-raw': { agriculture: 8.3, processing: 2.1, transport: 1.5 },
  'lithium-carbonate': { mining: 15.0, processing: 8.2, transport: 2.0 },
  'cobalt': { mining: 12.0, processing: 6.5, transport: 2.0 },
  'nickel': { mining: 9.0, processing: 5.0, transport: 1.8 },
  'graphite': { mining: 3.5, processing: 2.0, transport: 1.2 },
  'zinc': { mining: 4.0, processing: 2.5, transport: 1.0 },
  'default': { agriculture: 1.0, processing: 0.5, transport: 0.5 },
};

@Injectable()
export class CarbonService {
  calculate(category: string, weightKg: number): {
    totalKgCo2e: number;
    perKg: number;
    breakdown: Record<string, number>;
  } {
    const key = category.toLowerCase().replace(/[^a-z-]/g, '-');
    const factors = EMISSION_FACTORS[key] || EMISSION_FACTORS['default'];

    const perKg = Object.values(factors).reduce((sum, v) => sum + v, 0);
    const totalKgCo2e = Math.round(perKg * weightKg);

    return {
      totalKgCo2e,
      perKg: Math.round(perKg * 100) / 100,
      breakdown: factors,
    };
  }
}
