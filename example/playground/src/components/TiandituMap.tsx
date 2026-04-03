import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 修复Leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 天地图配置
const TIANDITU_TOKEN = 'e6372a5333c4bac9b9ef6097453c3cd6';

interface TiandituMapProps {
  onMapReady?: (map: L.Map) => void;
}

const TiandituMap: React.FC<TiandituMapProps> = ({ onMapReady }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // 初始化地图
    const map = L.map(mapRef.current, {
      center: [39.9042, 116.4074], // 北京
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // 天地图矢量图层
    const vecLayer = L.tileLayer(
      `https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_TOKEN}`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
      }
    );

    // 天地图矢量标注图层
    const cvaLayer = L.tileLayer(
      `https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TIANDITU_TOKEN}`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
      }
    );

    // 添加图层到地图
    vecLayer.addTo(map);
    cvaLayer.addTo(map);

    mapInstanceRef.current = map;

    // 回调函数
    if (onMapReady) {
      onMapReady(map);
    }

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapReady]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '100%', width: '100%' }} 
    />
  );
};

export default TiandituMap;
