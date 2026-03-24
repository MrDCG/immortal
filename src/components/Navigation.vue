<template>
  <div class="navigation">
    <button
      class="nav-btn prev"
      @click="prevGod"
      :disabled="currentIndex === 0"
      aria-label="上一个神仙"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>

    <div class="god-indicators">
      <button
        v-for="(god, index) in gods"
        :key="god.id"
        class="indicator"
        :class="{ active: index === currentIndex }"
        @click="goToGod(index)"
        :style="{ '--god-color': god.color }"
        :title="god.name"
      >
        <span class="indicator-dot"></span>
      </button>
    </div>

    <button
      class="nav-btn next"
      @click="nextGod"
      :disabled="currentIndex === gods.length - 1"
      aria-label="下一个神仙"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { gods } from '@/data/gods'

const props = defineProps<{
  currentIndex: number
}>()

const emit = defineEmits<{
  prev: []
  next: []
  goTo: [index: number]
}>()

const prevGod = () => {
  if (props.currentIndex > 0) {
    emit('prev')
  }
}

const nextGod = () => {
  if (props.currentIndex < gods.length - 1) {
    emit('next')
  }
}

const goToGod = (index: number) => {
  emit('goTo', index)
}
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 30;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(212, 175, 55, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #8b4513;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

.nav-btn.prev {
  left: 20px;
}

.nav-btn.next {
  right: 20px;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.nav-btn:active:not(:disabled) {
  transform: translateY(-50%) scale(0.95);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.god-indicators {
  position: absolute;
  bottom: 180px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  align-items: center;
  pointer-events: auto;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(212, 175, 55, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
}

.indicator.active {
  background: var(--god-color, #D4AF37);
  border-color: var(--god-color, #D4AF37);
  transform: scale(1.3);
  box-shadow: 0 0 10px var(--god-color, #D4AF37);
}

.indicator-dot {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--god-color, #D4AF37);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.indicator.active .indicator-dot {
  opacity: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .nav-btn.prev {
    left: 10px;
  }

  .nav-btn.next {
    right: 10px;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    opacity: 0.7;
  }

  .nav-btn svg {
    width: 18px;
    height: 18px;
  }

  .god-indicators {
    bottom: 70px;
  }

  .indicator {
    width: 8px;
    height: 8px;
  }
}
</style>
