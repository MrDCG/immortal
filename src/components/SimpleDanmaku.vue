<template>
  <div class="danmaku-container" v-show="config.enabled">
    <div class="danmaku-wrapper" :style="wrapperStyle">
      <TransitionGroup name="danmaku">
        <div
          v-for="item in visibleDanmakus"
          :key="item.id"
          class="danmaku-item"
          :style="getDanmakuStyle(item)"
        >
          {{ item.text }}
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useDanmakuStore } from '@/stores/danmaku'

interface DanmakuItem {
  id: string
  text: string
  color: string
  fontSize: number
  speed: number
  left: number
  top: number
  visible: boolean
}

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

const visibleDanmakus = ref<DanmakuItem[]>([])
const animationFrameId = ref<number | null>(null)
const containerWidth = ref(window.innerWidth)
const containerHeight = ref(window.innerHeight)

// 计算容器样式
const wrapperStyle = computed(() => ({
  height: `${config.value.areaHeight}%`
}))

// 获取弹幕样式
const getDanmakuStyle = (item: DanmakuItem) => ({
  left: `${item.left}px`,
  top: `${item.top}px`,
  color: item.color,
  fontSize: `${item.fontSize}px`,
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
})

// 添加弹幕
const addVisibleDanmaku = (text: string, color: string, fontSize: number, speed: number) => {
  const item: DanmakuItem = {
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    text,
    color,
    fontSize,
    speed,
    left: containerWidth.value,
    top: Math.random() * (containerHeight.value * config.value.areaHeight / 100 - 30),
    visible: true
  }
  visibleDanmakus.value.push(item)
}

// 更新弹幕位置
const updateDanmakuPositions = () => {
  const itemsToRemove: string[] = []

  visibleDanmakus.value.forEach(item => {
    item.left -= item.speed

    // 如果弹幕移出屏幕左侧，标记为移除
    if (item.left < -200) {
      itemsToRemove.push(item.id)
    }
  })

  // 移除出屏幕的弹幕
  if (itemsToRemove.length > 0) {
    visibleDanmakus.value = visibleDanmakus.value.filter(item => !itemsToRemove.includes(item.id))
  }

  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
}

// 监听弹幕列表变化
watch(danmakuList, (newList, oldList) => {
  // 如果有新弹幕添加
  if (newList.length > (oldList?.length || 0)) {
    const newItem = newList[newList.length - 1]
    addVisibleDanmaku(newItem.text, newItem.color, newItem.fontSize, newItem.speed)
  }
}, { deep: true })

// 组件挂载
onMounted(() => {
  // 开始动画循环
  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onBeforeUnmount(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  window.removeEventListener('resize', handleResize)
})

// 处理窗口大小变化
const handleResize = () => {
  containerWidth.value = window.innerWidth
  containerHeight.value = window.innerHeight
}
</script>

<style scoped>
.danmaku-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  pointer-events: none;
  overflow: hidden;
}

.danmaku-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.danmaku-item {
  position: absolute;
  white-space: nowrap;
  font-weight: 500;
  will-change: transform;
}

.danmaku-enter-active {
  transition: all 0.1s ease-out;
}

.danmaku-leave-active {
  transition: all 0.1s ease-in;
}

.danmaku-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.danmaku-leave-to {
  opacity: 0;
}
</style>
