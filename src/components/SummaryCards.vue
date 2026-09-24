<template>
  <v-row class="mb-4">
    <v-col
      v-for="(card, i) in items"
      :key="i"
      cols="12"
      sm="4"
      :md="colWidth"
    >
      <v-card elevation="0" border class="rounded-xl pa-4 bg-white h-100">
        <div class="d-flex align-center ga-2 text-caption font-weight-bold text-grey-darken-2 mb-2">
          <!-- Ditambahkan v-avatar untuk background lembut di belakang ikon -->
          <v-avatar :color="card.bgColor || 'blue-lighten-5'" size="28" rounded="lg">
            <v-icon :icon="card.icon" :color="card.color" size="16"></v-icon>
          </v-avatar>
          <span>{{ card.title }}</span>
        </div>
        <div class="text-h4 font-weight-bold">{{ card.value }}</div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
  colWidth: { type: Number, default: 2 }
})
</script>