import { useState } from 'react'
import './ToolPanel.css'

interface ToolPanelProps {
  onToolSelect?: (tool: string) => void
}

export function ToolPanel({ onToolSelect }: ToolPanelProps) {
  const [activeTool, setActiveTool] = useState<string>('')

  const tools = [
    { id: 'point', name: '点编辑', icon: '📍' },
    { id: 'line', name: '线编辑', icon: '📏' },
    { id: 'polygon', name: '面编辑', icon: '🔷' },
    { id: 'circle', name: '圆形编辑', icon: '⭕' },
    { id: 'rectangle', name: '矩形编辑', icon: '⬜' },
    { id: 'topology', name: '拓扑操作', icon: '🔗' },
    { id: 'reshape', name: '整形操作', icon: '✏️' },
  ]

  const handleToolClick = (toolId: string) => {
    setActiveTool(toolId)
    if (onToolSelect) {
      onToolSelect(toolId)
    }
  }

  return (
    <div className="tool-panel">
      <h3>地理工具</h3>
      <div className="tool-list">
        {tools.map(tool => (
          <button
            key={tool.id}
            className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
            onClick={() => handleToolClick(tool.id)}
            title={tool.name}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
