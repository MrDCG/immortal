<template>
  <div class="collision-config">
    <h4>碰撞检测参数配置</h4>
    
    <div class="config-item">
      <label>rowGap（同轨道弹幕最小间距）</label>
      <div class="config-row">
        <input 
          type="range" 
          v-model="localConfig.rowGap" 
          min="0" 
          max="200" 
          step="10"
          @input="updateRowGap"
        >
        <span>{{ localConfig.rowGap }}px</span>
      </div>
      <p class="hint">推荐值：50-100px。值越大，弹幕间距越大，重叠越少，但显示速度越慢。</p>
    </div>

    <div class="config-item">
      <label>历史弹幕加载间隔</label>
      <div class="config-row">
        <input 
          type="range" 
          v-model="localConfig.loadInterval" 
          min="100" 
          max="1000" 
          step="50"
          @input="updateLoadInterval"
        >
        <span>{{ localConfig.loadInterval }}ms</span>
      </div>
      <p class="hint">推荐值：300-500ms。值越大，加载越慢，但碰撞检测越稳定。</p>
    </div>

    <div class="config-item">
      <label>碰撞检测状态</label>
      <div class="status-indicator" :class="{ active: localConfig.rowGap > 0 }">
        {{ localConfig.rowGap > 0 ? '✅ 已启用' : '❌ 已禁用' }}
      </div>
      <p class="hint" v-if="localConfig.rowGap === 0">
        ⚠️ 禁用碰撞检测后，弹幕可能重叠
      </p>
    </div>

    <div class="button-group">
      <button @click="applyConfig" class="apply-btn">应用配置</button>
      <button @click="resetConfig" class="reset-btn">重置为默认</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const localConfig = ref({
  rowGap: 50,
  loadInterval: 500
})

// 从 localStorage 加载配置
const loadConfig = () => {
  const saved = localStorage.getItem('danmaku-collision-config')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      localConfig.value = { ...localConfig.value, ...parsed }
    } catch (e) {
      console.error('Failed to load collision config:', e)
    }
  }
}

// 保存配置到 localStorage
const saveConfig = () => {
  localStorage.setItem('danmaku-collision-config', JSON.stringify(localConfig.value))
}

// 更新 rowGap
const updateRowGap = () => {
  // 触发响应式更新
  saveConfig()
  
  // 发送事件通知其他组件
  window.dispatchEvent(new CustomEvent('danmaku-config-change', {
    detail: { rowGap: localConfig.value.rowGap }
  }))
}

// 更新加载间隔
const updateLoadInterval = () => {
  saveConfig()
  
  window.dispatchEvent(new CustomEvent('danmaku-config-change', {
    detail: { loadInterval: localConfig.value.loadInterval }
  }))
}

// 应用配置
const applyConfig = () => {
  saveConfig()
  
  // 提示用户刷新页面以生效
  alert('配置已保存！请刷新页面以应用新的碰撞检测参数。')
  
  console.log('[DanmakuCollisionConfig] 配置已应用:', localConfig.value)
}

// 重置为默认
const resetConfig = () => {
  localConfig.value = {
    rowGap: 50,
    loadInterval: 500
  }
  saveConfig()
  
  alert('已重置为默认配置！请刷新页面以生效。')
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.collision-config {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 20px;
}

.collision-config h4 {
  margin-bottom: 20px;
  color: #4CAF50;
  font-size: 16px;
}

.config-item {
  margin-bottom: 20px;
}

.config-item label {
  display: block;
  margin-bottom: 8px;
  color: #fff;
  font-weight: 500;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-row input[type="range"] {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
}

.config-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  transition: all 0.2s;
}

.config-row input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.config-row span {
  min-width: 60px;
  text-align: right;
  color: #4CAF50;
  font-weight: bold;
}

.hint {
  margin-top: 5px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.status-indicator {
  padding: 8px 16px;
  border-radius: 4px;
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  font-weight: bold;
}

.status-indicator.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

.apply-btn {
  background: #4CAF50;
  color: white;
}

.apply-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.reset-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
