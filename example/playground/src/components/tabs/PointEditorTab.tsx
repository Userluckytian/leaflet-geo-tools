import React from 'react';
import BaseTab from '../BaseTab';

const PointEditorTab: React.FC = () => {
  const handleMapReady = (map: L.Map) => {
    // 点编辑器逻辑将在后续实现
    console.log('PointEditor map ready');
  };

  return <BaseTab title="点编辑器" onMapReady={handleMapReady} />;
};

export default PointEditorTab;
