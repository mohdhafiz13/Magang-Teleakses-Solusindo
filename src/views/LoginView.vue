<template>
  <v-container fluid class="fill-height bg-grey-lighten-4 pa-6 pa-md-10">
    <v-card elevation="2" class="fill-height w-100 rounded-xl overflow-hidden bg-white">
      <v-row no-gutters class="fill-height align-stretch">
        <!-- Kolom Kiri: Banner Gambar Kustom -->
        <v-col cols="12" md="6" class="pa-4 pa-md-6 d-none d-md-flex flex-column">
          <div 
            class="banner-card flex-grow-1 rounded-24 d-flex flex-column justify-end pa-8 pa-md-10 text-white overflow-hidden"
            :style="bannerStyle"
          >
            <div class="banner-content">
              <p class="text-subtitle-1 font-weight-regular mb-1 text-grey-lighten-3">Hello, Welcome Back to</p>
              <h1 class="text-h3 font-weight-bold mb-3">Supervisor ACD</h1>
              <p class="text-body-2 text-grey-lighten-2 line-height-relaxed" style="max-width: 360px;">
                Sign in to monitor agent performance and manage call center operations in real-time
              </p>
            </div>
          </div>
        </v-col>

        <!-- Kolom Kanan: Form Login -->
        <v-col cols="12" md="6" class="d-flex flex-column justify-space-between pa-6 pa-md-12 fill-height">
          <div></div>

          <div class="login-form-container mx-auto w-100" style="max-width: 380px;">
            <!-- Logo TelAccess -->
            <div class="text-center mb-6">
              <v-img
                :src="logoImage"
                alt="TelAccess Logo"
                max-width="180"
                class="mx-auto mb-4"
              ></v-img>
              <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-1">Sign in to your account</h2>
              <p class="text-caption text-grey">Enter your username and password to sign in</p>
            </div>

            <!-- Form Login -->
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">Username</div>
              <v-text-field
                v-model="form.username"
                placeholder="Enter your username"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="grey-lighten-5"
                append-inner-icon="mdi-account-outline"
                class="mb-2"
                :rules="[v => !!v || 'Username wajib diisi']"
                required
              ></v-text-field>

              <div class="text-caption font-weight-bold text-grey-darken-2 mb-1">Password</div>
              <v-text-field
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                variant="outlined"
                density="compact"
                rounded="lg"
                bg-color="grey-lighten-5"
                :append-inner-icon="showPassword ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                @click:append-inner="showPassword = !showPassword"
                class="mb-4"
                :rules="[v => !!v || 'Password wajib diisi']"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="#1E75FF"
                block
                size="large"
                rounded="lg"
                class="text-none font-weight-bold text-white elevation-0"
                :loading="authStore.loading"
              >
                Sign In
              </v-btn>
            </v-form>
          </div>

          <div class="text-center text-caption text-grey mt-6">
            Copyright © 2026 Tel-Access. All Rights Reserved.
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Pop-up Dialog Error Login -->
    <v-dialog v-model="showErrorDialog" max-width="400">
      <v-card class="pa-4 text-center rounded-xl">
        <v-card-text class="pt-4">
          <v-avatar color="red-lighten-5" size="64" class="mb-4">
            <v-icon color="red" size="36" icon="mdi-alert-circle-outline"></v-icon>
          </v-avatar>
          <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">Login Gagal</h3>
          <p class="text-body-2 text-grey-darken-1">
            {{ authStore.error || 'Username atau password yang kamu masukkan salah. Silakan coba lagi.' }}
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pb-2">
          <v-btn
            color="red"
            variant="flat"
            rounded="lg"
            block
            class="text-none font-weight-bold text-white"
            @click="showErrorDialog = false"
          >
            Coba Lagi
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import logoImage from '../assets/cropped-Logo-Site.png'
import heroImage from '../assets/pngtree-hands-typing-on-laptop-keyboard-with-blue-glo-image_16696687.jpg'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const showErrorDialog = ref(false)
const loginForm = ref(null)

const bannerStyle = computed(() => ({
  backgroundImage: `linear-gradient(180deg, rgba(15, 34, 102, 0.2) 0%, rgba(10, 25, 82, 0.6) 60%, rgba(7, 18, 62, 0.9) 100%), url(${heroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
}))

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  const success = await authStore.login({
    username: form.username,
    password: form.password,
  })

  if (success) {
    router.push('/')
  } else {
    // Tampilkan pop-up jika login gagal
    showErrorDialog.value = true
  }
}
</script>

<style scoped>
.banner-card {
  position: relative;
  min-height: 100%;
  width: 100%;
}

.rounded-24 {
  border-radius: 24px !important;
}

.line-height-relaxed {
  line-height: 1.5;
}

:deep(.v-row) {
  height: 100%;
}
</style>