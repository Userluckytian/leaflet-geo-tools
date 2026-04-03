import React from 'react';
import { Button, Space, Card } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ClearOutlined } from '@ant-design/icons';

interface DrawingControlsProps {
  onStartDrawing?: () => void;
  onStopDrawing?: () => void;
  onClearGeometry?: () => void;
  isDrawing?: boolean;
  hasGeometry?: boolean;
  hasEditor?: boolean; // 新增：是否有编辑器实例
}

const DrawingControls: React.FC<DrawingControlsProps> = ({
  onStartDrawing,
  onStopDrawing,
  onClearGeometry,
  isDrawing = false,
  hasGeometry = false,
  hasEditor = false
}) => {
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
            onClick={onStartDrawing}
            disabled={isDrawing}
          >
            开始绘制
          </Button>
          <Button
            icon={<PauseCircleOutlined />}
            onClick={onStopDrawing}
            disabled={!isDrawing}
          >
            停止绘制
          </Button>
        </Space>
        <Button
          icon={<ClearOutlined />}
          onClick={onClearGeometry}
          disabled={!hasEditor} // 只要有编辑器实例就启用
          danger
        >
          清除几何
        </Button>
      </Space>
    </Card>
  );
};

export default DrawingControls;
