import { useState } from 'react'
import './MapSelector.css'

interface MapSelectorProps {
  currentProvider: 'osm' | 'tianditu'
  onProviderChange: (provider: 'osm' | 'tianditu') => void
  tiandituKey: string
  onKeyChange: (key: string) => void
}

export function MapSelector({ 
  currentProvider, 
  onProviderChange, 
  tiandituKey, 
  onKeyChange 
}: MapSelectorProps) {
  const [showKeyInput, setShowKeyInput] = useState(false)

  const handleProviderSelect = (provider: 'osm' | 'tianditu') => {
    if (provider === 'tianditu' && !tiandituKey) {
      setShowKeyInput(true)
    } else {
      onProviderChange(provider)
    }
  }

  const handleKeySubmit = () => {
    if (tiandituKey.trim()) {
      onProviderChange('tianditu')
      setShowKeyInput(false)
    }
  }

  return (
    <div className="map-selector">
      <h4>地图选择</h4>
      <div className="provider-buttons">
        <button
          className={`provider-btn ${currentProvider === 'osm' ? 'active' : ''}`}
          onClick={() => onProviderChange('osm')}
        >
          OpenStreetMap
        </button>
        <button
          className={`provider-btn ${currentProvider === 'tianditu' ? 'active' : ''}`}
          onClick={() => handleProviderSelect('tianditu')}
        >
          天地图
        </button>
      </div>
      
      {showKeyInput && (
        <div className="key-input-container">
          <input
            type="text"
            placeholder="请输入天地图API密钥"
            value={tiandituKey}
            onChange={(e) => onKeyChange(e.target.value)}
            className="key-input"
          />
          <div className="key-buttons">
            <button onClick={handleKeySubmit} className="submit-btn">
              确定
            </button>
            <button onClick={() => setShowKeyInput(false)} className="cancel-btn">
              取消
            </button>
          </div>
          <p className="key-hint">
            免费密钥获取：访问 <a href="https://console.tianditu.gov.cn/api/key" target="_blank" rel="noopener noreferrer">天地图开发者平台</a>
          </p>
        </div>
      )}
      
      {currentProvider === 'tianditu' && !tiandituKey && (
        <p className="warning">使用免费版天地图，可能有限制</p>
      )}
    </div>
  )
}
