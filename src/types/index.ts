// 神仙类型
export interface God {
  id: string
  name: string
  title: string
  direction: string
  type: 'wealth' | 'love'
  images: {
    // 支持帧动画
    frames?: string[]  // 帧序列图片路径数组
    frameCount?: number // 帧总数
    framePath?: string  // 帧路径模板，如 '/assets/gods/guanyu/frame_{index}.png'
    // 兼容旧版静态图片
    default?: string
    closed?: string
    halfClosed?: string
    quarterClosed?: string
    threeQuarterClosed?: string
  }
  color: string
  blessings: string[]
  // 动画配置
  animation?: {
    fps?: number      // 帧率，默认 15
    loop?: boolean    // 是否循环，默认 true
    idleRange?: [number, number]  // 闲置状态帧范围
  }
}

// 上香记录类型
export interface IncenseRecord {
  godId: string
  date: string
  count: number
}

// 应用状态类型
export interface AppState {
  currentGodIndex: number
  gods: God[]
  incenseRecords: Record<string, IncenseRecord>
}
