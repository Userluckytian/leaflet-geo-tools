import React from 'react';
import BaseTab from '../BaseTab';

const PolygonEditorTab: React.FC = () => {
  const handleMapReady = (map: L.Map) => {
    // 面编辑器逻辑将在后续实现
    console.log('PolygonEditor map ready');
  };

  return <BaseTab title="面编辑器" onMapReady={handleMapReady} />;
};

export default PolygonEditorTab;
