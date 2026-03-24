<template>
  <div class="danmaku-container" v-show="config.enabled">
    <div class="danmaku-wrapper">
      <vue-danmaku
        v-model:danmus="danmakuList"
        ref="danmakuRef"
        :channels="0"
        :speeds="config.speed"
        :autoplay="false"
        :loop="true"
        style="width: 100%; height: 100%;"
      >
        <template #danmu="{ danmu }">
          <span :style="getDanmuStyle(danmu)">{{ danmu.text }}</span>
        </template>
      </vue-danmaku>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue'
import vueDanmaku from 'vue-danmaku'
import { useDanmakuStore } from '@/stores/danmaku'

const danmakuStore = useDanmakuStore()
const danmakuRef = ref()
const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

// 获取弹幕样式
const getDanmuStyle = (danmu: any) => ({
  color: danmu.color,
  fontSize: `${20 * config.value.fontSizeScale}px`,
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
})

// 确保弹幕播放
const ensurePlay = () => {
  nextTick(() => {
    if (danmakuRef.value && danmakuRef.value.play) {
      try {
        danmakuRef.value.play()
      } catch (e) {
        console.warn('[Danmaku] play failed:', e)
      }
    }
  })
}

// 组件挂载后启动弹幕
onMounted(() => {
  // 延迟一点时间确保组件完全挂载
  setTimeout(ensurePlay, 500)
})

// 监听弹幕列表变化，自动播放
watch(danmakuList, () => {
  ensurePlay()
}, { deep: true })
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
  height: v-bind('config.areaHeight + "%"');
}
</style>
