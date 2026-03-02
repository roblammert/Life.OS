import { Engine } from './Engine'

export type ContextItems = Record<string, any>

export class ContextEngine extends Engine<{ items: ContextItems }> {
  constructor() {
    super('ContextEngine', { items: {} })
  }

  start() {
    // initialize if needed
  }

  stop() {
    // cleanup
  }

  handle(payload: { action: 'set' | 'get' | 'delete'; key: string; value?: any }) {
    const { action, key, value } = payload
    if (action === 'set') {
      this.state.items[key] = value
      return { ok: true }
    }
    if (action === 'get') {
      return this.state.items[key]
    }
    if (action === 'delete') {
      delete this.state.items[key]
      return { ok: true }
    }
    return null
  }
}
