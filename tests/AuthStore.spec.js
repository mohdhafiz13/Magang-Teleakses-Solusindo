import { setActivePinia, createPinia } from 'pinia'
import { describe, beforeEach, it, expect, vi } from 'vitest'
import { useAuthStore } from '../src/stores/auth'

describe('1. Auth Store Unit Test', () => {
  beforeEach(() => {
    // Inisialisasi ulang Pinia state
    setActivePinia(createPinia())

    // Mocking localStorage untuk lingkungan Node/Vitest
    const localStorageMock = (() => {
      let store = {}
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString() },
        removeItem: (key) => { delete store[key] },
        clear: () => { store = {} }
      }
    })()

    vi.stubGlobal('localStorage', localStorageMock)
    localStorage.clear()
  })

  it('Step 1.1: State awal user dan token harus null', () => {
    const store = useAuthStore()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('Step 1.2: Berhasil menyimpan token dan user saat login magang1', async () => {
    const store = useAuthStore()

    // Menggunakan Kredensial Asli Store: magang1 & rahasia
    const result = await store.login({ username: 'magang1', password: 'rahasia' })

    expect(result).toBe(true)
    expect(store.token).toBe('jwt-token-teleaccess-2026')
    expect(store.user).toEqual({ username: 'magang1', role: 'Supervisor' })
    expect(store.isAuthenticated).toBe(true)
    expect(store.error).toBeNull()
  })

  it('Step 1.3: Gagal login jika kredensial salah', async () => {
    const store = useAuthStore()

    // Coba login dengan password salah
    const result = await store.login({ username: 'magang1', password: 'salahpassword' })

    expect(result).toBe(false)
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Username atau password salah!')
  })

  it('Step 1.4: Reset state user dan token saat logout', async () => {
    const store = useAuthStore()

    // Login terlebih dahulu
    await store.login({ username: 'magang1', password: 'rahasia' })
    expect(store.isAuthenticated).toBe(true)

    // Panggil fungsi logout
    store.logout()

    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})