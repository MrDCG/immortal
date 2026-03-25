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
import { useDanmakuStore } from '@/stores/danmaku'

interface DanmakuItem {
  id: string
  text: string
  color: string
  fontSize: number
  speed: number
  left: number
  top: number
}

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

const visibleDanmakus = ref<DanmakuItem[]>([])
const lastListLength = ref(0)
const animationFrameId = ref<number | null>(null)

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

// 添加弹幕到可见列表
const addVisibleDanmaku = (danmaku: any) => {
  const item: DanmakuItem = {
    id: danmaku.id,
    text: danmaku.text,
    color: danmaku.color,
    fontSize: danmaku.fontSize,
    speed: danmaku.speed,
    left: window.innerWidth,
    top: Math.random() * (window.innerHeight * config.value.areaHeight / 100 - 40)
  }
  visibleDanmakus.value.push(item)
}

// 更新弹幕位置
const updateDanmakuPositions = () => {
  const itemsToRemove: string[] = []

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
  }

  // 检查是否有新弹幕添加到 store
  if (danmakuList.value.length > lastListLength.value) {
    // 添加新弹幕
    for (let i = lastListLength.value; i < danmakuList.value.length; i++) {
      addVisibleDanmaku(danmakuList.value[i])
    }
    lastListLength.value = danmakuList.value.length
  }

  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
}

// 组件挂载
onMounted(() => {
  // 开始动画循环
  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)

  console.log('[SimpleDanmaku] 组件已挂载，弹幕列表长度:', danmakuList.value.length)
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
