import React from 'react'
import { EngineProvider } from './contexts/EngineContext'
import AppShell from './components/AppShell'

export default function App() {
	return (
		<EngineProvider>
			<AppShell />
		</EngineProvider>
	)
}
