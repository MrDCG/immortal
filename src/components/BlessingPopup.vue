<template>
  <Teleport to="body">
    <Transition name="blessing">
      <div v-if="visible" class="blessing-popup-overlay" @click="handleClose">
        <div class="blessing-popup" :style="{ borderColor: god.color }">
          <!-- 装饰元素 -->
          <div class="popup-decoration">
            <span class="deco-item" v-for="i in 8" :key="i" :style="{ '--delay': i * 0.1 + 's' }">✨</span>
          </div>

          <!-- 祈福语内容 -->
          <div class="blessing-content">
            <div class="blessing-icon">{{ god.type === 'wealth' ? '💰' : '💕' }}</div>
            <p class="blessing-text">{{ blessing }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { God } from '@/types'

interface Props {
  god: God
}

const props = defineProps<Props>()

const visible = ref(false)
const blessing = ref('')

const show = () => {
  const blessings = props.god.blessings
  const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)]
  blessing.value = randomBlessing
  visible.value = true

  // 2秒后自动消失
  setTimeout(() => {
    visible.value = false
  }, 2000)
}

const handleClose = () => {
  visible.value = false
}

defineExpose({ show })
</script>

<style scoped>
.blessing-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.blessing-popup {
  position: relative;
  padding: 30px 50px;
  background: linear-gradient(135deg, #fff8f0 0%, #ffe8d0 100%);
  border-radius: 20px;
  border: 3px solid;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(212, 175, 55, 0.3);
  text-align: center;
  max-width: 90%;
}

/* 装饰元素 */
.popup-decoration {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
}

.deco-item {
  font-size: 16px;
  animation: deco-float 1.5s ease-in-out infinite;
  animation-delay: var(--delay);
}

@keyframes deco-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(10deg);
  }
}

.blessing-content {
  position: relative;
  z-index: 1;
}

.blessing-icon {
  font-size: 4rem;
  margin-bottom: 15px;
  animation: icon-bounce 0.5s ease;
}

@keyframes icon-bounce {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.blessing-text {
  font-size: 2rem;
  font-weight: bold;
  color: #8b4513;
  margin: 0;
  text-shadow: 1px 1px 2px rgba(212, 175, 55, 0.3);
}

/* 进入退出动画 */
.blessing-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.blessing-leave-active {
  transition: all 0.2s ease;
}

.blessing-enter-from,
.blessing-leave-to {
  opacity: 0;
}

.blessing-enter-from .blessing-popup,
.blessing-leave-to .blessing-popup {
  transform: scale(0.5);
}

@media (max-width: 768px) {
  .blessing-popup {
    padding: 20px 30px;
  }

  .blessing-text {
    font-size: 1.5rem;
  }

  .blessing-icon {
    font-size: 3rem;
  }
}
</style>
