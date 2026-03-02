import React, { useState } from 'react'
import { useEngines } from '../contexts/EngineContext'

export default function Sidebar() {
  const { memory, notification } = useEngines()
  const [text, setText] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteBody, setNoteBody] = useState('')

  function addMemory() {
    if (!text.trim()) return
    const rec = memory.handle({ action: 'add', text })
    setText('')
    console.log('Added memory', rec)
  }

  function pushNotification() {
    if (!noteTitle.trim()) return
    const n = notification.handle({ action: 'push', title: noteTitle, body: noteBody })
    setNoteTitle('')
    setNoteBody('')
    console.log('Pushed notification', n)
  }

  return (
    <div style={{ padding: 16, borderRight: '1px solid #eee' }}>
      <h3>Controls</h3>
      <div>
        <label>Memory</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={4} style={{ width: '100%' }} />
        <button onClick={addMemory} style={{ marginTop: 8 }}>Add Memory</button>
      </div>

      <hr />

      <div>
        <label>Notification</label>
        <input value={noteTitle} onChange={e => setNoteTitle(e.target.value)} placeholder="Title" style={{ width: '100%' }} />
        <textarea value={noteBody} onChange={e => setNoteBody(e.target.value)} rows={3} style={{ width: '100%' }} />
        <button onClick={pushNotification} style={{ marginTop: 8 }}>Push Notification</button>
      </div>

    </div>
  )
}
