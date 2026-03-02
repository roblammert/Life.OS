import React, { createContext, useContext, useMemo, useEffect } from 'react'
import { ContextEngine } from '../engines/ContextEngine'
import { MemoryEngine } from '../engines/MemoryEngine'
import { NotificationEngine } from '../engines/NotificationEngine'

type Engines = {
  context: ContextEngine
  memory: MemoryEngine
  notification: NotificationEngine
}

const EngineContext = createContext<Engines | null>(null)

export const EngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const engines = useMemo(() => ({
    context: new ContextEngine(),
    memory: new MemoryEngine(),
    notification: new NotificationEngine(),
  }), [])

  useEffect(() => {
    // start engines
    engines.context.start()
    engines.memory.start()
    engines.notification.start()
    return () => {
      engines.context.stop()
      engines.memory.stop()
      engines.notification.stop()
    }
  }, [engines])

  return <EngineContext.Provider value={engines}>{children}</EngineContext.Provider>
}

export function useEngines() {
  const ctx = useContext(EngineContext)
  if (!ctx) throw new Error('useEngines must be used inside EngineProvider')
  return ctx
}
