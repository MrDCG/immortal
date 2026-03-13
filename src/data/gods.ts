import type { God } from '@/types'

export const gods: God[] = [
  // 东路财神 - 比干
  {
    id: 'bigan',
    name: '比干',
    title: '东路财神',
    direction: '东',
    type: 'wealth',
    images: {
      video: '/assets/gods/bigan/bigan.webm',
      poster: '/assets/gods/bigan/bigan_00000.png',
      default: '/assets/gods/bigan/bigan_00000.png',
    },
    color: '#D4AF37',
    blessings: [
      '生意兴隆',
      '财源滚滚',
      '招财进宝',
      '黄金万两',
      '财运亨通',
      '富贵吉祥',
      '财星高照',
      '日进斗金',
    ],
  },
  // 西路财神 - 关羽
  {
    id: 'guanyu',
    name: '关羽',
    title: '西路财神',
    direction: '西',
    type: 'wealth',
    images: {
      video: '/assets/gods/guanyu/guanyu.webm',
      poster: '/assets/gods/guanyu/guanyushenxiang_00000.png',
      default: '/assets/gods/guanyu/guanyushenxiang_00000.png',
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
  // 南路财神 - 柴王爷
  {
    id: 'chaiwangye',
    name: '柴王爷',
    title: '南路财神',
    direction: '南',
    type: 'wealth',
    images: {
      video: '/assets/gods/chaiwangye/chaiwangye.webm',
      poster: '/assets/gods/chaiwangye/chaiwangye_00000.png',
      default: '/assets/gods/chaiwangye/chaiwangye_00000.png',
    },
    color: '#B8860B',
    blessings: [
      '富贵荣华',
      '财源广进',
      '招财进宝',
      '如意吉祥',
      '福气满满',
      '财运亨通',
      '金玉满堂',
      '福星高照',
    ],
  },
  // 北路财神 - 赵公明
  {
    id: 'zhaogongming',
    name: '赵公明',
    title: '北路财神',
    direction: '北',
    type: 'wealth',
    images: {
      video: '/assets/gods/zhaogongming/zhaogongming.webm',
      poster: '/assets/gods/zhaogongming/zhaogongmingshenxiang_00000.png',
      default: '/assets/gods/zhaogongming/zhaogongmingshenxiang_00000.png',
    },
    color: '#2F2F2F',
    blessings: [
      '财运亨通',
      '招财进宝',
      '财源滚滚',
      '武运昌盛',
      '生意兴隆',
      '黄金万两',
      '富贵吉祥',
      '财星高照',
    ],
  },
  // 中路财神 - 王亥
  {
    id: 'wanghai',
    name: '王亥',
    title: '中路财神',
    direction: '中',
    type: 'wealth',
    images: {
      video: '/assets/gods/wanghai/wanghai.webm',
      poster: '/assets/gods/wanghai/wanghaishenxiang_00000.png',
      default: '/assets/gods/wanghai/wanghaishenxiang_00000.png',
    },
    color: '#6B3FA0',
    blessings: [
      '生意兴隆',
      '财源广进',
      '招财进宝',
      '商运亨通',
      '富贵吉祥',
      '财运亨通',
      '日进斗金',
      '财星高照',
    ],
  },
  // 月老
  {
    id: 'yuelao',
    name: '月老',
    title: '月下老人',
    direction: '中',
    type: 'love',
    images: {
      video: '/assets/gods/yuelao/yuelao.webm',
      poster: '/assets/gods/yuelao/yuelao_00000.png',
      default: '/assets/gods/yuelao/yuelao_00000.png',
    },
    color: '#FF69B4',
    blessings: [
      '姻缘美满',
      '良缘早到',
      '桃花朵朵',
      '红线相牵',
      '有情人终成眷属',
      '爱情甜蜜',
      '月老保佑',
      '早结良缘',
      '天作之合',
      '白头偕老',
    ],
  },
]

export const defaultGodIndex = 0
