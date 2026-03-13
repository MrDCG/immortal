// 神仙类型
export interface God {
  id: string
  name: string
  title: string
  direction: string
  type: 'wealth' | 'love'
  images: {
    // 视频动画（推荐，体积小加载快）
    video?: string    // 视频路径，如 '/assets/gods/guanyu/guanyu.webm'
    poster?: string   // 视频封面图
    // 兼容旧版静态图片
    default?: string
  }
  color: string
  blessings: string[]
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
