<template>
  <div class="d-flex align-center justify-space-between pt-4 pb-2 px-2 flex-wrap ga-4">
    <!-- Informasi Total Data Kiri -->
    <div class="text-caption text-grey-darken-1">
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems.toLocaleString() }} entries
    </div>

    <!-- Pagination Kotak-Kotak Terpisah Figma Kanan -->
    <div class="d-flex align-center ga-2">
      <!-- Tombol Previous -->
      <button
        class="page-btn page-btn-nav"
        :disabled="page === 1"
        @click="updatePage(page - 1)"
      >
        &lt; Previous
      </button>

      <!-- Nomor Halaman -->
      <template v-for="(p, index) in displayedPages" :key="index">
        <!-- Jika Ellipsis (...) -->
        <span v-if="p === '...'" class="page-btn page-btn-dots">...</span>
        
        <!-- Jika Nomor Halaman -->
        <button
          v-else
          class="page-btn page-btn-num"
          :class="{ 'active': p === page }"
          @click="updatePage(p)"
        >
          {{ p }}
        </button>
      </template>

      <!-- Tombol Next -->
      <button
        class="page-btn page-btn-nav"
        :disabled="page === totalPages"
        @click="updatePage(page + 1)"
      >
        Next &gt;
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    required: true,
    default: 1
  },
  itemsPerPage: {
    type: Number,
    required: true,
    default: 50
  },
  totalItems: {
    type: Number,
    required: true,
    default: 1250
  }
})

const emit = defineEmits(['update:page'])

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.itemsPerPage) || 1
})

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.page - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.page * props.itemsPerPage, props.totalItems)
})

// Logika Logis Menampilkan Nomor Halaman Presisi Figma (misal: 1, 2, 3, 4, ..., 25)
const displayedPages = computed(() => {
  const current = props.page
  const total = totalPages.value
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
})

const updatePage = (newPage) => {
  if (newPage >= 1 && newPage <= totalPages.value) {
    emit('update:page', newPage)
  }
}
</script>

<style scoped>
/* Styling Kotak Pagination Presisi Figma */
.page-btn {
  height: 36px;
  background-color: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #1E293B;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  user-select: none;
}

.page-btn-nav {
  padding: 0 14px;
}

.page-btn-num {
  min-width: 36px;
  padding: 0 8px;
}

.page-btn-dots {
  min-width: 36px;
  border-color: #E2E8F0;
  cursor: default;
  color: #64748B;
}

/* State Hover & Active */
.page-btn:hover:not(:disabled):not(.active):not(.page-btn-dots) {
  border-color: #CBD5E1;
  background-color: #F8FAFC;
}

.page-btn.active {
  background-color: #1E75FF !important;
  border-color: #1E75FF !important;
  color: #FFFFFF !important;
  font-weight: 600;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #E2E8F0;
}
</style>