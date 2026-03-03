// 天干类型
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸'

// 地支类型
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥'

// 方位类型
export type Direction = '正北' | '东北' | '正东' | '东南' | '正南' | '西南' | '正西' | '西北'

// 天干数组
const STEMS: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// 地支数组
const BRANCHES: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

/**
 * 计算日柱天干（使用基准日期推算法）
 * 基准：1949年10月1日是甲子日（天干甲=索引0，地支子=索引0）
 * 这是一个经过验证的基准点
 * @param date 公历日期
 * @returns 日柱天干
 */
export function getDayStem(date: Date = new Date()): TianGan {
  // 基准日期：1949年10月1日 = 甲子日（日柱索引=0）
  const baseDate = new Date(1949, 9, 1) // 月份从0开始，9=10月
  const baseDayIndex = 0 // 甲子=0
  
  // 计算天数差
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24))
  
  // 日柱索引 = (基准索引 + 天数差) mod 60
  const dayIndex = (baseDayIndex + daysDiff) % 60
  const adjustedIndex = dayIndex >= 0 ? dayIndex : dayIndex + 60
  
  // 天干 = 日柱索引 mod 10
  const stemIndex = adjustedIndex % 10
  
  return STEMS[stemIndex]
}

/**
 * 获取财神方位（根据《择吉纲要》版本）
 * 甲东北 乙东南 丙丁西南  戊己正北  庚辛正东  壬癸正南
 * @param date 日期，默认为今天
 * @returns 财神方位
 */
export function getCaishenDirection(date: Date = new Date()): Direction {
  const stem = getDayStem(date)
  
  // 财神方位歌诀：甲艮乙坤丙丁兑，戊己坎位庚辛东，壬癸正南
  const caishenMap: Record<TianGan, Direction> = {
    '甲': '东北',  // 艮方
    '乙': '西南',  // 坤方
    '丙': '正西',  // 兑方
    '丁': '正西',  // 兑方
    '戊': '正北',  // 坎方
    '己': '正北',  // 坎方
    '庚': '正东',
    '辛': '正东',
    '壬': '正南',
    '癸': '正南',
  }
  
  return caishenMap[stem]
}

/**
 * 获取喜神方位
 * 甲己在艮乙庚乾，丙辛坤位安喜神
 * 丁壬只在离宫坐，戊癸游来在巽宫
 * @param date 日期，默认为今天
 * @returns 喜神方位
 */
export function getXishenDirection(date: Date = new Date()): Direction {
  const stem = getDayStem(date)

  const xishenMap: Record<TianGan, Direction> = {
    '甲': '东北',  // 艮位
    '乙': '西北',  // 乾位
    '丙': '西南',  // 坤位
    '丁': '正南',  // 离位
    '戊': '东南',  // 巽位
    '己': '东北',  // 艮位
    '庚': '西北',  // 乾位
    '辛': '西南',  // 坤位
    '壬': '正南',  // 离位
    '癸': '东南',  // 巽位
  }

  return xishenMap[stem]
}

/**
 * 获取福神方位
 * 甲己正北是福神，丙辛西北乾宫存
 * 乙庚坤位戊癸艮，丁壬巽上妙追寻
 * @param date 日期，默认为今天
 * @returns 福神方位
 */
export function getFushenDirection(date: Date = new Date()): Direction {
  const stem = getDayStem(date)

  const fushenMap: Record<TianGan, Direction> = {
    '甲': '正北',
    '乙': '西南',
    '丙': '西北',
    '丁': '东南',
    '戊': '东北',
    '己': '正北',
    '庚': '西南',
    '辛': '西北',
    '壬': '东南',
    '癸': '东北',
  }

  return fushenMap[stem]
}

/**
 * 获取天乙贵人（贵神）方位
 * 甲戊庚牛羊，乙己鼠猴乡
 * 丙丁猪鸡位，壬癸兔蛇藏
 * 六辛逢虎马，贵神分阴阳
 * @param date 日期，默认为今天
 * @param useDayNight 是否考虑昼夜（白天用阳贵人，夜晚用阴贵人），默认false使用阳贵人
 * @returns 贵神方位
 */
export function getGuishenDirection(date: Date = new Date(), useDayNight: boolean = false): Direction {
  const stem = getDayStem(date)
  const hour = date.getHours()

  // 判断昼夜（卯时5-7点到酉时17-19点为白天）
  const isDay = hour >= 5 && hour < 17

  const guishenMap: Record<TianGan, { yang: Direction; yin: Direction }> = {
    '甲': { yang: '东北', yin: '西南' },   // 丑=东北, 未=西南
    '乙': { yang: '正北', yin: '西南' },   // 子=正北, 申=西南
    '丙': { yang: '西北', yin: '正西' },   // 亥=西北, 酉=正西
    '丁': { yang: '西北', yin: '正西' },   // 亥=西北, 酉=正西
    '戊': { yang: '东北', yin: '西南' },   // 丑=东北, 未=西南
    '己': { yang: '正北', yin: '西南' },   // 子=正北, 申=西南
    '庚': { yang: '东北', yin: '西南' },   // 丑=东北, 未=西南
    '辛': { yang: '东北', yin: '正南' },   // 寅=东北, 午=正南
    '壬': { yang: '正东', yin: '东南' },   // 卯=正东, 巳=东南
    '癸': { yang: '正东', yin: '东南' },   // 卯=正东, 巳=东南
  }

  const guishen = guishenMap[stem]

  // 如果考虑昼夜且是夜晚，使用阴贵人
  if (useDayNight && !isDay) {
    return guishen.yin
  }

  return guishen.yang
}

/**
 * 获取当日完整神位信息
 * @param date 日期，默认为今天
 * @returns 神位信息对象
 */
export function getDailyDirections(date: Date = new Date()) {
  return {
    caishen: getCaishenDirection(date),
    xishen: getXishenDirection(date),
    fushen: getFushenDirection(date),
    guishen: getGuishenDirection(date),
    dayStem: getDayStem(date),
    dateStr: date.toLocaleDateString('zh-CN'),
  }
}

/**
 * 获取方位对应的图标
 */
export function getDirectionIcon(direction: Direction): string {
  const iconMap: Record<Direction, string> = {
    '正北': '↑',
    '东北': '↗',
    '正东': '→',
    '东南': '↘',
    '正南': '↓',
    '西南': '↙',
    '正西': '←',
    '西北': '↖',
  }
  return iconMap[direction]
}

/**
 * 获取方位对应的颜色
 */
export function getDirectionColor(direction: Direction): string {
  const colorMap: Record<Direction, string> = {
    '正北': '#2196F3',
    '东北': '#4CAF50',
    '正东': '#FF9800',
    '东南': '#FFC107',
    '正南': '#F44336',
    '西南': '#9C27B0',
    '正西': '#3F51B5',
    '西北': '#607D8B',
  }
  return colorMap[direction]
}
