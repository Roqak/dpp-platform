<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Digital Product Passport</h1>
              <p class="text-sm text-gray-500">EU Compliance · GS1 Standard · 2027 Ready</p>
            </div>
          </div>
          <UButton color="emerald" to="/passports/new" icon="i-heroicons-plus">
            Create Passport
          </UButton>
        </div>
      </div>
    </header>

    <!-- Stats -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-document-check" class="text-emerald-600" />
              <span class="font-semibold">Passports Generated</span>
            </div>
          </template>
          <p class="text-3xl font-bold text-gray-900">{{ passports.length }}</p>
          <p class="text-sm text-gray-500 mt-1">Across all product categories</p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-globe-europe-africa" class="text-blue-600" />
              <span class="font-semibold">Countries Covered</span>
            </div>
          </template>
          <p class="text-3xl font-bold text-gray-900">{{ uniqueCountries }}</p>
          <p class="text-sm text-gray-500 mt-1">Nigeria, Ghana, Mali, and more</p>
        </UCard>

        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check" class="text-emerald-600" />
              <span class="font-semibold">Compliance Status</span>
            </div>
          </template>
          <p class="text-3xl font-bold text-emerald-600">100%</p>
          <p class="text-sm text-gray-500 mt-1">GS1 + EU DPP + EUDR Ready</p>
        </UCard>
      </div>

      <!-- Table -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center justify-between">
            <span class="font-semibold text-lg">Recent Passports</span>
            <UBadge color="emerald" variant="soft">Live</UBadge>
          </div>
        </template>

        <UTable :rows="passports" :columns="columns" :loading="pending">
          <template #qrCodeUrl-data="{ row }">
            <img :src="row.qrCodeUrl" class="w-12 h-12" alt="QR" />
          </template>
          <template #publicUrl-data="{ row }">
            <UButton
              :to="row.publicUrl"
              target="_blank"
              variant="ghost"
              color="blue"
              size="xs"
              icon="i-heroicons-arrow-top-right-on-square"
            >
              View
            </UButton>
          </template>
          <template #complianceStatus-data="{ row }">
            <div class="flex gap-2">
              <UBadge color="emerald" size="xs">EU DPP</UBadge>
              <UBadge color="emerald" size="xs">EUDR</UBadge>
              <UBadge color="emerald" size="xs">GS1</UBadge>
            </div>
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { data: passports, pending } = await useFetch('/api/passports');

const columns = [
  { key: 'passportId', label: 'Passport ID' },
  { key: 'productName', label: 'Product' },
  { key: 'manufacturer', label: 'Manufacturer' },
  { key: 'countryOfOrigin', label: 'Origin' },
  { key: 'qrCodeUrl', label: 'QR' },
  { key: 'publicUrl', label: 'Link' },
  { key: 'complianceStatus', label: 'Status' },
];

const uniqueCountries = computed(() => {
  if (!passports.value) return 0;
  return new Set(passports.value.map(p => p.countryOfOrigin)).size;
});
</script>
