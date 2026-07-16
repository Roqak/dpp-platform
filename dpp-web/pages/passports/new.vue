<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-3">
          <UButton to="/" variant="ghost" icon="i-heroicons-arrow-left" />
          <div>
            <h1 class="text-xl font-bold text-gray-900">Create Passport</h1>
            <p class="text-sm text-gray-500">60-second flow · GS1 compliant · Instant QR</p>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Success State -->
      <div v-if="createdPassport" class="space-y-6">
        <UCard class="text-center py-12">
          <UIcon name="i-heroicons-check-circle" class="w-16 h-16 text-emerald-600 mx-auto" />
          <h2 class="text-2xl font-bold text-gray-900 mt-4">Passport Generated!</h2>
          <p class="text-gray-500 mt-2">Your Digital Product Passport is live and ready to share.</p>

          <div class="flex justify-center mt-6">
            <img :src="createdPassport.qrCodeUrl" class="w-48 h-48" alt="QR Code" />
          </div>

          <p class="font-mono text-sm text-gray-600 mt-4">{{ createdPassport.passportId }}</p>

          <div class="flex justify-center gap-3 mt-6">
            <UButton
              :to="createdPassport.publicUrl"
              target="_blank"
              color="emerald"
              icon="i-heroicons-arrow-top-right-on-square"
            >
              View Passport
            </UButton>
            <UButton
              variant="soft"
              icon="i-heroicons-clipboard"
              @click="copyUrl(createdPassport.publicUrl)"
            >
              Copy URL
            </UButton>
          </div>
        </UCard>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="submit" class="space-y-6">
        <!-- Step 1: Identity -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge color="emerald">Step 1</UBadge>
              <span class="font-semibold">Product Identity</span>
            </div>
          </template>

          <div class="space-y-4">
            <UFormGroup label="Product Name" required>
              <UInput v-model="form.productName" placeholder="Nigerian Cocoa Beans — FTN Premium Grade" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="SKU / Batch ID">
                <UInput v-model="form.sku" placeholder="FTN-CB-2025-Q3-001" />
              </UFormGroup>
              <UFormGroup label="Category" required>
                <USelect
                  v-model="form.category"
                  :options="categories"
                  placeholder="Select category"
                />
              </UFormGroup>
            </div>

            <UFormGroup label="Manufacturer" required>
              <UInput v-model="form.manufacturer" placeholder="FTN Cocoa Processors Plc" />
            </UFormGroup>

            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Country of Origin" required>
                <USelect
                  v-model="form.countryOfOrigin"
                  :options="countries"
                  placeholder="Select country"
                />
              </UFormGroup>
              <UFormGroup label="Weight (kg)">
                <UInput v-model.number="form.weightKg" type="number" placeholder="25000" />
              </UFormGroup>
            </div>
          </div>
        </UCard>

        <!-- Step 2: Materials -->
        <UCard>
          <template #header>
            <div class="flex items-center gap-2">
              <UBadge color="emerald">Step 2</UBadge>
              <span class="font-semibold">Materials &amp; Composition</span>
            </div>
          </template>

          <div class="space-y-4">
            <div v-for="(material, index) in form.materials" :key="index" class="grid grid-cols-3 gap-3 items-end">
              <UFormGroup :label="index === 0 ? 'Material' : ''">
                <UInput v-model="material.name" placeholder="Cocoa beans" />
              </UFormGroup>
              <UFormGroup :label="index === 0 ? '%' : ''">
                <UInput v-model.number="material.percentage" type="number" placeholder="100" />
              </UFormGroup>
              <UFormGroup :label="index === 0 ? 'Origin' : ''">
                <UInput v-model="material.origin" placeholder="Ondo State, Nigeria" />
              </UFormGroup>
            </div>
            <UButton variant="ghost" size="xs" icon="i-heroicons-plus" @click="addMaterial">
              Add Material
            </UButton>

            <UFormGroup label="Packaging Type">
              <UInput v-model="form.packaging.type" placeholder="Jute bags" />
            </UFormGroup>
          </div>
        </UCard>

        <!-- Submit -->
        <UButton
          type="submit"
          color="emerald"
          size="lg"
          block
          :loading="submitting"
          icon="i-heroicons-sparkles"
        >
          {{ submitting ? 'Generating Passport...' : 'Generate Passport' }}
        </UButton>
      </form>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const form = reactive({
  productName: '',
  sku: '',
  category: '',
  manufacturer: '',
  countryOfOrigin: '',
  weightKg: null,
  materials: [{ name: '', percentage: 100, origin: '' }],
  packaging: { type: '', recyclable: true },
});

const categories = ['cocoa-beans', 'palm-oil', 'cotton-raw', 'lithium-carbonate', 'cobalt', 'nickel', 'graphite', 'textiles', 'batteries'];
const countries = ['Nigeria', 'Ghana', 'Mali', 'DRC', 'Zambia', 'Tanzania', 'Uganda', 'Kenya'];

const submitting = ref(false);
const createdPassport = ref(null);

function addMaterial() {
  form.materials.push({ name: '', percentage: 0, origin: '' });
}

async function submit() {
  submitting.value = true;
  try {
    const data = await $fetch(`${config.public.apiBase}/passports`, {
      method: 'POST',
      body: form,
    });
    createdPassport.value = data;
  } catch (err) {
    console.error('Failed to create passport:', err);
    alert('Failed to generate passport. Please try again.');
  } finally {
    submitting.value = false;
  }
}

function copyUrl(url) {
  navigator.clipboard.writeText(url);
}
</script>
