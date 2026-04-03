import React from 'react';
import { Card, Row, Col } from 'antd';
import TiandituMap from './TiandituMap';
import ConfigForm from './ConfigForm';
import DrawingControls from './DrawingControls';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import '../styles/tab-layout.less';

export interface BaseTabProps {
  title: string;
  onMapReady?: (map: L.Map) => void;
  onConfigChange?: (config: LeafletEditorOptions) => void;
  onGeometryLoad?: (geometry: any) => void;
  editorInstance?: React.MutableRefObject<any>;
  onStartDrawing?: () => void;
  onStopDrawing?: () => void;
  onClearGeometry?: () => void;
}

const BaseTab: React.FC<BaseTabProps> = ({ 
  title, 
  onMapReady, 
  onConfigChange, 
  onGeometryLoad,
  editorInstance,
  onStartDrawing,
  onStopDrawing,
  onClearGeometry
}) => {
  // 添加本地状态来管理按钮状态
  const [buttonStates, setButtonStates] = React.useState({
    isDrawing: false,
    isEditing: false,
    hasGeometry: false,
    hasEditor: false
  });

  // 监听编辑器状态变化
  React.useEffect(() => {
    const editor = editorInstance?.current;
    if (editor) {
      // 使用编辑器的状态监听API
      const handleStateChange = (status: string) => {
        console.log('Editor State Changed:', status);
        
        // 根据状态更新按钮状态
        setButtonStates({
          isDrawing: status === 'drawing' || status === 'Drawing',
          isEditing: status === 'editing' || status === 'Editing',
          hasGeometry: !!editor.layer,
          hasEditor: true
        });
      };

      // 绑定状态监听器
      editor.onStateChange(handleStateChange);
      
      // 立即获取当前状态
      if (editor.currentState) {
        handleStateChange(editor.currentState);
      }
    } else {
      // 编辑器不存在时重置按钮状态
      setButtonStates({
        isDrawing: false,
        isEditing: false,
        hasGeometry: false,
        hasEditor: false
      });
    }
  }, [editorInstance]);

  return (
    <div className="tab-container">
      <div className="tab-content">
        {/* 左侧面板 */}
        <div className="left-panel">
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <DrawingControls
                onStartDrawing={onStartDrawing}
                onStopDrawing={onStopDrawing}
                onClearGeometry={onClearGeometry}
                isDrawing={buttonStates.isDrawing || buttonStates.isEditing}
                hasEditor={buttonStates.hasEditor}
              />
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <ConfigForm 
                title={title} 
                onConfigChange={onConfigChange} 
                onGeometryLoad={onGeometryLoad}
              />
            </Col>
          </Row>
        </div>

        {/* 右侧面板 */}
        <div className="right-panel">
          <div className="map-wrapper">
            <TiandituMap onMapReady={onMapReady} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTab;
