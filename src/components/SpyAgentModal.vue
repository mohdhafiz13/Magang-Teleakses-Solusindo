<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="900px" scrollable>
    <v-card class="rounded-xl pa-2">
      <!-- Header Modal -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center ga-3">
          <v-avatar color="blue-lighten-5" size="42" rounded="lg">
            <v-icon icon="mdi-headphones" color="primary" size="24"></v-icon>
          </v-avatar>
          <div>
            <div class="text-h6 font-weight-bold">Spy Agent</div>
            <div class="text-caption text-grey">Monitoring agent ongoing call in real-time.</div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('update:modelValue', false)"></v-btn>
      </v-card-title>

      <v-card-text class="pa-4 pt-0">
        <v-row>
          <!-- Left Column: Audio / Call Interface -->
          <v-col cols="12" md="4">
            <v-card border elevation="0" class="rounded-xl pa-6 text-center bg-grey-lighten-5 fill-height d-flex flex-column justify-center align-center">
              <span class="text-caption font-weight-bold text-grey mb-4">In Call</span>
              
              <!-- Avatar Agent -->
              <v-avatar size="100" class="mb-3 border-lg border-primary">
                <v-img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="Agent Avatar"></v-img>
              </v-avatar>

              <div class="text-subtitle-1 font-weight-bold">{{ agentData?.name || 'Lydia Herwitz' }}</div>
              <div class="text-caption text-grey mb-6">+628232****</div>

              <!-- Call Action Buttons -->
              <div class="d-flex justify-center ga-3 mb-6">
                <v-btn icon="mdi-microphone-off" variant="tonal" size="small" color="grey-darken-2"></v-btn>
                <v-btn icon="mdi-volume-high" variant="tonal" size="small" color="grey-darken-2"></v-btn>
                <v-btn icon="mdi-pause" variant="tonal" size="small" color="grey-darken-2"></v-btn>
                <v-btn icon="mdi-dialpad" variant="tonal" size="small" color="grey-darken-2"></v-btn>
              </div>

              <!-- End Call / Mute Button -->
              <v-btn icon="mdi-phone-hangup" color="error" size="large" elevation="2"></v-btn>
            </v-card>
          </v-col>

          <!-- Right Column: Call & Customer Detail -->
          <v-col cols="12" md="8">
            <v-card border elevation="0" class="rounded-xl pa-5 bg-white fill-height">
              <div class="text-subtitle-2 font-weight-bold mb-1">Call & Customer Detail</div>
              <div class="text-caption text-grey mb-4">Detailed information about the ongoing call and customer.</div>

              <v-row density="compact" class="text-caption">
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Customer Name:</span>
                  <div class="font-weight-medium">Budi Santoso</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Disposition:</span>
                  <div class="font-weight-medium">Interested - Follow Up</div>
                </v-col>

                <v-col cols="6" class="py-1">
                  <span class="text-grey">Customer Phone:</span>
                  <div class="font-weight-medium">+6281234567890</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Attempt:</span>
                  <div class="font-weight-medium">2</div>
                </v-col>

                <v-col cols="6" class="py-1">
                  <span class="text-grey">Customer Email:</span>
                  <div class="font-weight-medium">budi.santoso@example.com</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Call Duration:</span>
                  <div class="font-weight-medium">02:32</div>
                </v-col>

                <v-col cols="6" class="py-1">
                  <span class="text-grey">Agent Full Name:</span>
                  <div class="font-weight-medium">{{ agentData?.name || 'Agent Lisa2' }}</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Call Start Time:</span>
                  <div class="font-weight-medium">20 Sep 2026, 10:40:01</div>
                </v-col>

                <v-col cols="6" class="py-1">
                  <span class="text-grey">Agent Username:</span>
                  <div class="font-weight-medium">agent1</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Call End Time:</span>
                  <div class="font-weight-medium">20 Sep 2026, 10:42:33</div>
                </v-col>

                <v-col cols="6" class="py-1">
                  <span class="text-grey">Campaign Name:</span>
                  <div class="font-weight-medium">Customer Loyalty</div>
                </v-col>
                <v-col cols="6" class="py-1">
                  <span class="text-grey">Recording URL:</span>
                  <div class="text-primary font-weight-medium text-truncate">https://recording.teleakses.com/rec123.mp3</div>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <!-- Notes / Summary -->
              <div class="text-caption font-weight-bold text-grey mb-1">Notes</div>
              <div class="text-caption bg-grey-lighten-4 pa-3 rounded-lg text-grey-darken-2">
                Selamat pagi Bapak Budi. Penawaran daya khusus tim Customer Service. Kami menghubungi Bapak untuk program loyalitas pelanggan yang saat ini berlaku.
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  agentData: { type: Object, default: () => ({}) }
})

defineEmits(['update:modelValue'])
</script>