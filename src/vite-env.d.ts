/* eslint-disable */
/* eslint-disable prettier/prettier */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Umami Analytics 类型声明
interface Umami {
  track: (event_name: string, event_data?: Record<string, unknown>) => void
}

declare global {
  interface Window {
    umami?: Umami
  }
}

// Vite 环境变量类型
interface ImportMetaEnv {
  readonly VITE_UMAMI_SCRIPT_URL: string
  readonly VITE_UMAMI_WEBSITE_ID: string
  readonly VITE_UMAMI_ENABLED: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
