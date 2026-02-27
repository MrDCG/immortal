import type { God } from '@/types'

// 生成关羽73帧图片路径
const generateGuanyuFrames = (): string[] => {
  const frames: string[] = []
  for (let i = 0; i <= 72; i++) {
    const frameNumber = i.toString().padStart(5, '0')
    frames.push(`/assets/gods/guanyu/guanyu_${frameNumber}.png`)
  }
  return frames
}

const guanyuFrames = generateGuanyuFrames()

export const gods: God[] = [
  {
    id: 'guanyu',
    name: '关羽',
    title: '西路财神',
    direction: '西',
    type: 'wealth',
    images: {
      frames: guanyuFrames,
      frameCount: 73,
      framePath: '/assets/gods/guanyu/guanyu_{index}.png',
      // 保留兼容性
      default: guanyuFrames[0],
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
    animation: {
      fps: 12,  // 12fps，约6秒播放完整循环
      loop: true,
    },
  },
]

export const defaultGodIndex = 0
