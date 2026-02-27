// 神仙类型
export interface God {
  id: string
  name: string
  title: string
  direction: string
  type: 'wealth' | 'love'
  images: {
    default: string
    closed: string
    halfClosed: string
    quarterClosed: string
    threeQuarterClosed: string
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
