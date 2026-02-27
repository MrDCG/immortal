import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { God, IncenseRecord } from '@/types'

export const useIncenseStore = defineStore('incense', () => {
  // 状态
  const currentGodIndex = ref(0)
  const incenseRecords = ref<Record<string, IncenseRecord>>({})

  // 计算属性
  const currentGod = computed(() => (gods: God[]) => {
    return gods[currentGodIndex.value] || null
  })

  // 方法
  const setCurrentGodIndex = (index: number) => {
    currentGodIndex.value = index
  }

  const nextGod = () => {
    currentGodIndex.value = (currentGodIndex.value + 1) % gods.length
  }

  const prevGod = () => {
    currentGodIndex.value = (currentGodIndex.value - 1 + gods.length) % gods.length
  }

  const addIncense = (godId: string) => {
    const today = new Date().toISOString().split('T')[0]
    const key = `${godId}_${today}`
    incenseRecords.value = {
      ...incenseRecords.value,
      [key]: {
        godId,
        date: today,
        count: (incenseRecords.value[key]?.count || 0) + 1,
      },
    }
  }

  const getTodayIncenseCount = (godId: string): number => {
    const today = new Date().toISOString().split('T')[0]
    const key = `${godId}_${today}`
    return incenseRecords.value[key]?.count || 0
  }

  const getCurrentGod = (gods: God[]): God | null => {
    return gods[currentGodIndex.value] || null
  }

  const reset = () => {
    currentGodIndex.value = 0
    incenseRecords.value = {}
  }

  return {
    currentGodIndex,
    incenseRecords,
    setCurrentGodIndex,
    nextGod,
    prevGod,
    addIncense,
    getTodayIncenseCount,
    getCurrentGod,
    reset,
  }
}, {
  persist: {
    key: 'incense-storage',
  },
})
