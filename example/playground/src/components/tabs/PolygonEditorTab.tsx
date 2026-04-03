import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Alert, Switch } from 'antd';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BaseTab from '../BaseTab';

const PolygonEditorTab: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [polygons, setPolygons] = useState<L.Polygon[]>([]);
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

    // 如果有三个或更多点，绘制临时多边形
    if (newPoints.length >= 3) {
      const tempPolygon = L.polygon(newPoints, {
        color: '#ff7800',
        weight: 2,
        opacity: 0.7,
        fillOpacity: 0.2,
        dashArray: '5, 10'
      }).addTo(mapInstanceRef.current);

      // 双击完成多边形绘制
      mapInstanceRef.current.once('dblclick', () => {
        finishPolygon(newPoints);
      });
    }
  };

  const finishPolygon = (points: L.LatLng[]) => {
    if (!mapInstanceRef.current || points.length < 3) return;

    const polygon = L.polygon(points, {
      color: '#3388ff',
      weight: 3,
      opacity: 0.8,
      fillColor: '#3388ff',
      fillOpacity: 0.3
    }).addTo(mapInstanceRef.current);

    // 计算面积（简化计算）
    const area = L.GeometryUtil.geodesicArea(points);
    const areaStr = area > 1000000 
      ? `${(area / 1000000).toFixed(2)} km²`
      : `${area.toFixed(2)} m²`;

    polygon.bindPopup(`多边形<br>顶点数: ${points.length}<br>面积: ${areaStr}`);

    setPolygons(prev => [...prev, polygon]);
    setTempPoints([]);
    
    // 清除临时标记
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer);
      }
      if (layer instanceof L.Polygon && layer.options.dashArray) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });
  };

  const clearPolygons = () => {
    if (!mapInstanceRef.current) return;

    polygons.forEach(polygon => {
      mapInstanceRef.current?.removeLayer(polygon);
    });

    setPolygons([]);
  };

  return (
    <BaseTab title="面编辑器">
      <Card title="地图工具" size="small">
        <div className="toolbar">
          <Space>
            <Switch 
              checked={isEditing}
              onChange={toggleEditing}
              checkedChildren="编辑中"
              unCheckedChildren="查看"
            />
            <Button onClick={clearPolygons} danger>
              清除所有面
            </Button>
          </Space>
        </div>

        {isEditing && (
          <Alert
            message="编辑模式已开启"
            description="单击地图添加点（至少3个点），双击完成多边形绘制"
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

export default PolygonEditorTab;
