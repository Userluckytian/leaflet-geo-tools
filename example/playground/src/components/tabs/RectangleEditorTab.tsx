import React from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import L from 'leaflet';
import { RectangleEditor } from 'leaflet-geo-tools';

const RectangleEditorTab: React.FC = () => {
  const editorRef = React.useRef<RectangleEditor | null>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('Rectangle Editor Map Ready:', map);
    
    // 创建矩形编辑器实例
    const editor = new RectangleEditor(map, {
      defaultGeometry: getDefaultGeometry(),
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
    
    editorRef.current = editor;
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Rectangle Editor Config Change:', config);
    // 配置更新逻辑可以在这里实现
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Rectangle Editor Geometry Load:', geometry);
    // 几何加载逻辑可以在这里实现
  };

  // 构建默认矩形几何
  const getDefaultGeometry = (): GeoJSON.Polygon => {
    return {
      type: 'Polygon',
      coordinates: [[
        [116.3974, 39.9093],  // 左下角
        [116.4074, 39.9093],  // 右下角  
        [116.4074, 39.9193],  // 右上角
        [116.3974, 39.9193],  // 左上角
        [116.3974, 39.9093]   // 闭合点
      ]]
    };
  };

  return (
    <BaseTab 
      title="矩形编辑器" 
      onMapReady={handleMapReady}
      onConfigChange={handleConfigChange}
      onGeometryLoad={handleGeometryLoad}
    />
  );
};

export default RectangleEditorTab;
