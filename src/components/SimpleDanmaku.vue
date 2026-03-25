<template>
  <div class="danmaku-container" v-show="config.enabled">
    <div class="danmaku-wrapper" :style="wrapperStyle">
      <div
        v-for="item in visibleDanmakus"
        :key="item.id"
        class="danmaku-item"
        :style="getDanmakuStyle(item)"
      >
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useDanmakuStore, type Danmaku } from '@/stores/danmaku'

interface VisibleDanmaku {
  id: string
  text: string
  color: string
  fontSize: number
  speed: number
  left: number
  top: number
  addedTime: number // 添加到可见列表的时间戳
}

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)
const historyDanmakuList = computed(() => danmakuStore.historyDanmakuList)

const visibleDanmakus = ref<VisibleDanmaku[]>([])
const processedHistory = ref<Set<string>>(new Set()) // 记录已处理的历史弹幕ID
const lastListLength = ref(0)
const animationFrameId = ref<number | null>(null)

// 计算容器样式
const wrapperStyle = computed(() => ({
  height: `${config.value.areaHeight}%`
}))

// 获取弹幕样式
const getDanmakuStyle = (item: VisibleDanmaku) => ({
  left: `${item.left}px`,
  top: `${item.top}px`,
  color: item.color,
  fontSize: `${item.fontSize}px`,
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
})

// 添加弹幕到可见列表
const addVisibleDanmaku = (danmaku: Danmaku) => {
  const item: VisibleDanmaku = {
    id: danmaku.id,
    text: danmaku.text,
    color: danmaku.color,
    fontSize: danmaku.fontSize,
    speed: danmaku.speed,
    left: window.innerWidth,
    top: Math.random() * (window.innerHeight * config.value.areaHeight / 100 - 40),
    addedTime: Date.now()
  }
  visibleDanmakus.value.push(item)
  processedHistory.value.add(danmaku.id)
  console.log('[SimpleDanmaku] 添加弹幕:', danmaku.text, danmaku.isHistory ? '(历史)' : '(新)')
}

// 更新弹幕位置
const updateDanmakuPositions = () => {
  const itemsToRemove: string[] = []
  const now = Date.now()

  visibleDanmakus.value.forEach(item => {
    item.left -= item.speed

    // 如果弹幕移出屏幕左侧，标记为移除
    if (item.left < -300) {
      itemsToRemove.push(item.id)
    }
  })

  // 移除出屏幕的弹幕
  if (itemsToRemove.length > 0) {
    visibleDanmakus.value = visibleDanmakus.value.filter(item => !itemsToRemove.includes(item.id))
    // 从已处理历史中移除
    itemsToRemove.forEach(id => processedHistory.value.delete(id))
  }

  // 检查是否有新弹幕添加到 store
  if (danmakuList.value.length > lastListLength.value) {
    // 添加新弹幕
    for (let i = lastListLength.value; i < danmakuList.value.length; i++) {
      const danmaku = danmakuList.value[i]

      // 跳过已处理的历史弹幕
      if (danmaku.isHistory && processedHistory.value.has(danmaku.id)) {
        continue
      }

      // 如果是历史弹幕，检查是否到达显示时间
      if (danmaku.isHistory && danmaku.displayDelay) {
        if (now >= danmaku.addedTime + danmaku.displayDelay) {
          addVisibleDanmaku(danmaku)
        }
      } else {
        // 新弹幕直接显示
        addVisibleDanmaku(danmaku)
      }
    }
    lastListLength.value = danmakuList.value.length
  }

  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
}

// 清空可见弹幕
const clearVisibleDanmaku = () => {
  visibleDanmakus.value = []
  processedHistory.value.clear()
  // 重置 lastListLength 为历史弹幕数量，以便重新显示
  lastListLength.value = historyDanmakuList.value.length
  console.log('[SimpleDanmaku] 已清空可见弹幕，准备重新显示历史弹幕')
}

// 组件挂载
onMounted(() => {
  // 注册清空回调
  danmakuStore.registerClearCallback(clearVisibleDanmaku)

  // 初始化 lastListLength
  lastListLength.value = danmakuList.value.length

  // 开始动画循环
  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
  console.log('[SimpleDanmaku] 组件已挂载')
})

// 组件卸载
onBeforeUnmount(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
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
</style>
