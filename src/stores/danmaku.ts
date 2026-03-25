import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export interface Danmaku {
  id: string
  text: string
  color: string
  fontSize: number
  speed: number
  timestamp: number
  isHistory?: boolean
  displayDelay?: number // 历史弹幕的显示延迟时间
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

  // 历史弹幕列表（只加载，不直接显示）
  const historyDanmakuList = ref<Danmaku[]>([])

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

  // 清空回调
  let clearCallback: (() => void) | null = null

  // 注册清空回调
  const registerClearCallback = (callback: () => void) => {
    clearCallback = callback
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

  // WebSocket 连接
  let socket: any = null

  // 连接 WebSocket
  const connectWebSocket = async () => {
    try {
      const { io } = await import('socket.io-client')
      socket = io('http://156.238.254.48:3002')

      socket.on('connect', () => {
        console.log('[Danmaku] WebSocket 连接成功')
      })

      socket.on('connected', (data: any) => {
        console.log('[Danmaku]', data.message)
      })

      // 接收新弹幕
      socket.on('new_danmaku', (danmaku: any) => {
        console.log('[Danmaku] 收到新弹幕:', danmaku.text)

        // 转换为前端格式
        const newDanmaku: Danmaku = {
          id: danmaku.id.toString(),
          text: danmaku.text,
          color: danmaku.color,
          fontSize: danmaku.font_size * config.fontSizeScale,
          speed: danmaku.speed * config.speedScale,
          timestamp: new Date(danmaku.created_at).getTime(),
          isHistory: false
        }

        danmakuList.value.push(newDanmaku)

        // 限制弹幕数量
        if (danmakuList.value.length > config.maxCount) {
          danmakuList.value = danmakuList.value.slice(-config.maxCount)
        }
      })

      socket.on('error', (error: any) => {
        console.error('[Danmaku] WebSocket 错误:', error)
      })

      socket.on('disconnect', () => {
        console.log('[Danmaku] WebSocket 断开连接')
      })
    } catch (error) {
      console.error('[Danmaku] 连接 WebSocket 失败:', error)
    }
  }

  // 获取历史弹幕
  const fetchHistoryDanmaku = async () => {
    try {
      const response = await fetch('http://156.238.254.48:3002/api/danmaku')
      const result = await response.json()

      if (result.success && result.data.length > 0) {
        // 转换为前端格式，标记为历史弹幕
        const historyDanmakus = result.data.map((d: any, index: number) => ({
          id: d.id.toString(),
          text: d.text,
          color: d.color,
          fontSize: d.font_size * config.fontSizeScale,
          speed: d.speed * config.speedScale,
          timestamp: new Date(d.created_at).getTime(),
          isHistory: true,
          // 为历史弹幕设置分批显示的延迟时间（2-10秒之间）
          displayDelay: 2000 + (index * 300)
        }))

        historyDanmakuList.value = historyDanmakus
        danmakuList.value = historyDanmakus
        console.log(`[Danmaku] 加载了 ${historyDanmakus.length} 条历史弹幕`)
      }
    } catch (error) {
      console.error('[Danmaku] 获取历史弹幕失败:', error)
    }
  }

  // 添加弹幕（发送到服务器）
  const addDanmaku = async (text: string) => {
    try {
      if (!socket || !socket.connected) {
        console.warn('[Danmaku] WebSocket 未连接')
        return
      }

      const danmakuData = {
        text,
        color: getDanmakuColor(),
        fontSize: Math.round(24 * config.fontSizeScale),
        speed: Math.round(5 * config.speedScale)
      }

      // 发送到服务器
      socket.emit('send_danmaku', danmakuData)
      console.log('[Danmaku] 发送弹幕:', text)
    } catch (error) {
      console.error('[Danmaku] 发送弹幕失败:', error)
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
    // 只清空可见弹幕，保留历史弹幕记录
    danmakuList.value = [...historyDanmakuList.value]
    // 调用注册的清空回调
    if (clearCallback) {
      clearCallback()
    }
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

  // 初始化
  const init = async () => {
    loadConfig()
    await connectWebSocket()
    await fetchHistoryDanmaku()
  }

  // 清理
  const cleanup = () => {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  }

  // 初始化时加载配置
  loadConfig()

  return {
    danmakuList,
    historyDanmakuList,
    config,
    addDanmaku,
    removeDanmaku,
    clearDanmaku,
    updateConfig,
    getDanmakuColor,
    connectWebSocket,
    fetchHistoryDanmaku,
    init,
    cleanup,
    registerClearCallback
  }
})
