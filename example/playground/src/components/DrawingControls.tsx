import React from 'react';
import { Button, Space, Card } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClearOutlined } from '@ant-design/icons';
import { useEditor } from '../contexts/EditorContext';

interface DrawingControlsProps {
  // 不再需要任何props，全部从context获取
}

const DrawingControls: React.FC<DrawingControlsProps> = () => {
  const { state, startDrawing, stopDrawing, clearGeometry } = useEditor();
  return (
    <Card 
      title="绘制控制" 
      size="small" 
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={startDrawing}
            disabled={state.isDrawing || state.isEditing}
          >
            开始绘制
          </Button>
          <Button
            icon={<PauseCircleOutlined />}
            onClick={stopDrawing}
            disabled={!state.isDrawing && !state.isEditing}
          >
            停止绘制
          </Button>
        </Space>
        <Button
          icon={<ClearOutlined />}
          onClick={clearGeometry}
          disabled={!state.hasEditor}
          danger
        >
          清除几何
        </Button>
      </Space>
    </Card>
  );
};

export default DrawingControls;
