<template>
  <div class="danmaku-container" v-show="config.enabled" :style="containerStyle">
    <vue-danmaku
      :danmus="danmakuList"
      :channels="channels"
      :speeds="config.speed"
      :is-suspend="false"
      :loop="true"
      :auto-resize="true"
    >
      <template #danmu="{ danmu }">
        <span :style="getDanmuStyle(danmu)">{{ danmu.text }}</span>
      </template>
    </vue-danmaku>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import vueDanmaku from 'vue-danmaku'
import { useDanmakuStore } from '@/stores/danmaku'

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

// 弹幕通道数（根据屏幕高度计算）
const channels = computed(() => Math.floor(config.value.areaHeight / 25))

// 容器样式
const containerStyle = computed(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
  pointerEvents: 'none',
  overflow: 'hidden'
}))

// 获取弹幕样式
const getDanmuStyle = (danmu: any) => ({
  color: danmu.color,
  fontSize: `${20 * config.value.fontSizeScale}px`,
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
})
</script>

<style scoped>
.danmaku-container {
  font-family: 'Microsoft YaHei', sans-serif;
}
</style>
