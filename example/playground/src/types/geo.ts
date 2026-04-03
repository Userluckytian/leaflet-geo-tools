import L from 'leaflet'

// 地理要素类型
export type GeoFeatureType = 
  | 'point'
  | 'line' 
  | 'polygon'
  | 'circle'
  | 'rectangle'

// 工具类型
export type ToolType = 
  | 'point'
  | 'line'
  | 'polygon'
  | 'circle'
  | 'rectangle'
  | 'topology'
  | 'reshape'

// 编辑模式
export type EditMode = 
  | 'draw'
  | 'edit'
  | 'delete'
  | 'view'

// 地理要素接口
export interface GeoFeature {
  id: string
  type: GeoFeatureType
  layer: L.Layer
  properties?: Record<string, any>
  coordinates?: L.LatLngExpression | L.LatLngExpression[]
}

// 工具配置接口
export interface ToolConfig {
  id: ToolType
  name: string
  icon: string
  enabled: boolean
  mode?: EditMode
}

// 地图事件接口
export interface MapEvent {
  type: string
  latlng: L.LatLng
  layer?: L.Layer
  originalEvent: Event
}

// 绘制选项接口
export interface DrawOptions {
  color?: string
  weight?: number
  opacity?: number
  fill?: boolean
  fillColor?: string
  fillOpacity?: number
  dashArray?: string
}

// 拓扑操作类型
export type TopologyOperation = 
  | 'union'
  | 'intersection'
  | 'difference'
  | 'buffer'
  | 'simplify'

// 整形操作类型
export type ReshapeOperation = 
  | 'move'
  | 'rotate'
  | 'scale'
  | 'addVertex'
  | 'removeVertex'
  | 'moveVertex'
