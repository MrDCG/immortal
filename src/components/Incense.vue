<template>
  <div class="incense-container">
    <button
      v-if="!isBurning"
      @click="handleIncense"
      class="worship-btn"
    >
      <span class="shimmer"></span>
    </button>

    <!-- Lottie 动画容器 -->
    <div v-else ref="lottieRef" class="lottie-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onUnmounted } from 'vue'
import { useIncenseStore } from '@/stores/incense'
import lottie from 'lottie-web'

const emit = defineEmits<{
  complete: []
}>()

const incenseStore = useIncenseStore()
const isBurning = ref(false)
const lottieRef = ref<HTMLDivElement | null>(null)
let lottieInstance: any = null

const handleIncense = async () => {
  if (isBurning.value) return

  isBurning.value = true
  incenseStore.addIncense('guanyu')

  // 等待 DOM 更新后启动动画
  await nextTick()
  startLottieAnimation()

  // 3秒后结束动画
  setTimeout(() => {
    if (lottieInstance) {
      lottieInstance.destroy()
      lottieInstance = null
    }
    isBurning.value = false
    emit('complete')
  }, 3000)
}

const startLottieAnimation = () => {
  if (!lottieRef.value) return

  // 加载JSON配置
  fetch('/assets/拜一拜.json')
    .then(res => res.json())
    .then(data => {
      // 修正图片路径和文件名
      const assetsPath = '/assets/拜一拜/'
      data.assets = data.assets.map((asset: any) => {
        if (asset.u && asset.p) {
          // 将 seq_0_0.png 格式转换为 0001.png 格式
          const match = asset.p.match(/seq_0_(\d+)\.png/)
          if (match) {
            const frameNum = parseInt(match[1]) + 1
            const newFilename = String(frameNum).padStart(4, '0') + '.png'
            return {
              ...asset,
              u: assetsPath,
              p: newFilename
            }
          }
          return {
            ...asset,
            u: assetsPath
          }
        }
        return asset
      })

      lottieInstance = lottie.loadAnimation({
        container: lottieRef.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: data
      })
    })
    .catch(err => {
      console.error('Failed to load Lottie animation:', err)
    })
}

onUnmounted(() => {
  if (lottieInstance) {
    lottieInstance.destroy()
    lottieInstance = null
  }
})
</script>

<style scoped>
@property --shimmer {
  syntax: "<angle>";
  inherits: false;
  initial-value: 33deg;
}

@keyframes shimmer {
  0% { --shimmer: 0deg; }
  100% { --shimmer: 360deg; }
}

@keyframes shine {
  0% { opacity: 0; }
  15% { opacity: 1; }
  55% { opacity: 1; }
  100% { opacity: 0; }
}

/* 拜一拜按钮 */
button.worship-btn {
  font-weight: 600;
  background-image: url('/assets/拜一拜.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: unset;
  padding: 0;
  position: relative;
  isolation: isolate;
  box-shadow: 0 2px 3px 1px hsl(222deg 50% 20% / 50%), inset 0 -10px 20px -10px hsla(180deg, 10%, 90%, 95%);
  border-radius: 20px;
  width: 125px;
  height: 41px;
  transform: scale(1);
  transition: transform 1.33s linear(
    0, 0.002, 0.01 0.9%, 0.038 1.8%, 0.156, 0.312 5.8%, 0.789 11.1%, 1.015 14.2%,
    1.096, 1.157, 1.199, 1.224 20.3%, 1.231, 1.231, 1.226, 1.214 24.6%,
    1.176 26.9%, 1.057 32.6%, 1.007 35.5%, 0.984, 0.968, 0.956, 0.949 42%,
    0.946 44.1%, 0.95 46.5%, 0.998 57.2%, 1.007, 1.011 63.3%, 1.012 68.3%,
    0.998 84%, 1
  ), box-shadow 0.3s ease;
}

button.worship-btn:hover:not(:active) {
  transition-duration: calc(1.33s * 0.5), box-shadow 0.3s ease;
  transform: scale(1.1);
  box-shadow: 0 4px 8px -2px hsl(222deg 50% 20% / 50%), inset 0 0 0 transparent;
}

button.worship-btn:active {
  transform: scale(1.05);
  transition-duration: calc(1.33s * 0.5);
}

.shimmer {
  position: absolute;
  inset: -40px;
  border-radius: inherit;
  mask-image: conic-gradient(
    from var(--shimmer, 0deg),
    transparent 0%, transparent 10%, black 36%, black 45%,
    transparent 50%, transparent 60%, black 85%, black 95%, transparent 100%
  );
  mask-size: cover;
  mix-blend-mode: plus-lighter;
  animation: shimmer 1s linear infinite both;
}

button.worship-btn:hover .shimmer::before,
button.worship-btn:hover .shimmer::after {
  opacity: 1;
  animation: shine 1.2s ease-in infinite forwards;
}

.shimmer::before,
.shimmer::after {
  transition: all 0.5s ease;
  opacity: 0;
  content: "";
  border-radius: inherit;
  position: absolute;
  mix-blend-mode: color;
  inset: 40px;
  pointer-events: none;
}

.shimmer::before {
  box-shadow: 0 0 3px 2px hsl(222deg 20% 95%),
    0 0 7px 4px hsl(222deg 20% 80%),
    0 0 13px 4px hsl(222deg 50% 70%),
    0 0 25px 5px hsl(222deg 100% 70%);
  z-index: -1;
}

.shimmer::after {
  box-shadow: inset 0 0 0 1px hsl(222deg 70% 95%),
    inset 0 0 2px 1px hsl(222deg 100% 80%),
    inset 0 0 5px 2px hsl(222deg 100% 70%);
  z-index: 2;
}

/* 容器 - 与按钮同尺寸 */
.incense-container {
  z-index: 10;
  position: relative;
  width: 125px;
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Lottie 容器 - 绝对定位不影响布局 */
.lottie-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  animation: fadeInOut 3s ease-in-out forwards;
  pointer-events: none;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  10% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}
</style>
