import React from 'react';
import BaseTab from '../BaseTab';
import { useEditor } from '../../contexts/EditorContext';
import { RectangleEditor } from 'leaflet-geo-tools';
import DrawingControls from '../DrawingControls';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';

const RectangleEditorTab: React.FC = () => {
  const { setEditorFactory, updateConfig } = useEditor();

  // 设置编辑器工厂函数
  React.useEffect(() => {
    setEditorFactory((map, config) => {
      return new RectangleEditor(map, {
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
        },
        ...config // 合并用户配置
      });
    });
  }, [setEditorFactory]);

  const handleConfigChange = (config: LeafletEditorOptions) => {
    console.log('Rectangle Editor Config Change:', config);
    updateConfig(config);
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Rectangle Editor Geometry Load:', geometry);
    // 几何加载逻辑可以在这里实现
  };

  return (
    <BaseTab 
      title="矩形编辑器"
      onConfigChange={handleConfigChange}
      onGeometryLoad={handleGeometryLoad}
      leftPanelSlot={<DrawingControls />}
    />
  );
};

export default RectangleEditorTab;
