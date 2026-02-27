<template>
  <div class="incense-container">
    <button
      v-if="!isBurning"
      @click="handleIncense"
      class="worship-btn"
    >
      <span class="shimmer"></span>
    </button>

    <!-- Canvas 粒子特效 -->
    <canvas v-else ref="canvasRef" class="gift-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useIncenseStore } from '@/stores/incense'

const emit = defineEmits<{
  complete: []
}>()

const incenseStore = useIncenseStore()
const isBurning = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animationId: number | null = null

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  decay: number
  type: 'sparkle' | 'smoke' | 'light'

  constructor(x: number, y: number, type: 'sparkle' | 'smoke' | 'light') {
    this.x = x
    this.y = y
    this.type = type
    this.alpha = 1

    if (type === 'sparkle') {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed - 2
      this.size = Math.random() * 4 + 2
      this.decay = 0.015
      this.color = `hsl(${45 + Math.random() * 15}, 100%, ${70 + Math.random() * 30}%)`
    } else if (type === 'smoke') {
      this.vx = (Math.random() - 0.5) * 1
      this.vy = -Math.random() * 2 - 1
      this.size = Math.random() * 8 + 4
      this.decay = 0.008
      this.color = `rgba(200, 200, 200,`
    } else if (type === 'light') {
      this.vx = 0
      this.vy = 0
      this.size = Math.random() * 20 + 10
      this.decay = 0.02
      this.color = `hsl(45, 100%, 70%)`
    }
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.alpha -= this.decay

    if (this.type === 'sparkle') {
      this.vy += 0.1
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, this.alpha)

    if (this.type === 'light') {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
      gradient.addColorStop(0, this.color)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = this.type === 'smoke' ? this.color + this.alpha + ')' : this.color
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

// 上香图片
const worshipImage = new Image()
worshipImage.src = '/assets/上香.png'

let scale = 0
let particles: Particle[] = []
let centerX = 100
let centerY = 100
let frameCount = 0

const handleIncense = async () => {
  if (isBurning.value) return

  isBurning.value = true
  incenseStore.addIncense('guanyu')

  // 重置动画状态
  scale = 0
  particles = []
  frameCount = 0

  // 等待 DOM 更新后启动动画
  await nextTick()
  startAnimation()

  const duration = 3000
  const interval = 16
  let elapsed = 0

  const timer = setInterval(() => {
    elapsed += interval

    if (elapsed >= duration) {
      clearInterval(timer)
      isBurning.value = false
      emit('complete')
    }
  }, interval)
}

// Canvas 动画循环
const animate = () => {
  if (!isBurning.value || !canvasRef.value) {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    return
  }

  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  centerX = width / 2
  centerY = height / 2

  ctx.clearRect(0, 0, width, height)

  frameCount++

  // 缩放动画：弹入效果
  if (frameCount < 30) {
    scale = Math.min(1.2, scale + 0.08)
  } else if (frameCount > 150) {
    scale = Math.max(0, scale - 0.02)
  }

  // 绘制上香图片
  const imgSize = 140 * scale
  if (worshipImage.complete) {
    ctx.save()
    ctx.globalAlpha = Math.min(1, scale)
    ctx.drawImage(worshipImage, centerX - imgSize / 2, centerY - imgSize / 2, imgSize, imgSize)
    ctx.restore()
  }

  // 生成粒子
  if (frameCount > 10 && frameCount < 120) {
    // 光效粒子
    if (frameCount % 3 === 0) {
      particles.push(new Particle(centerX, centerY, 'light'))
    }
    // 闪烁粒子
    if (frameCount % 2 === 0) {
      for (let i = 0; i < 3; i++) {
        particles.push(new Particle(centerX, centerY - 50, 'sparkle'))
      }
    }
    // 烟雾粒子
    if (frameCount % 5 === 0) {
      particles.push(new Particle(centerX, centerY - 60, 'smoke'))
    }
  }

  // 更新和绘制粒子
  particles = particles.filter(p => p.alpha > 0)
  particles.forEach(p => {
    p.update()
    p.draw(ctx)
  })

  animationId = requestAnimationFrame(animate)
}

const startAnimation = () => {
  if (canvasRef.value) {
    canvasRef.value.width = 200
    canvasRef.value.height = 200
    animate()
  }
}

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
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

/* 容器 */
.incense-container {
  margin-top: 30px;
  z-index: 10;
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Canvas */
.gift-canvas {
  width: 200px;
  height: 200px;
}
</style>
