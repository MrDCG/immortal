/**
 * Umami Analytics 工具函数
 * 用于追踪用户行为和事件
 */

/**
 * 追踪自定义事件
 * @param eventName 事件名称
 * @param eventData 事件数据（可选）
 */
export function trackEvent(
  eventName: string,
  eventData?: Record<string, unknown>
): void {
  if (window.umami) {
    window.umami.track(eventName, eventData)
  }
}

/**
 * 追踪用户祈祷事件
 * @param godName 神仙名称
 */
export function trackBlessing(godName: string): void {
  trackEvent('blessing', { god: godName })
}

/**
 * 追踪上香事件
 * @param incenseType 香的类型
 */
export function trackIncense(incenseType: string): void {
  trackEvent('incense', { type: incenseType })
}

/**
 * 追踪页面浏览（SPA 路由变化时使用）
 * Umami 会自动追踪初始页面加载，但如果需要手动追踪路由变化，可以使用此函数
 */
export function trackPageView(url?: string): void {
  if (window.umami) {
    window.umami.track(url || window.location.pathname)
  }
}

/**
 * 检查 Umami 是否已加载
 */
export function isUmamiLoaded(): boolean {
  return typeof window.umami !== 'undefined'
}
