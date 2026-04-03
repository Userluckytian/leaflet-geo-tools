import React from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import L from 'leaflet';

const PointEditorTab: React.FC = () => {
  const editorRef = React.useRef<any>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('Point Editor Map Ready:', map);
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Point Editor Config Change:', config);
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Point Editor Geometry Load:', geometry);
    // 这里可以根据需要实例化编辑器
    // new PointEditor(map, { defaultGeometry: geometry, ...config });
  };

  return (
    <BaseTab 
      title="点编辑器" 
      onMapReady={handleMapReady}
      onConfigChange={handleConfigChange}
      onGeometryLoad={handleGeometryLoad}
    />
  );
};

export default PointEditorTab;
