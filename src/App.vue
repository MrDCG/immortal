<template>
  <GodCard :god="currentGod" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { gods } from './data/gods'
import GodCard from './components/GodCard.vue'

const currentGod = computed(() => gods[0])
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
</style>
