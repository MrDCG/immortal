<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-panel">
      <div class="settings-header">
        <h3>弹幕设置</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="settings-content">
        <!-- 开关 -->
        <div class="setting-item">
          <label class="setting-label">
            <input
              type="checkbox"
              v-model="localConfig.enabled"
              @change="updateSetting('enabled', localConfig.enabled)"
            />
            <span>启用弹幕</span>
          </label>
        </div>

        <!-- 透明度 -->
        <div class="setting-item">
          <label class="setting-label">弹幕透明度</label>
          <input
            type="range"
            v-model.number="localConfig.opacity"
            min="0.1"
            max="1"
            step="0.1"
            @input="updateSetting('opacity', localConfig.opacity)"
          />
          <span class="value">{{ Math.round(localConfig.opacity * 100) }}%</span>
        </div>

        <!-- 字体大小 -->
        <div class="setting-item">
          <label class="setting-label">字体大小</label>
          <input
            type="range"
            v-model.number="localConfig.fontSizeScale"
            min="0.5"
            max="2"
            step="0.1"
            @input="updateSetting('fontSizeScale', localConfig.fontSizeScale)"
          />
          <span class="value">{{ localConfig.fontSizeScale }}x</span>
        </div>

        <!-- 弹幕速度 -->
        <div class="setting-item">
          <label class="setting-label">弹幕速度</label>
          <input
            type="range"
            v-model.number="localConfig.speedScale"
            min="0.5"
            max="2"
            step="0.1"
            @input="updateSetting('speedScale', localConfig.speedScale)"
          />
          <span class="value">{{ localConfig.speedScale }}x</span>
        </div>

        <!-- 屏幕占比 -->
        <div class="setting-item">
          <label class="setting-label">屏幕占比</label>
          <input
            type="range"
            v-model.number="localConfig.areaHeight"
            min="20"
            max="100"
            step="10"
            @input="updateSetting('areaHeight', localConfig.areaHeight)"
          />
          <span class="value">{{ localConfig.areaHeight }}%</span>
        </div>

        <!-- 同屏数量 -->
        <div class="setting-item">
          <label class="setting-label">同屏数量</label>
          <input
            type="range"
            v-model.number="localConfig.maxCount"
            min="10"
            max="100"
            step="10"
            @input="updateSetting('maxCount', localConfig.maxCount)"
          />
          <span class="value">{{ localConfig.maxCount }}条</span>
        </div>

        <!-- 颜色模式 -->
        <div class="setting-item">
          <label class="setting-label">弹幕颜色</label>
          <select
            v-model="localConfig.colorMode"
            @change="updateSetting('colorMode', localConfig.colorMode)"
            class="setting-select"
          >
            <option value="random">随机颜色</option>
            <option value="white">白色</option>
            <option value="custom">自定义</option>
          </select>
        </div>

        <!-- 自定义颜色 -->
        <div class="setting-item" v-if="localConfig.colorMode === 'custom'">
          <label class="setting-label">自定义颜色</label>
          <input
            type="color"
            v-model="localConfig.customColor"
            @input="updateSetting('customColor', localConfig.customColor)"
            class="color-picker"
          />
        </div>

        <!-- 清空弹幕 -->
        <div class="setting-item action-item">
          <button class="action-btn clear-btn" @click="clearDanmaku">
            🗑️ 清空屏幕弹幕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDanmakuStore } from '@/stores/danmaku'

const emit = defineEmits(['close'])
const danmakuStore = useDanmakuStore()

const localConfig = reactive({ ...danmakuStore.config })

const updateSetting = (key: string, value: any) => {
  danmakuStore.updateConfig({ [key]: value })
}

const clearDanmaku = () => {
  if (confirm('确定要清空屏幕上的所有弹幕吗？')) {
    danmakuStore.clearDanmaku()
  }
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.settings-panel {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.settings-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: #f5f5f5;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e0e0e0;
}

.settings-content {
  padding: 20px;
}

.setting-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  gap: 12px;
}

.setting-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

.setting-label {
  flex: 0 0 100px;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.setting-item input[type="range"] {
  flex: 1;
  cursor: pointer;
}

.value {
  flex: 0 0 50px;
  font-size: 14px;
  color: #999;
  text-align: right;
}

.setting-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.color-picker {
  width: 50px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.action-item {
  border-bottom: none;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.clear-btn {
  background: #ffebee;
  color: #f44336;
}

.clear-btn:hover {
  background: #ffcdd2;
}

@media (max-width: 768px) {
  .settings-panel {
    width: 95%;
  }

  .setting-label {
    flex: 0 0 80px;
    font-size: 13px;
  }
}
</style>
