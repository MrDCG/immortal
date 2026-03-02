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

  // 获取本地日期字符串 (YYYY-MM-DD 格式)
  const getLocalDateString = (): string => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const addIncense = (godId: string) => {
    // 使用本地时间而不是 UTC 时间，避免时区问题
    const today = getLocalDateString()
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
    // 使用本地时间而不是 UTC 时间，避免时区问题
    const today = getLocalDateString()
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
