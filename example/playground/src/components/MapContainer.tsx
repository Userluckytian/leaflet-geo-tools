import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// 修复Leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapContainerProps {
  center?: [number, number]
  zoom?: number
  className?: string
  onMapReady?: (map: L.Map) => void
  tiandituKey: string // 天地图API密钥
}

export function MapContainer({ 
  center = [39.9042, 116.4074], 
  zoom = 13,
  className = '',
  onMapReady,
  tiandituKey
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  // 天地图图层配置
  const getTiandituLayers = (key: string) => {
    const baseUrl = `https://t{s}.tianditu.gov.cn/{service}_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={layer}&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${key}`

    return {
      // 矢量底图
      vec: L.tileLayer(baseUrl.replace('{service}', 'vec').replace('{layer}', 'vec'), {
        attribution: '© 天地图',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
      }),
      // 矢量注记
      cva: L.tileLayer(baseUrl.replace('{service}', 'cva').replace('{layer}', 'cva'), {
        attribution: '© 天地图',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
      }),
      // 影像底图
      img: L.tileLayer(baseUrl.replace('{service}', 'img').replace('{layer}', 'img'), {
        attribution: '© 天地图',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
      }),
      // 影像注记
      cia: L.tileLayer(baseUrl.replace('{service}', 'cia').replace('{layer}', 'cia'), {
        attribution: '© 天地图',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
      })
    }
  }

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // 初始化地图
    const map = L.map(mapRef.current).setView(center, zoom)

    // 添加天地图图层
    const tiandituLayers = getTiandituLayers(tiandituKey)
    // 默认使用矢量底图 + 注记
    tiandituLayers.vec.addTo(map)
    tiandituLayers.cva.addTo(map)

    mapInstanceRef.current = map

    // 通知父组件地图已准备就绪
    if (onMapReady) {
      onMapReady(map)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div 
      ref={mapRef} 
      className={`map-container ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
