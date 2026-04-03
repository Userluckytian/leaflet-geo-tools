import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Alert, Switch } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BaseTab from '../BaseTab';

const PolylineEditorTab: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [polylines, setPolylines] = useState<L.Polyline[]>([]);
  const [tempPoints, setTempPoints] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      center: [39.9042, 116.4074],
      zoom: 12,
      zoomControl: true,
    });

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
      mapInstanceRef.current.on('click', handleMapClick);
    } else {
      mapInstanceRef.current.off('click', handleMapClick);
      // 清除临时点
      setTempPoints([]);
    }
  };

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!mapInstanceRef.current) return;

    const newPoints = [...tempPoints, e.latlng];
    setTempPoints(newPoints);

    // 添加临时点标记
    L.circleMarker(e.latlng, {
      radius: 5,
      fillColor: '#ff7800',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(mapInstanceRef.current);

    // 如果有两个或更多点，绘制临时线
    if (newPoints.length >= 2) {
      const tempLine = L.polyline(newPoints, {
        color: '#ff7800',
        weight: 3,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(mapInstanceRef.current);

      // 双击完成线绘制
      mapInstanceRef.current.once('dblclick', () => {
        finishPolyline(newPoints);
      });
    }
  };

  const finishPolyline = (points: L.LatLng[]) => {
    if (!mapInstanceRef.current || points.length < 2) return;

    const polyline = L.polyline(points, {
      color: '#3388ff',
      weight: 5,
      opacity: 0.7
    }).addTo(mapInstanceRef.current);

    polyline.bindPopup(`线段<br>包含 ${points.length} 个点`);

    setPolylines(prev => [...prev, polyline]);
    setTempPoints([]);
    
    // 清除临时标记
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
      if (layer instanceof L.Polyline && layer.options.dashArray) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });
  };

  const clearPolylines = () => {
    if (!mapInstanceRef.current) return;

    polylines.forEach(polyline => {
      mapInstanceRef.current?.removeLayer(polyline);
    });

    setPolylines([]);
  };

  return (
    <BaseTab title="线编辑器">
      <Card title="地图工具" size="small">
        <div className="toolbar">
          <Space>
            <Switch 
              checked={isEditing}
              onChange={toggleEditing}
              checkedChildren="编辑中"
              unCheckedChildren="查看"
            />
            <Button onClick={clearPolylines} danger>
              清除所有线
            </Button>
          </Space>
        </div>

        {isEditing && (
          <Alert
            message="编辑模式已开启"
            description="单击地图添加点，双击完成线段绘制"
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

export default PolylineEditorTab;
