import React from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import L from 'leaflet';
import { PolygonEditor } from 'leaflet-geo-tools';

const PolygonEditorTab: React.FC = () => {
  const editorRef = React.useRef<any>(null);
  const mapRef = React.useRef<L.Map | null>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('Polygon Editor Map Ready:', map);
    mapRef.current = map;
    // 不立即创建编辑器，等待用户点击开始绘制
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Polygon Editor Config Change:', config);
    // 配置更新逻辑可以在这里实现
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Polygon Editor Geometry Load:', geometry);
    // 几何加载逻辑可以在这里实现
  };

  // 构建默认面几何
  const getDefaultGeometry = (): GeoJSON.Polygon => {
    return {
      type: 'Polygon',
      coordinates: [[
        [116.3974, 39.9093],  // 左下角
        [116.4074, 39.9093],  // 右下角  
        [116.4174, 39.9193],  // 右上角
        [116.4074, 39.9293],  // 上中点
        [116.3974, 39.9193],  // 左上角
        [116.3974, 39.9093]   // 闭合点
      ]]
    };
  };

  // 开始绘制
  const handleStartDrawing = () => {
    if (!mapRef.current || editorRef.current) return;
    
    console.log('开始绘制面');
    const editor = new PolygonEditor(mapRef.current, {
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
      console.log('Polygon Editor State Changed:', status);
      
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
      console.log('停止绘制面');
      (editorRef.current as any).commitEdit();
    }
  };

  // 清除几何
  const handleClearGeometry = () => {
    if (editorRef.current) {
      console.log('清除面几何');
      editorRef.current.destroy();
      editorRef.current = null;
    }
  };

  return (
    <BaseTab 
      title="面编辑器" 
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

export default PolygonEditorTab;
