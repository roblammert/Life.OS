export type EngineState = any

export abstract class Engine<S = EngineState> {
  name: string
  protected state: S

  constructor(name: string, initialState: S) {
    this.name = name
    this.state = initialState
  }

  start(): void | Promise<void> {
    // optional lifecycle
  }

  stop(): void | Promise<void> {
    // optional lifecycle
  }

  abstract handle(payload?: any): any

  getState(): S {
    return this.state
  }

  setState(next: Partial<S> | S) {
    if (typeof next === 'object' && next !== null) {
      // @ts-ignore shallow merge
      this.state = { ...(this.state as any), ...(next as any) } as S
    } else {
      this.state = next as S
    }
  }
}
