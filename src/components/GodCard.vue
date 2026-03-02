<template>
  <div class="page">
    <!-- 右上角计数器 -->
    <div class="counter-fixed">
      <Counter />
    </div>

    <!-- 光环 -->
    <div class="glow"></div>

    <!-- 关羽图片 - 帧动画 -->
    <img
      :src="currentImage"
      :alt="god.name"
      class="god-image"
    />

    <!-- 右侧描述 -->
    <div class="god-desc">西路财神 关羽</div>

    <!-- 上香按钮 -->
    <div class="actions">
      <Incense @complete="showBlessing" />
    </div>

    <!-- 祈福语弹窗 -->
    <BlessingPopup ref="blessingPopupRef" :god="god" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { God } from '@/types'
import Counter from './Counter.vue'
import Incense from './Incense.vue'
import BlessingPopup from './BlessingPopup.vue'

const props = defineProps<{ god: God }>()
const blessingPopupRef = ref<InstanceType<typeof BlessingPopup>>()

// 帧动画相关状态
const currentFrameIndex = ref(0)
let animationFrameId: number | null = null
let lastTimestamp = 0

// 检查是否使用帧动画
const useFrameAnimation = computed(() => {
  return props.god.images.frames && props.god.images.frames.length > 0
})

// 获取当前显示的图片
const currentImage = computed(() => {
  if (useFrameAnimation.value && props.god.images.frames) {
    return props.god.images.frames[currentFrameIndex.value]
  }
  // 兼容旧版静态图片
  return props.god.images.default || ''
})

// 帧动画配置
const animationConfig = computed(() => {
  return {
    fps: props.god.animation?.fps || 12,
    loop: props.god.animation?.loop !== false,
  }
})

// 预加载所有帧图片
const preloadFrames = () => {
  if (!useFrameAnimation.value) return

  const frames = props.god.images.frames!
  frames.forEach((src) => {
    const img = new Image()
    img.src = src
  })
}

// 帧动画循环
const animateFrames = (timestamp: number) => {
  if (!lastTimestamp) lastTimestamp = timestamp

  const elapsed = timestamp - lastTimestamp
  const frameInterval = 1000 / animationConfig.value.fps

  if (elapsed >= frameInterval) {
    const frameCount = props.god.images.frames?.length || 1

    // 前进到下一帧
    currentFrameIndex.value = (currentFrameIndex.value + 1) % frameCount

    lastTimestamp = timestamp
  }

  if (animationConfig.value.loop) {
    animationFrameId = requestAnimationFrame(animateFrames)
  }
}

// 启动帧动画
const startFrameAnimation = () => {
  if (!useFrameAnimation.value) return

  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  lastTimestamp = 0
  animationFrameId = requestAnimationFrame(animateFrames)
}

// 停止帧动画
const stopFrameAnimation = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
}

// 旧版眨眼动画（兼容非帧动画神仙）
const isEyesClosed = ref(false)
let blinkTimer: number | undefined

const startBlink = () => {
  if (useFrameAnimation.value) return

  blinkTimer = window.setInterval(() => {
    isEyesClosed.value = true
    setTimeout(() => { isEyesClosed.value = false }, 120)
  }, 5000 + Math.random() * 3000)
}

const showBlessing = () => {
  blessingPopupRef.value?.show()
}

onMounted(() => {
  preloadFrames()
  if (useFrameAnimation.value) {
    startFrameAnimation()
  } else {
    startBlink()
  }
})

onUnmounted(() => {
  stopFrameAnimation()
  if (blinkTimer) clearInterval(blinkTimer)
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url('/assets/画轴背景.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* 右上角计数器 */
.counter-fixed {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

/* 光环 */
.glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 60%);
  animation: glow-pulse 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 关羽图片 */
.god-image {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(calc(-50% + 3px), calc(-42% - 60px));
  z-index: 10;
  width: 380px;
  height: 570px;
  object-fit: cover;
  border-radius: 15px;
  filter: drop-shadow(0 5px 20px rgba(139, 0, 0, 0.15));
}

/* 神仙描述 */
.god-desc {
  position: absolute;
  top: 66%;
  left: calc(51% + 221px);
  transform: translateY(-50%);
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-size: 1.3rem;
  font-weight: 600;
  color: #8b0000;
  letter-spacing: 8px;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
  z-index: 10;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

/* 上香按钮 - 使用固定像素值确保跨浏览器一致 */
.actions {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

/* 响应式 */
@media (max-width: 768px) {
  .counter-fixed {
    top: 10px;
    right: 10px;
  }

  .god-image {
    width: 200px;
    height: 340px;
    border-radius: 15px;
  }

  .glow {
    width: 250px;
    height: 250px;
  }

  .actions {
    bottom: 30px;
  }
}
</style>
