<template>
  <div class="danmaku-container" v-show="config.enabled">
    <Transition name="fade">
      <div v-if="ready" ref="containerRef" class="danmaku-inner">
        <vue-danmaku
          ref="danmakuRef"
          :danmus="danmakuList"
          :channels="channels"
          :speeds="config.speed"
          :is-suspend="false"
          :loop="true"
          :auto-resize="false"
        >
          <template #danmu="{ danmu }">
            <span :style="getDanmuStyle(danmu)">{{ danmu.text }}</span>
          </template>
        </vue-danmaku>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import vueDanmaku from 'vue-danmaku'
import { useDanmakuStore } from '@/stores/danmaku'

const danmakuStore = useDanmakuStore()
const containerRef = ref<HTMLElement>()
const danmakuRef = ref()
const ready = ref(false)

const config = computed(() => danmakuStore.config)
const danmakuList = computed(() => danmakuStore.danmakuList)

// 弹幕通道数（根据屏幕高度计算）
const channels = computed(() => Math.floor(config.value.areaHeight / 25))

// 获取弹幕样式
const getDanmuStyle = (danmu: any) => ({
  color: danmu.color,
  fontSize: `${20 * config.value.fontSizeScale}px`,
  textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
})

// 初始化弹幕容器
const initDanmaku = async () => {
  await nextTick()

  // 等待容器有宽高
  let attempts = 0
  const maxAttempts = 50

  const checkContainer = () => {
    attempts++
    if (containerRef.value && containerRef.value.offsetWidth > 0 && containerRef.value.offsetHeight > 0) {
      ready.value = true
      // 等待 vue-danmaku 渲染后再调整大小
      setTimeout(() => {
        if (danmakuRef.value && danmakuRef.value.resize) {
          try {
            danmakuRef.value.resize()
          } catch (e) {
            console.warn('[Danmaku] resize failed:', e)
          }
        }
      }, 100)
    } else if (attempts < maxAttempts) {
      setTimeout(checkContainer, 50)
    } else {
      console.warn('[Danmaku] 容器初始化超时，强制启用')
      ready.value = true
    }
  }

  // 延迟 500ms 后开始检查
  setTimeout(checkContainer, 500)
}

// 组件挂载后初始化
onMounted(() => {
  initDanmaku()
})

// 监听配置变化
watch(() => config.value.areaHeight, () => {
  ready.value = false
  setTimeout(initDanmaku, 100)
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

.danmaku-inner {
  width: 100%;
  height: v-bind('config.areaHeight + "%"');
  min-height: 200px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
