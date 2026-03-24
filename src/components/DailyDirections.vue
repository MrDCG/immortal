<template>
  <div class="daily-directions">
    <!-- 财神方位 -->
    <div class="direction-item caishen">
      <span class="direction-icon" :style="{ color: caishenColor }">
        💰{{ caishenIcon }}
      </span>
      <div class="direction-info">
        <span class="direction-label">今日财神</span>
        <span class="direction-value">{{ directions.caishen }}</span>
      </div>
    </div>

    <!-- 喜神方位 -->
    <div class="direction-item xishen">
      <span class="direction-icon" :style="{ color: xishenColor }">
        ❤️{{ xishenIcon }}
      </span>
      <div class="direction-info">
        <span class="direction-label">今日喜神</span>
        <span class="direction-value">{{ directions.xishen }}</span>
      </div>
    </div>

    <!-- 福神方位 -->
    <div class="direction-item fushen">
      <span class="direction-icon" :style="{ color: fushenColor }">
        🏮{{ fushenIcon }}
      </span>
      <div class="direction-info">
        <span class="direction-label">今日福神</span>
        <span class="direction-value">{{ directions.fushen }}</span>
      </div>
    </div>

    <!-- 贵神方位 -->
    <div class="direction-item guishen">
      <span class="direction-icon" :style="{ color: guishenColor }">
        ⭐{{ guishenIcon }}
      </span>
      <div class="direction-info">
        <span class="direction-label">今日贵神</span>
        <span class="direction-value">{{ directions.guishen }}</span>
      </div>
    </div>

    <!-- 日柱天干 -->
    <div class="day-stem">
      {{ directions.dayStem }}日
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getDailyDirections, getDirectionIcon, getDirectionColor } from '@/utils/chineseCalendar'

const directions = getDailyDirections()

const caishenIcon = computed(() => getDirectionIcon(directions.caishen))
const xishenIcon = computed(() => getDirectionIcon(directions.xishen))
const fushenIcon = computed(() => getDirectionIcon(directions.fushen))
const guishenIcon = computed(() => getDirectionIcon(directions.guishen))
const caishenColor = computed(() => getDirectionColor(directions.caishen))
const xishenColor = computed(() => getDirectionColor(directions.xishen))
const fushenColor = computed(() => getDirectionColor(directions.fushen))
const guishenColor = computed(() => getDirectionColor(directions.guishen))
</script>

<style scoped>
.daily-directions {
  position: fixed;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
  font-family: 'STKaiti', 'KaiTi', '楷体', serif;
}

.direction-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 248, 231, 0.95);
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(212, 175, 55, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.direction-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.direction-icon {
  font-size: 20px;
  font-weight: bold;
  min-width: 32px;
}

.direction-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.direction-label {
  font-size: 11px;
  color: #8B4513;
  opacity: 0.7;
}

.direction-value {
  font-size: 15px;
  font-weight: 600;
  color: #8B4513;
  letter-spacing: 2px;
}

.day-stem {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  align-self: center;
}

/* 响应式 */
@media (max-width: 768px) {
  .daily-directions {
    top: auto;
    bottom: 10px;
    left: 10px;
    right: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }

  .direction-item {
    padding: 6px 10px;
    border-radius: 8px;
    gap: 6px;
  }

  .direction-icon {
    font-size: 14px;
    min-width: 24px;
  }

  .direction-label {
    font-size: 10px;
  }

  .direction-value {
    font-size: 12px;
    letter-spacing: 1px;
  }

  .day-stem {
    display: none;
  }
}
</style>
