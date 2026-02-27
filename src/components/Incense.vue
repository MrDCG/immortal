<template>
  <div class="incense-container">
    <button
      @click="handleIncense"
      :disabled="isBurning"
      class="incense-btn"
      :class="{ burning: isBurning }"
    >
      <template v-if="isBurning">
        <!-- 燃烧的香 -->
        <div class="incense-burning">
          <div class="incense-stick">
            <div class="incense-flame"></div>
            <div class="incense-smoke">
              <div
                v-for="i in 5"
                :key="i"
                class="smoke-particle"
                :style="{ '--delay': i * 0.2 + 's', '--x': (Math.random() - 0.5) * 20 + 'px' }"
              ></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 拜一拜按钮 -->
        <div class="worship-btn">拜一拜</div>
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useIncenseStore } from '@/stores/incense'

const emit = defineEmits<{
  complete: []
}>()

const incenseStore = useIncenseStore()
const isBurning = ref(false)
const progress = ref(0)

const handleIncense = () => {
  if (isBurning.value) return

  isBurning.value = true
  progress.value = 0
  incenseStore.addIncense('guanyu')

  // 3秒燃烧动画
  const duration = 3000
  const interval = 50
  let elapsed = 0

  const timer = setInterval(() => {
    elapsed += interval
    progress.value = elapsed / duration

    if (elapsed >= duration) {
      clearInterval(timer)
      isBurning.value = false
      // 触发祈福语弹窗
      emit('complete')
    }
  }, interval)
}
</script>

<style scoped>
.incense-container {
  margin-top: 30px;
  z-index: 10;
  position: relative;
}

.incense-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 20px;
  transition: transform 0.2s ease;
}

.incense-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.incense-btn:disabled {
  cursor: not-allowed;
}

/* 拜一拜按钮 */
.worship-btn {
  padding: 12px 35px;
  background: linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #ffd700 100%);
  color: #c41e3a;
  font-size: 1.5rem;
  font-weight: 900;
  border-radius: 30px;
  box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.5);
  border: 3px solid #daa520;
  font-family: 'Comic Sans MS', 'YouYuan', '幼圆', 'STKaiti', 'KaiTi', cursive, sans-serif;
  letter-spacing: 3px;
  text-shadow: 1px 1px 0 #fff, 2px 2px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* 按钮光效 */
.worship-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.worship-btn:hover::before {
  left: 100%;
}

/* 燃烧状态 */
.incense-burning {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.incense-stick {
  position: relative;
  width: 6px;
  height: 150px;
  background: linear-gradient(to bottom, #8b4513, #654321);
  border-radius: 3px;
}

.incense-flame {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 20px;
  background: radial-gradient(ellipse at bottom, #ffd700 0%, #ff4500 50%, transparent 70%);
  border-radius: 50% 50% 50% 50%;
  animation: flame-flicker 0.2s infinite alternate;
}

@keyframes flame-flicker {
  0% {
    transform: translateX(-50%) scale(1);
  }
  100% {
    transform: translateX(-50%) scale(1.1);
  }
}

.incense-smoke {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
}

.smoke-particle {
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(200, 200, 200, 0.6) 0%, transparent 70%);
  border-radius: 50%;
  animation: smoke-rise 2s ease-out forwards;
  animation-delay: var(--delay);
}

@keyframes smoke-rise {
  0% {
    transform: translateY(0) translateX(0) scale(0.5);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) translateX(var(--x)) scale(2);
    opacity: 0;
  }
}

/* 按钮按下效果 */
.incense-btn:active:not(:disabled) {
  transform: scale(0.95);
}
</style>
