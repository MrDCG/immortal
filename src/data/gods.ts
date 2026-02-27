import type { God } from '@/types'

export const gods: God[] = [
  {
    id: 'guanyu',
    name: '关羽',
    title: '西路财神',
    direction: '西',
    type: 'wealth',
    images: {
      default: '/assets/gods/guanyu/睁眼.png',
      closed: '/assets/gods/guanyu/闭眼.png',
      halfClosed: '/assets/gods/guanyu/半睁眼.png',
      quarterClosed: '/assets/gods/guanyu/闭眼四分之一.png',
      threeQuarterClosed: '/assets/gods/guanyu/闭眼四分之三.png',
    },
    color: '#C41E3A',
    blessings: [
      '生意兴隆',
      '财源广进',
      '招财进宝',
      '武运昌盛',
      '义薄云天',
      '关公保佑',
      '财运亨通',
      '黄金万两',
    ],
  },
]

export const defaultGodIndex = 0
