<template>
  <div class="counter">
    <div class="counter-icon">📿</div>
    <span class="counter-text">今日上香：{{ count }}次</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useIncenseStore } from '@/stores/incense'
import { gods } from '@/data/gods'

const incenseStore = useIncenseStore()
const count = ref(0)

// 使用计算属性获取当前神仙ID
const currentGodId = computed(() => {
  return gods[incenseStore.currentGodIndex]?.id || ''
})

// 监听当前神仙变化和上香次数变化
watch(
  [currentGodId, () => incenseStore.incenseRecords],
  () => {
    count.value = incenseStore.getTodayIncenseCount(currentGodId.value)
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.counter {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 2px solid #d4af37;
  white-space: nowrap;
}

.counter-icon {
  font-size: 1.5rem;
}

.counter-text {
  font-size: 1rem;
  font-weight: 600;
  color: #8b4513;
}

@media (max-width: 768px) {
  .counter {
    top: 10px;
    right: 10px;
    padding: 8px 15px;
  }

  .counter-icon {
    font-size: 1.2rem;
  }

  .counter-text {
    font-size: 0.9rem;
  }
}
</style>
