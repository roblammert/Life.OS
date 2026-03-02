import { Engine } from './Engine'

export type NotificationRecord = {
  id: string
  timestamp: number
  title: string
  body?: string
}

export class NotificationEngine extends Engine<{ queue: NotificationRecord[] }> {
  constructor() {
    super('NotificationEngine', { queue: [] })
  }

  start() {}
  stop() {}

  handle(payload: { action: 'push' | 'list' | 'consume'; title?: string; body?: string }) {
    const { action } = payload
    if (action === 'push') {
      const n: NotificationRecord = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
        timestamp: Date.now(),
        title: payload.title || 'Notification',
        body: payload.body || '',
      }
      this.state.queue.unshift(n)
      return n
    }
    if (action === 'list') return this.state.queue.slice()
    if (action === 'consume') {
      return this.state.queue.shift() || null
    }
    return null
  }
}
