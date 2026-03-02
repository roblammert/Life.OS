import React, { useEffect, useState } from 'react'
import { useEngines } from '../contexts/EngineContext'

export default function MainView() {
  const { memory, notification, context } = useEngines()
  const [memories, setMemories] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  function refresh() {
    setMemories(memory.handle({ action: 'list' }) || [])
    setNotifications(notification.handle({ action: 'list' }) || [])
  }

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Life.OS — Frontend Preview</h2>

      <section style={{ marginTop: 12 }}>
        <h3>Context</h3>
        <pre style={{ background: '#f7f7f7', padding: 8 }}>{JSON.stringify(context.getState().items, null, 2)}</pre>
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Memories</h3>
        {memories.length === 0 ? <div>No memories yet.</div> : (
          <ul>
            {memories.map(m => (
              <li key={m.id}><strong>{new Date(m.timestamp).toLocaleString()}:</strong> {m.text}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: 12 }}>
        <h3>Notifications</h3>
        {notifications.length === 0 ? <div>No notifications.</div> : (
          <ul>
            {notifications.map(n => (
              <li key={n.id}><strong>{new Date(n.timestamp).toLocaleString()}:</strong> {n.title} — {n.body}</li>
            ))}
          </ul>
        )}
      </section>

    </div>
  )
}
