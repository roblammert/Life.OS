import React from 'react'
import Sidebar from './Sidebar'
import MainView from './MainView'

const layoutStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '260px 1fr',
  height: '100vh',
}

export default function AppShell() {
  return (
    <div style={layoutStyle}>
      <Sidebar />
      <MainView />
    </div>
  )
}
