import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layout, Card, Button, Space, message } from 'antd';

const { Content } = Layout;

// 修复Leaflet默认图标问题
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 天地图配置
const tiandituConfig = {
  normal: {
    vec: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=your_token',
    cva: 'https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=your_token',
  },
  satellite: {
    img: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=your_token',
    cia: 'https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=your_token',
  }
};

// 使用公开的天地图token（实际项目中应该申请自己的token）
const TIANDITU_TOKEN = 'e6372a5333c4bac9b9ef6097453c3cd6';

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapType, setMapType] = useState<'normal' | 'satellite'>('normal');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // 初始化地图
    const map = L.map(mapRef.current, {
      center: [39.9042, 116.4074], // 北京天安门
      zoom: 12,
      zoomControl: true,
      attributionControl: true,
    });

    // 添加天地图图层
    const vecLayer = L.tileLayer(
      tiandituConfig.normal.vec.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
      }
    );

    const cvaLayer = L.tileLayer(
      tiandituConfig.normal.cva.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
      }
    );

    vecLayer.addTo(map);
    cvaLayer.addTo(map);

    // 添加一些示例标记
    const marker1 = L.marker([39.9042, 116.4074])
      .addTo(map)
      .bindPopup('天安门广场');

    const marker2 = L.marker([39.9163, 116.3972])
      .addTo(map)
      .bindPopup('故宫博物院');

    // 添加一个示例多边形
    const polygon = L.polygon([
      [39.9100, 116.4000],
      [39.9100, 116.4100],
      [39.9000, 116.4100],
      [39.9000, 116.4000]
    ], {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.3
    }).addTo(map)
      .bindPopup('示例区域');

    mapInstanceRef.current = map;

    // 清理函数
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const switchMapType = (type: 'normal' | 'satellite') => {
    if (!mapInstanceRef.current) return;

    setLoading(true);
    setMapType(type);

    // 清除现有图层
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    // 添加新图层
    if (type === 'normal') {
      const vecLayer = L.tileLayer(
        tiandituConfig.normal.vec.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maxZoom: 18,
          attribution: '© 天地图'
        }
      );

      const cvaLayer = L.tileLayer(
        tiandituConfig.normal.cva.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maxZoom: 18,
          attribution: '© 天地图'
        }
      );

      vecLayer.addTo(mapInstanceRef.current);
      cvaLayer.addTo(mapInstanceRef.current);
    } else {
      const imgLayer = L.tileLayer(
        tiandituConfig.satellite.img.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maxZoom: 18,
          attribution: '© 天地图'
        }
      );

      const ciaLayer = L.tileLayer(
        tiandituConfig.satellite.cia.replace('your_token', TIANDITU_TOKEN).replace('{s}', '0'),
        {
          subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
          maxZoom: 18,
          attribution: '© 天地图'
        }
      );

      imgLayer.addTo(mapInstanceRef.current);
      ciaLayer.addTo(mapInstanceRef.current);
    }

    setTimeout(() => setLoading(false), 500);
    message.success(`已切换到${type === 'normal' ? '电子地图' : '卫星地图'}`);
  };

  const addRandomMarker = () => {
    if (!mapInstanceRef.current) return;

    const lat = 39.9042 + (Math.random() - 0.5) * 0.1;
    const lng = 116.4074 + (Math.random() - 0.5) * 0.1;

    L.marker([lat, lng])
      .addTo(mapInstanceRef.current)
      .bindPopup(`随机标记点<br>坐标: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .openPopup();

    message.success('已添加随机标记点');
  };

  const clearAllMarkers = () => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polygon || layer instanceof L.Polyline) {
        mapInstanceRef.current?.removeLayer(layer);
      }
    });

    message.success('已清除所有标记');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ padding: '24px' }}>
        <Card title="天地图示例" style={{ height: '100%' }}>
          <Space style={{ marginBottom: 16 }}>
            <Button 
              type={mapType === 'normal' ? 'primary' : 'default'}
              onClick={() => switchMapType('normal')}
              loading={loading}
            >
              电子地图
            </Button>
            <Button 
              type={mapType === 'satellite' ? 'primary' : 'default'}
              onClick={() => switchMapType('satellite')}
              loading={loading}
            >
              卫星地图
            </Button>
            <Button onClick={addRandomMarker}>
              添加随机标记
            </Button>
            <Button onClick={clearAllMarkers} danger>
              清除所有标记
            </Button>
          </Space>
          
          <div 
            ref={mapRef} 
            style={{ 
              height: 'calc(100% - 60px)', 
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden'
            }} 
          />
        </Card>
      </Content>
    </Layout>
  );
};

export default MapContainer;
