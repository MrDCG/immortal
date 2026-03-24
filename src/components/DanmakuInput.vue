<template>
  <div class="danmaku-input-container">
    <div class="input-wrapper">
      <input
        v-model="inputText"
        type="text"
        placeholder="发送弹幕..."
        class="danmaku-input"
        maxlength="50"
        @keyup.enter="sendDanmaku"
        :disabled="!config.enabled"
      />
      <button class="send-btn" @click="sendDanmaku" :disabled="!inputText.trim() || !config.enabled">
        发送
      </button>
      <button class="settings-btn" @click="showSettings = true" title="弹幕设置">
        ⚙️
      </button>
    </div>

    <DanmakuSettings v-if="showSettings" @close="showSettings = false" />
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

    // TODO: 发送到服务器（实现跨用户同步）
    // await sendDanmakuToServer(text)
  }
}
</script>

<style scoped>
.danmaku-input-container {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1001;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

.danmaku-input {
  width: 300px;
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.danmaku-input:focus {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.danmaku-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.send-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
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

.settings-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

@media (max-width: 768px) {
  .input-wrapper {
    padding: 10px 16px;
  }

  .danmaku-input {
    width: 200px;
    font-size: 12px;
  }

  .send-btn {
    padding: 6px 16px;
    font-size: 12px;
  }

  .danmaku-input-container {
    bottom: 60px;
  }
}
</style>
