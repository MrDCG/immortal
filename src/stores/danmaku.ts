import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export interface Danmaku {
  id: string
  text: string
  color: string
  fontSize: number
  speed: number
  timestamp: number
}

export interface DanmakuConfig {
  // 弹幕开关
  enabled: boolean
  // 弹幕透明度 (0-1)
  opacity: number
  // 弹幕字体大小倍数 (0.5-2)
  fontSizeScale: number
  // 弹幕速度倍数 (0.5-2)
  speedScale: number
  // 弹幕区域高度 (20%-100%)
  areaHeight: number
  // 同屏弹幕最大数量
  maxCount: number
  // 是否显示自己发送的弹幕
  showOwn: boolean
  // 弹幕颜色模式
  colorMode: 'random' | 'white' | 'custom'
  // 自定义弹幕颜色
  customColor: string
}

export const useDanmakuStore = defineStore('danmaku', () => {
  // 弹幕列表
  const danmakuList = ref<Danmaku[]>([])

  // 弹幕配置
  const config = reactive<DanmakuConfig>({
    enabled: true,
    opacity: 0.8,
    fontSizeScale: 1,
    speedScale: 1,
    areaHeight: 80,
    maxCount: 50,
    showOwn: true,
    colorMode: 'random',
    customColor: '#ffffff'
  })

  // 默认颜色列表
  const colors = [
    '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#FF69B4', '#90EE90'
  ]

  // 添加弹幕
  const addDanmaku = (text: string) => {
    const danmaku: Danmaku = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      text,
      color: getDanmakuColor(),
      fontSize: 24 * config.fontSizeScale,
      speed: 5 * config.speedScale,
      timestamp: Date.now()
    }
    danmakuList.value.push(danmaku)

    // 限制弹幕数量
    if (danmakuList.value.length > config.maxCount) {
      danmakuList.value = danmakuList.value.slice(-config.maxCount)
    }
  }

  // 获取弹幕颜色
  const getDanmakuColor = () => {
    switch (config.colorMode) {
      case 'random':
        return colors[Math.floor(Math.random() * colors.length)]
      case 'white':
        return '#FFFFFF'
      case 'custom':
        return config.customColor
      default:
        return '#FFFFFF'
    }
  }

  // 移除弹幕
  const removeDanmaku = (id: string) => {
    const index = danmakuList.value.findIndex(d => d.id === id)
    if (index > -1) {
      danmakuList.value.splice(index, 1)
    }
  }

  // 清空弹幕
  const clearDanmaku = () => {
    danmakuList.value = []
  }

  // 更新配置
  const updateConfig = (newConfig: Partial<DanmakuConfig>) => {
    Object.assign(config, newConfig)
    // 保存到 localStorage
    localStorage.setItem('danmaku-config', JSON.stringify(config))
  }

  // 从 localStorage 加载配置
  const loadConfig = () => {
    const saved = localStorage.getItem('danmaku-config')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        Object.assign(config, parsed)
      } catch (e) {
        console.error('Failed to load danmaku config:', e)
      }
    }
  }

  // 初始化时加载配置
  loadConfig()

  return {
    danmakuList,
    config,
    addDanmaku,
    removeDanmaku,
    clearDanmaku,
    updateConfig,
    getDanmakuColor
  }
})
