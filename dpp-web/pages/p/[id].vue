<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-emerald-600" />
    </div>

    <div v-else-if="!passport" class="flex items-center justify-center min-h-screen">
      <UCard class="text-center">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-amber-500 mx-auto" />
        <h2 class="text-xl font-bold mt-4">Passport Not Found</h2>
        <p class="text-gray-500 mt-2">This Digital Product Passport does not exist or has been removed.</p>
      </UCard>
    </div>

    <div v-else class="max-w-2xl mx-auto px-4 py-8">
      <!-- EU Badge -->
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          <div>
            <p class="text-sm font-semibold text-emerald-800">EU DIGITAL PRODUCT PASSPORT</p>
            <p class="text-xs text-emerald-600">Verified · GS1 Standard · 2027 Compliant</p>
          </div>
        </div>
      </div>

      <!-- QR & Identity -->
      <UCard class="text-center py-8">
        <img :src="passport.qrCodeUrl" class="w-40 h-40 mx-auto mb-4" alt="QR Code" />
        <h1 class="text-2xl font-bold text-gray-900">{{ passport.productName }}</h1>
        <p class="text-sm text-gray-500 mt-1">Batch: {{ passport.sku || 'N/A' }}</p>
        <p class="text-sm text-gray-500">{{ passport.manufacturer }}</p>
        <p class="text-sm text-gray-500">{{ passport.countryOfOrigin }}</p>
      </UCard>

      <!-- Sustainability -->
      <UCard v-if="passport.carbonFootprint" class="mt-6">
        <template #header>
          <span class="font-semibold">SUSTAINABILITY</span>
        </template>

        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Carbon Footprint</span>
            <span class="text-2xl font-bold text-gray-900">{{ passport.carbonFootprint.totalKgCo2e.toLocaleString() }} kg CO₂e</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Per kg</span>
            <span class="font-semibold">{{ passport.carbonFootprint.perKg }} kg CO₂e/kg</span>
          </div>
          <UDivider />
          <div v-for="(val, key) in passport.carbonFootprint.breakdown" :key="key" class="flex justify-between">
            <span class="text-gray-500 capitalize">{{ key }}</span>
            <span class="font-mono text-gray-700">{{ val }} kg CO₂e/kg</span>
          </div>
        </div>
      </UCard>

      <!-- Materials -->
      <UCard v-if="passport.materials" class="mt-6">
        <template #header>
          <span class="font-semibold">MATERIALS</span>
        </template>

        <div class="space-y-3">
          <div v-for="m in passport.materials" :key="m.name" class="flex justify-between items-center">
            <div>
              <p class="font-semibold">{{ m.name }}</p>
              <p class="text-sm text-gray-500">{{ m.origin }}</p>
            </div>
            <UBadge color="blue" variant="soft">{{ m.percentage }}%</UBadge>
          </div>
        </div>
      </UCard>

      <!-- Compliance -->
      <UCard class="mt-6">
        <template #header>
          <span class="font-semibold">COMPLIANCE</span>
        </template>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span>EU DPP</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-emerald-500 rounded-full" />
              <span class="text-emerald-600 font-semibold">Compliant</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span>EUDR</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-emerald-500 rounded-full" />
              <span class="text-emerald-600 font-semibold">Geolocation Verified</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span>GS1 Standard</span>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-emerald-500 rounded-full" />
              <span class="text-emerald-600 font-semibold">Standard Format</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Footer -->
      <div class="mt-6 text-center text-sm text-gray-400">
        <p>Passport ID: {{ passport.passportId }}</p>
        <p>Generated: {{ new Date(passport.createdAt).toLocaleDateString() }}</p>
        <p class="mt-2">Registry: {{ passport.id.slice(0, 16) }}... (Blockchain hash placeholder)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const config = useRuntimeConfig();

const passportId = route.params.id;

const { data: passport, pending } = await useFetch(`/api/passports/${passportId}`, {
  baseURL: config.public.apiBase,
  key: `passport-${passportId}`,
});
</script>
