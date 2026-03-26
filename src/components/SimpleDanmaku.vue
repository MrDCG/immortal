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
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
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
  trackIndex?: number // 分配的轨道索引
}

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)
const historyDanmakuList = computed(() => danmakuStore.historyDanmakuList)

const visibleDanmakus = ref<VisibleDanmaku[]>([])
const processedHistory = ref<Set<string>>(new Set()) // 记录已处理的历史弹幕ID
const lastListLength = ref(0)
const animationFrameId = ref<number | null>(null)

// 轨道配置
const trackCount = ref(0)

// 计算容器样式
const wrapperStyle = computed(() => ({
  height: `${config.value.areaHeight}%`
}))

// 初始化轨道
const initTracks = () => {
  const areaHeight = window.innerHeight * config.value.areaHeight / 100
  const defaultFontSize = 24 * config.value.fontSizeScale
  // 轨道数量 = 区域高度 / (字体大小 + 间距)
  trackCount.value = Math.max(1, Math.floor(areaHeight / (defaultFontSize + 10)))
  console.log('[SimpleDanmaku] 初始化轨道，数量:', trackCount.value)
}

// 计算弹幕文本宽度
const calculateDanmakuWidth = (text: string, fontSize: number): number => {
  // 中文字符宽度约等于 fontSize，英文字符宽度约为 fontSize * 0.6
  let width = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    if (char > 255) {
      // 中文字符
      width += fontSize
    } else {
      // 英文字符或数字
      width += fontSize * 0.6
    }
  }
  return Math.ceil(width)
}

// 获取可用轨道（方案一：基于rowGap的碰撞检测优化）
const getAvailableTrack = (danmaku: Danmaku): number => {
  const danmakuWidth = calculateDanmakuWidth(danmaku.text, danmaku.fontSize)
  
  // ⭐ 从 localStorage 读取 rowGap 配置（默认50px）
  const savedConfig = localStorage.getItem('danmaku-collision-config')
  let rowGap = 50 // 默认值
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig)
      rowGap = parsed.rowGap || 50
    } catch (e) {
      console.error('Failed to parse collision config:', e)
    }
  }
  
  const containerWidth = window.innerWidth

  // 按轨道优先级顺序查找
  for (let i = 0; i < trackCount.value; i++) {
    // 找到该轨道的所有弹幕
    const trackDanmakus = visibleDanmakus.value.filter(item => item.trackIndex === i)

    // 如果该轨道没有弹幕，直接可用
    if (trackDanmakus.length === 0) {
      return i
    }

    // 找到该轨道的最后一个弹幕（最右侧的）
    let lastDanmaku = trackDanmakus[0]
    for (let j = 1; j < trackDanmakus.length; j++) {
      if (trackDanmakus[j].left > lastDanmaku.left) {
        lastDanmaku = trackDanmakus[j]
      }
    }

    // ⭐ 关键改进：计算最后一条弹幕的尾部位置
    const lastDanmakuWidth = calculateDanmakuWidth(lastDanmaku.text, lastDanmaku.fontSize)
    const lastDanmakuTail = lastDanmaku.left + lastDanmakuWidth
    
    // 检查是否有足够的间距（rowGap）
    const availableSpace = containerWidth - lastDanmakuTail
    if (availableSpace >= danmakuWidth + rowGap) {
      // ⭐ 额外检查：考虑速度差异，确保不会追尾
      const speedDiff = danmaku.speed - lastDanmaku.speed
      if (speedDiff <= 0) {
        // 新弹幕速度 <= 旧弹幕，不会追尾
        return i
      } else {
        // 新弹幕速度 > 旧弹幕，需要更大的安全距离
        const extraGap = speedDiff * 20 // 速度差越大，需要越大间距
        if (availableSpace >= danmakuWidth + rowGap + extraGap) {
          return i
        }
      }
    }
  }

  // 如果没有可用轨道，随机选择一个（优先级最低）
  const randomTrack = Math.floor(Math.random() * trackCount.value)
  console.warn(`[SimpleDanmaku] 所有轨道已满，随机分配到轨道 ${randomTrack}`)
  return randomTrack
}

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
  // 获取可用轨道
  const trackIndex = getAvailableTrack(danmaku)
  const trackHeight = danmaku.fontSize + 10
  const maxTop = window.innerHeight * config.value.areaHeight / 100 - danmaku.fontSize

  const item: VisibleDanmaku = {
    id: danmaku.id,
    text: danmaku.text,
    color: danmaku.color,
    fontSize: danmaku.fontSize,
    speed: danmaku.speed,
    left: window.innerWidth,
    top: Math.min(trackIndex * trackHeight, maxTop),
    addedTime: Date.now(),
    trackIndex: trackIndex // 记录轨道索引
  }
  visibleDanmakus.value.push(item)
  processedHistory.value.add(danmaku.id)

  // 限制同屏弹幕数量
  if (visibleDanmakus.value.length > config.value.maxCount) {
    // 移除最早添加的弹幕
    const removed = visibleDanmakus.value.shift()
    if (removed) {
      processedHistory.value.delete(removed.id)
    }
  }
}

// 监控 danmakuList 变化
watch(danmakuList, (newVal, oldVal) => {
  // 如果没有旧值，或者新值没有变化，则跳过
  if (!oldVal || newVal.length <= oldVal.length) {
    return
  }

  // 添加所有新增的弹幕
  for (let i = oldVal.length; i < newVal.length; i++) {
    const danmaku = newVal[i]
    // 跳过已处理的历史弹幕
    if (danmaku.isHistory && processedHistory.value.has(danmaku.id)) {
      continue
    }
    // 立即添加到可见列表
    addVisibleDanmaku(danmaku)
  }

  // 更新 lastListLength
  lastListLength.value = newVal.length
}, { deep: true })

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
    // 从已处理历史中移除
    itemsToRemove.forEach(id => processedHistory.value.delete(id))
  }

  // 检查历史弹幕是否到达显示时间
  const nowTime = Date.now()
  for (let i = lastListLength.value; i < danmakuList.value.length; i++) {
    const danmaku = danmakuList.value[i]

    // 跳过已处理的历史弹幕
    if (danmaku.isHistory && processedHistory.value.has(danmaku.id)) {
      continue
    }

    // 如果是历史弹幕，检查是否到达显示时间
    if (danmaku.isHistory && danmaku.displayDelay) {
      if (nowTime >= danmaku.timestamp + danmaku.displayDelay) {
        addVisibleDanmaku(danmaku)
        processedHistory.value.add(danmaku.id)
      }
    }
  }

  // 更新 lastListLength
  lastListLength.value = danmakuList.value.length

  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
}

// 清空可见弹幕
const clearVisibleDanmaku = () => {
  visibleDanmakus.value = []
  processedHistory.value.clear()
  // 重置 lastListLength 为 danmakuList 的实际长度
  lastListLength.value = danmakuList.value.length
  console.log('[SimpleDanmaku] 已清空可见弹幕，准备重新显示历史弹幕')
  console.log('[SimpleDanmaku] 重置 lastListLength 为:', lastListLength.value)
}

// 组件挂载
onMounted(() => {
  // 初始化轨道
  initTracks()

  // 监听窗口大小变化
  window.addEventListener('resize', initTracks)

  // 注册清空回调
  danmakuStore.registerClearCallback(clearVisibleDanmaku)

  // 初始化 lastListLength
  lastListLength.value = danmakuList.value.length
  console.log('[SimpleDanmaku] 组件已挂载')
  console.log('[SimpleDanmaku] 初始 danmakuList 长度:', danmakuList.value.length)
  console.log('[SimpleDanmaku] 初始 lastListLength:', lastListLength.value)
  console.log('[SimpleDanmaku] danmakuList:', danmakuList.value)

  // 延迟检查，确保历史弹幕加载完成后，lastListLength 正确
  setTimeout(() => {
    if (lastListLength.value > danmakuList.value.length) {
      console.log('[SimpleDanmaku] 延迟检查发现异常，重置 lastListLength')
      lastListLength.value = danmakuList.value.length
    }
  }, 1000)

  // 开始动画循环
  animationFrameId.value = requestAnimationFrame(updateDanmakuPositions)
})

// 组件卸载
onBeforeUnmount(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  window.removeEventListener('resize', initTracks)
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
