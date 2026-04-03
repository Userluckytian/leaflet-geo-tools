import React, { useRef } from 'react';
import BaseTab from '../BaseTab';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';

const PointEditorTab: React.FC = () => {
  const editorRef = useRef<any>(null);

  const handleMapReady = (map: L.Map) => {
    console.log('PointEditor map ready');
    // 这里可以初始化点编辑器
    // editorRef.current = new MarkerPointEditor(map, config);
  };

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('PointEditor config changed:', config);
    // 这里可以更新编辑器配置
    // if (editorRef.current) {
    //   editorRef.current.updateOptions(config);
    // }
  };

  return (
    <BaseTab 
      title="点编辑器" 
      onMapReady={handleMapReady}
      onConfigChange={handleConfigChange}
    />
  );
};

export default PointEditorTab;
