import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Alert, Switch } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BaseTab from '../BaseTab';

// 修复Leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PointEditorTab: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.9042, 116.4074],
      zoom: 12,
      zoomControl: true,
    });

    // 使用OpenStreetMap作为底图（暂时替代天地图）
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleEditing = () => {
    if (!mapInstanceRef.current) return;

    setIsEditing(!isEditing);
    
    if (!isEditing) {
      // 开始编辑模式
      mapInstanceRef.current.on('click', handleMapClick);
    } else {
      // 结束编辑模式
      mapInstanceRef.current.off('click', handleMapClick);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!mapInstanceRef.current) return;

    const marker = L.marker([e.latlng.lat, e.latlng.lng])
      .addTo(mapInstanceRef.current)
      .bindPopup(`点标记<br>坐标: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);

    setMarkers(prev => [...prev, marker]);
  };

  const clearMarkers = () => {
    if (!mapInstanceRef.current) return;

    markers.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });

    setMarkers([]);
  };

  return (
    <BaseTab title="点编辑器">
      <Card title="地图工具" size="small">
        <div className="toolbar">
          <Space>
            <Switch 
              checked={isEditing}
              onChange={toggleEditing}
              checkedChildren="编辑中"
              unCheckedChildren="查看"
            />
            <Button onClick={clearMarkers} danger>
              清除所有点
            </Button>
          </Space>
        </div>

        {isEditing && (
          <Alert
            message="编辑模式已开启"
            description="点击地图任意位置添加点标记"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <div className="map-wrapper">
          <div 
            ref={mapRef} 
            style={{ height: '100%', width: '100%' }} 
          />
        </div>
      </Card>
    </BaseTab>
  );
};

export default PointEditorTab;
