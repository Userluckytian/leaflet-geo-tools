import React from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import L from 'leaflet';
import { MarkerPointEditor } from 'leaflet-geo-tools';

const PointEditorTab: React.FC = () => {
  const editorRef = React.useRef<any>(null);
  const mapRef = React.useRef<L.Map | null>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('Point Editor Map Ready:', map);
    mapRef.current = map;
    // 不立即创建编辑器，等待用户点击开始绘制
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Point Editor Config Change:', config);
    // 配置更新逻辑可以在这里实现
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Point Editor Geometry Load:', geometry);
    // 几何加载逻辑可以在这里实现
  };

  // 构建默认点几何
  const getDefaultGeometry = (): GeoJSON.Point => {
    return {
      type: 'Point',
      coordinates: [116.4074, 39.9143] // 点坐标 [经度, 纬度]
    };
  };

  // 开始绘制
  const handleStartDrawing = () => {
    if (!mapRef.current || editorRef.current) return;
    
    console.log('开始绘制点');
    const editor = new MarkerPointEditor(mapRef.current, {
      validation: {
        allowSelfIntersect: false
      },
      edit: {
        enabled: true
      },
      defaultStyle: {
        color: '#3388ff',
        weight: 3,
        opacity: 0.8,
        fillOpacity: 0.2
      }
    });
    
    // 添加状态监听
    editor.onStateChange((status) => {
      console.log('Point Editor State Changed:', status);
      
      if (status === 'drawing') {
        console.log('Drawing状态: 停止绘制按钮应该是亮的');
      } else if (status === 'editing') {
        console.log('Editing状态: 停止绘制按钮应该是亮的');
      } else if (status === 'idle' || status === 'Idle') {
        console.log('Idle状态: 判断是否存在实例，且获取实例的图层，如果存在，则清除几何的按钮应该是亮的');
      }
    });
    
    editorRef.current = editor;
  };

  // 停止绘制
  const handleStopDrawing = () => {
    if (editorRef.current) {
      console.log('停止绘制点');
      (editorRef.current as any).commitEdit();
    }
  };

  // 清除几何
  const handleClearGeometry = () => {
    if (editorRef.current) {
      console.log('清除点几何');
      editorRef.current.destroy();
      editorRef.current = null;
    }
  };

  return (
    <BaseTab 
      title="点编辑器" 
      onMapReady={handleMapReady}
      onConfigChange={handleConfigChange}
      onGeometryLoad={handleGeometryLoad}
      editorInstance={editorRef}
      onStartDrawing={handleStartDrawing}
      onStopDrawing={handleStopDrawing}
      onClearGeometry={handleClearGeometry}
    />
  );
};

export default PointEditorTab;
