<template>
  <div class="danmaku-input-container">
    <!-- 设置按钮（固定在右下角） -->
    <button
      class="settings-toggle"
      @click="toggleSettings"
      :title="showSettings ? '收起设置' : '弹幕设置'"
    >
      ⚙️
    </button>

    <!-- 收起的弹幕输入框（仅在弹幕启用时显示） -->
    <Transition name="fade-slide">
      <div v-if="config.enabled && !showSettings" class="input-wrapper">
        <input
          v-model="inputText"
          type="text"
          placeholder="发送弹幕..."
          class="danmaku-input"
          maxlength="200"
          @keyup.enter="sendDanmaku"
        />
        <button class="send-btn" @click="sendDanmaku" :disabled="!inputText.trim()">
          发送
        </button>
      </div>
    </Transition>

    <!-- 设置面板 -->
    <Transition name="settings-panel">
      <DanmakuSettings v-if="showSettings" @close="showSettings = false" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDanmakuStore } from '@/stores/danmaku'
import DanmakuSettings from './DanmakuSettings.vue'

const danmakuStore = useDanmakuStore()
const config = computed(() => danmakuStore.config)
const inputText = ref('')
const showSettings = ref(false)

const sendDanmaku = () => {
  const text = inputText.value.trim()
  if (text && config.value.enabled) {
    danmakuStore.addDanmaku(text)
    inputText.value = ''
  }
}

const toggleSettings = () => {
  showSettings.value = !showSettings.value
}
</script>

<style scoped>
.danmaku-input-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.settings-toggle {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.settings-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
}

.settings-toggle:active {
  transform: scale(0.95);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.danmaku-input {
  width: 280px;
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.danmaku-input:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}

.send-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 过渡动画 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.settings-panel-enter-active,
.settings-panel-leave-active {
  transition: all 0.3s ease;
}

.settings-panel-enter-from,
.settings-panel-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 768px) {
  .danmaku-input-container {
    bottom: 15px;
    right: 15px;
  }

  .settings-toggle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .input-wrapper {
    padding: 10px 12px;
  }

  .danmaku-input {
    width: 200px;
    font-size: 13px;
  }

  .send-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
