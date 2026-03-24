<template>
  <div class="danmaku-container" v-show="config.enabled && isMounted" :style="containerStyle">
    <div class="danmaku-inner">
      <vue-danmaku
        ref="danmakuRef"
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue'
import vueDanmaku from 'vue-danmaku'
import { useDanmakuStore } from '@/stores/danmaku'

const danmakuStore = useDanmakuStore()
const danmakuRef = ref()
const isMounted = ref(false)

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
  width: '100vw',
  height: `${config.value.areaHeight}%`,
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

// 组件挂载后延迟初始化
onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    isMounted.value = true
    // 强制重新计算容器大小
    if (danmakuRef.value && danmakuRef.value.resize) {
      nextTick(() => {
        danmakuRef.value.resize()
      })
    }
  }, 100)
})
</script>

<style scoped>
.danmaku-container {
  font-family: 'Microsoft YaHei', sans-serif;
}

.danmaku-inner {
  width: 100%;
  height: 100%;
}
</style>
