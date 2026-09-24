<template>
  <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-4">
    <div>
      <h2 class="text-subtitle-1 font-weight-bold">{{ title }}</h2>
      <p class="text-caption text-grey mb-0">{{ subtitle }}</p>
    </div>
    <div class="d-flex align-center ga-4">
      <v-text-field
        :model-value="searchValue"
        @update:model-value="$emit('update:searchValue',$event)"
        prepend-inner-icon="mdi-magnify"
        :placeholder="placeholder"
        variant="outlined"
        density="compact"
        hide-details
        rounded="lg"
        style="min-width: 280px;"
      ></v-text-field>

      <v-btn
        variant="outlined"
        color="success"
        rounded="lg"
        prepend-icon="mdi-download"
        class="text-none font-weight-bold ml-4"
        @click="exportToCSV"
      >
        Download
      </v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  searchValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Search...' },
  // Data array & header kolom untuk keperluan download
  tableData: { type: Array, default: () => [] },
  tableHeaders: { type: Array, default: () => [] },
  filename: { type: String, default: 'report.csv' }
})

defineEmits(['update:searchValue'])

// Fungsi otomatis mendownload isi data tabel ke format CSV
const exportToCSV = () => {
  if (!props.tableData || props.tableData.length === 0) {
    alert('Tidak ada data tabel untuk di-download!')
    return
  }

  // Filter header yang valid (mengabaikan kolom action jika ada)
  const headersToExport = props.tableHeaders.filter(h => h.key && h.key !== 'action')

  // 1. Buat Baris Header CSV
  const headerRow = headersToExport.map(h => `"${h.title}"`).join(',')

  // 2. Buat Baris Data CSV
  const dataRows = props.tableData.map(row => {
    return headersToExport
      .map(h => {
        let val = row[h.key]
        // Jika nilai berbentuk Array (seperti campaign), gabungkan dengan spasi
        if (Array.isArray(val)) {
          val = val.join(' ')
        }
        val = val !== undefined && val !== null ? val : ''
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(',')
  })

  // 3. Gabungkan seluruh baris CSV
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\n')

  // 4. Trigger download file di browser
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', props.filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>