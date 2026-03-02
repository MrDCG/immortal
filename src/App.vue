<template>
  <DailyDirections />
  <GodCard :god="currentGod" @key-press="handleKeyPress" />
  <Navigation
    :current-index="currentGodIndex"
    @prev="prevGod"
    @next="nextGod"
    @go-to="goToGod"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gods, defaultGodIndex } from './data/gods'
import GodCard from './components/GodCard.vue'
import Navigation from './components/Navigation.vue'
import DailyDirections from './components/DailyDirections.vue'

const currentGodIndex = ref(defaultGodIndex)
const currentGod = computed(() => gods[currentGodIndex.value])

const prevGod = () => {
  if (currentGodIndex.value > 0) {
    currentGodIndex.value--
  }
}

const nextGod = () => {
  if (currentGodIndex.value < gods.length - 1) {
    currentGodIndex.value++
  }
}

const goToGod = (index: number) => {
  currentGodIndex.value = index
}

const handleKeyPress = (direction: 'left' | 'right') => {
  if (direction === 'left') {
    prevGod()
  } else {
    nextGod()
  }
}

// 键盘事件监听
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    prevGod()
  } else if (e.key === 'ArrowRight') {
    nextGod()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
