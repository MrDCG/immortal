<template>
  <div class="danmaku-container" v-show="config.enabled" :style="containerStyle">
    <vue3-danmaku
      v-model:danmus="danmakuTexts"
      :speeds="speeds"
      :channels="channels"
      :opacity="config.opacity"
      :isSuspend="false"
      :loop="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import vue3Danmaku from 'vue3-danmaku'
import { useDanmakuStore } from '@/stores/danmaku'

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

// 转换弹幕数据为文本列表（vue3-danmaku 需要文本数组）
const danmakuTexts = computed(() => {
  return danmakuList.value.map(d => d.text)
})

// 弹幕速度
const speeds = computed(() => [config.value.speed])

// 弹幕通道数（根据屏幕高度计算）
const channels = computed(() => Math.floor(config.value.areaHeight / 20))

// 容器样式
const containerStyle = computed(() => ({
  height: `${config.value.areaHeight}%`,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  overflow: 'hidden'
}))
</script>

<style scoped>
.danmaku-container {
  font-family: 'Microsoft YaHei', sans-serif;
}
</style>
