import { Engine } from './Engine'

export type MemoryRecord = {
  id: string
  timestamp: number
  text: string
  meta?: Record<string, any>
}

export class MemoryEngine extends Engine<{ memories: MemoryRecord[] }> {
  constructor() {
    super('MemoryEngine', { memories: [] })
  }

  start() {}
  stop() {}

  handle(payload: { action: 'add' | 'list' | 'search'; text?: string; meta?: any }) {
    const { action } = payload
    if (action === 'add') {
      const rec: MemoryRecord = {
        id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
        timestamp: Date.now(),
        text: payload.text || '',
        meta: payload.meta || {},
      }
      this.state.memories.push(rec)
      return rec
    }
    if (action === 'list') {
      return this.state.memories.slice().reverse()
    }
    if (action === 'search') {
      const q = (payload.text || '').toLowerCase()
      return this.state.memories.filter(m => m.text.toLowerCase().includes(q))
    }
    return null
  }
}
