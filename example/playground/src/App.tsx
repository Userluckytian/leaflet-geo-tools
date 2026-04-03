import { useState } from 'react'
import { MapContainer } from './components/MapContainer'
import { ToolPanel } from './components/ToolPanel'
import { MapSelector } from './components/MapSelector'
import L from 'leaflet'
import './App.css'

function App() {
  const [map, setMap] = useState<L.Map | null>(null)
  const [activeTool, setActiveTool] = useState<string>('')
  const [mapProvider, setMapProvider] = useState<'osm' | 'tianditu'>('tianditu')
  const [tiandituKey, setTiandituKey] = useState<string>('3e9b06efa6c5413c9127b3f989881c80')

  const handleMapReady = (mapInstance: L.Map) => {
    setMap(mapInstance)
    
    // 添加一个示例标记
    L.marker([39.9042, 116.4074])
      .addTo(mapInstance)
      .bindPopup('北京')
      .openPopup()
  }

  const handleToolSelect = (tool: string) => {
    setActiveTool(tool)
    console.log('选中工具:', tool)
    // 这里后续会添加具体的工具逻辑
  }

  const handleProviderChange = (provider: 'osm' | 'tianditu') => {
    setMapProvider(provider)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Leaflet Geo Tools Playground</h1>
        {activeTool && (
          <div className="current-tool">
            当前工具: <strong>{activeTool}</strong>
          </div>
        )}
      </header>
      <main className="app-main">
        <MapContainer 
          onMapReady={handleMapReady} 
          mapProvider={mapProvider}
          tiandituKey={tiandituKey}
        />
        <ToolPanel onToolSelect={handleToolSelect} />
        <MapSelector 
          currentProvider={mapProvider}
          onProviderChange={handleProviderChange}
          tiandituKey={tiandituKey}
          onKeyChange={setTiandituKey}
        />
      </main>
    </div>
  )
}

export default App
