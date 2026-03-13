<template>
  <div class="page">
    <!-- 右上角计数器 -->
    <div class="counter-fixed">
      <Counter />
    </div>

    <!-- 光环 -->
    <div class="glow" :style="{ background: glowGradient }"></div>

    <!-- 神仙视频/图片 -->
    <Transition name="god-fade" mode="out-in">
      <video
        v-if="god.images.video"
        ref="videoRef"
        :key="god.id"
        :src="god.images.video"
        class="god-image"
        autoplay
        loop
        muted
        playsinline
        @loadedmetadata="setPlaybackRate"
      />
      <img
        v-else
        :key="god.id + '-img'"
        :src="god.images.default"
        :alt="god.name"
        class="god-image"
      />
    </Transition>

    <!-- 右侧描述 -->
    <div class="god-desc">{{ god.title }} {{ god.name }}</div>

    <!-- 上香按钮 -->
    <div class="actions">
      <Incense :god-id="god.id" @complete="showBlessing" />
    </div>

    <!-- 祈福语弹窗 -->
    <BlessingPopup ref="blessingPopupRef" :god="god" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { God } from '@/types'
import Counter from './Counter.vue'
import Incense from './Incense.vue'
import BlessingPopup from './BlessingPopup.vue'

const props = defineProps<{ god: God }>()

const blessingPopupRef = ref<InstanceType<typeof BlessingPopup>>()
const videoRef = ref<HTMLVideoElement | null>(null)

// 需要减速的神像
const slowPlaybackGods: Record<string, number> = {
  chaiwangye: 0.7,
  wanghai: 0.7,
}

// 光环渐变色
const glowGradient = computed(() => {
  return `radial-gradient(circle, ${props.god.color}40 0%, transparent 60%)`
})

const setPlaybackRate = () => {
  if (videoRef.value && slowPlaybackGods[props.god.id]) {
    videoRef.value.playbackRate = slowPlaybackGods[props.god.id]
  }
}

const showBlessing = () => {
  blessingPopupRef.value?.show()
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background-image: url('/assets/画轴背景.webp');
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
  animation: glow-pulse 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 神仙图片/视频 */
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

/* 神仙切换过渡动画 */
.god-fade-enter-active,
.god-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.god-fade-enter-from {
  opacity: 0;
  transform: translate(calc(-50% + 3px), calc(-42% - 60px)) scale(0.95);
}

.god-fade-leave-to {
  opacity: 0;
  transform: translate(calc(-50% + 3px), calc(-42% - 60px)) scale(1.05);
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

/* 上香按钮 */
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

  .god-desc {
    font-size: 1rem;
  }
}
</style>
