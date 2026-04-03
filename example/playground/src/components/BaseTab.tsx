import React from 'react';
import { Row, Col } from 'antd';
import TiandituMap from './TiandituMap';
import ConfigForm from './ConfigForm';
import DrawingControls from './DrawingControls';
import { useEditor } from '../contexts/EditorContext';
import '../styles/tab-layout.less';

export interface BaseTabProps {
  title: string;
  onConfigChange?: (config: any) => void;
  onGeometryLoad?: (geometry: any) => void;
  children?: React.ReactNode;
  // 新增：左侧面板插槽，可以插入自定义控件
  leftPanelSlot?: React.ReactNode;
}

const BaseTab: React.FC<BaseTabProps> = ({ title, onConfigChange, onGeometryLoad, leftPanelSlot }) => {
  const { 
    state, 
    editorRef, 
    dispatch, 
    updateConfig, 
    initializeMap 
  } = useEditor();

  // 监听编辑器状态变化
  React.useEffect(() => {
    const editor = editorRef?.current;
    if (editor) {
      // 使用编辑器的状态监听API
      const handleStateChange = (status: string) => {
        console.log('Editor State Changed:', status);
        
        // 根据状态更新按钮状态
        dispatch({ type: 'SET_STATUS', payload: status });
        dispatch({ type: 'SET_DRAWING', payload: status === 'drawing' || status === 'Drawing' });
        dispatch({ type: 'SET_EDITING', payload: status === 'editing' || status === 'Editing' });
        dispatch({ type: 'SET_HAS_GEOMETRY', payload: !!editor.layer });
        dispatch({ type: 'SET_HAS_EDITOR', payload: true });
      };

      // 绑定状态监听器
      editor.onStateChange?.(handleStateChange);
      
      // 立即获取当前状态
      if (editor.currentState) {
        handleStateChange(editor.currentState);
      }
    } else {
      // 编辑器不存在时重置按钮状态
      dispatch({ type: 'RESET' });
    }
  }, [editorRef, dispatch]);

  const handleMapReady = (map: L.Map) => {
    initializeMap(map);
  };

  const handleConfigChange = (newConfig: any) => {
    updateConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleGeometryLoad = (geometry: any) => {
    console.log('Geometry loaded:', geometry);
    onGeometryLoad?.(geometry);
  };

  return (
    <div className="tab-container">
      <div className="tab-content">
        {/* 左侧面板 */}
        <div className="left-panel">
          {/* 插槽：如果有自定义控件则显示，否则显示默认的DrawingControls */}
          {leftPanelSlot || (
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <DrawingControls />
              </Col>
            </Row>
          )}
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <ConfigForm 
                title={title} 
                onConfigChange={handleConfigChange} 
                onGeometryLoad={handleGeometryLoad}
              />
            </Col>
          </Row>
        </div>

        {/* 右侧面板 */}
        <div className="right-panel">
          <div className="map-wrapper">
            <TiandituMap onMapReady={handleMapReady} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseTab;
