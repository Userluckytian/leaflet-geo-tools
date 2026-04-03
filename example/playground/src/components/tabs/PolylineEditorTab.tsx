import React from 'react';
import BaseTab from '../BaseTab';

const PolylineEditorTab: React.FC = () => {
  const handleMapReady = (map: L.Map) => {
    // 线编辑器逻辑将在后续实现
    console.log('PolylineEditor map ready');
  };

  return <BaseTab title="线编辑器" onMapReady={handleMapReady} />;
};

export default PolylineEditorTab;
