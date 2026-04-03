import React from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import L from 'leaflet';
import { CircleEditor } from 'leaflet-geo-tools';

const CircleEditorTab: React.FC = () => {
  const editorRef = React.useRef<CircleEditor | null>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('Circle Editor Map Ready:', map);
    
    // 创建圆形编辑器实例
    const editor = new CircleEditor(map, {
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
        fillOpacity: 0.2,
        radius: 500 // 默认半径500米
      }
    });
    
    editorRef.current = editor;
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Circle Editor Config Change:', config);
    // 配置更新逻辑可以在这里实现
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Circle Editor Geometry Load:', geometry);
    // 几何加载逻辑可以在这里实现
  };

  // 构建默认圆形几何（圆心点）
  const getDefaultGeometry = (): GeoJSON.Point => {
    return {
      type: 'Point',
      coordinates: [116.4024, 39.9143] // 圆心坐标 [经度, 纬度]
    };
  };

  return (
    <BaseTab 
      title="圆形编辑器" 
      onMapReady={handleMapReady}
      onConfigChange={handleConfigChange}
      onGeometryLoad={handleGeometryLoad}
    />
  );
};

export default CircleEditorTab;
