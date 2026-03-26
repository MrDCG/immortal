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

  // 待处理的弹幕（用于防重复）
  const pendingDanmakus = ref<Set<string>>(new Set())

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
      socket = io('', { // 使用相对路径，通过 nginx 反向代理
        path: '/socket.io/'
      })

      socket.on('connect', () => {
        console.log('[Danmaku] WebSocket 连接成功')
      })

      socket.on('connected', (data: any) => {
        console.log('[Danmaku]', data.message)
      })

      // 接收新弹幕
      socket.on('new_danmaku', (danmaku: any) => {
        console.log('[Danmaku] 收到新弹幕:', danmaku.text)

        // 检查是否是本地发送的弹幕（通过文本和时间戳判断）
        const now = Date.now()
        const isLocal = now - new Date(danmaku.created_at).getTime() < 2000 &&
                         pendingDanmakus.value.has(danmaku.text)

        if (isLocal) {
          // 是本地发送的弹幕，从待处理列表中移除
          pendingDanmakus.value.delete(danmaku.text)
          console.log('[Danmaku] 跳过本地弹幕重复添加')
          return
        }

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

  // 获取历史弹幕（方案一：优化加载间隔 + 随机错开，避免整齐出现）
  const fetchHistoryDanmaku = async () => {
    try {
      const response = await fetch('/api/danmaku') // 使用相对路径，通过 nginx 反向代理
      const result = await response.json()

      if (result.success && result.data.length > 0) {
        // ⭐ 从 localStorage 读取加载间隔配置（默认500ms）
        const savedConfig = localStorage.getItem('danmaku-collision-config')
        let intervalDelay = 500 // 默认值
        if (savedConfig) {
          try {
            const parsed = JSON.parse(savedConfig)
            intervalDelay = parsed.loadInterval || 500
          } catch (e) {
            console.error('Failed to parse collision config:', e)
          }
        }
        
        const baseDelay = 2000 // 基础延迟2秒
        
        // 转换为前端格式，标记为历史弹幕
        const historyDanmakus = result.data.map((d: any, index: number) => {
          // ⭐ 关键优化：为每条弹幕添加随机延迟（0-2000ms），让错开效果更明显
          const randomDelay = Math.random() * 2000 // 随机延迟0-2000ms（2秒范围）
          
          return {
            id: d.id.toString(),
            text: d.text,
            color: d.color,
            fontSize: d.font_size * config.fontSizeScale,
            speed: d.speed * config.speedScale,
            timestamp: new Date(d.created_at).getTime(),
            isHistory: true,
            // ⭐ 使用动态配置的间隔 + 大范围随机延迟，让弹幕明显错开
            displayDelay: baseDelay + (index * intervalDelay) + randomDelay
          }
        })

        historyDanmakuList.value = historyDanmakus
        danmakuList.value = historyDanmakus
        console.log(`[Danmaku] 加载了 ${historyDanmakus.length} 条历史弹幕，间隔: ${intervalDelay}ms + 随机0-500ms`)
        console.log(`[Danmaku] 预计最后一条弹幕显示时间: ${(baseDelay + (historyDanmakus.length - 1) * intervalDelay + 500) / 1000}秒后`)
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

      // 将弹幕文本添加到待处理列表
      pendingDanmakus.value.add(text)

      // 立即在本地显示弹幕（无需等待服务器返回）
      const localDanmaku: Danmaku = {
        id: `local_${Date.now()}_${Math.random()}`,
        text: text,
        color: danmakuData.color,
        fontSize: danmakuData.fontSize,
        speed: danmakuData.speed,
        timestamp: Date.now(),
        isHistory: false
      }

      // 使用数组的展开运算符触发 Vue 的响应式更新
      danmakuList.value = [...danmakuList.value, localDanmaku]

      // 注意：不再在这里限制 danmakuList 的数量
      // 数量限制应该在 SimpleDanmaku 组件中的 visibleDanmakus 中处理
      console.log('[Danmaku] danmakuList 长度:', danmakuList.value.length)

      console.log('[Danmaku] 本地已添加弹幕:', text)

      // 发送到服务器
      socket.emit('send_danmaku', danmakuData)
      console.log('[Danmaku] 发送弹幕到服务器:', text)

      // 3秒后清理待处理列表（防止误判）
      setTimeout(() => {
        pendingDanmakus.value.delete(text)
      }, 3000)
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
