import React from 'react';
import { Card, Form, Input, Button, Space, Divider } from 'antd';
import TiandituMap from './TiandituMap';
import '../styles/tab-layout.less';

export interface BaseTabProps {
  title: string;
  onMapReady?: (map: L.Map) => void;
}

const BaseTab: React.FC<BaseTabProps> = ({ title, onMapReady }) => {
  return (
    <div className="tab-container">
      <div className="tab-content">
        {/* 左侧面板 */}
        <div className="left-panel">
          <Card title={`${title}配置`} size="small">
            <Form className="config-form" layout="vertical">
              <Form.Item label="要素名称">
                <Input placeholder="请输入要素名称" />
              </Form.Item>
              
              <Form.Item label="样式配置">
                <Input.TextArea 
                  placeholder="请输入样式JSON配置"
                  className="json-editor"
                  rows={8}
                />
              </Form.Item>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block>
                  应用配置
                </Button>
                <Button block>
                  重置配置
                </Button>
              </Space>
            </Form>
          </Card>
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
