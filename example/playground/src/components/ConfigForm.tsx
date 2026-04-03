import React, { useState } from 'react';
import { Form, InputNumber, Switch, Select, Input, Button, Space, Collapse, Card } from 'antd';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';

const { Panel } = Collapse;
const { TextArea } = Input;

interface ConfigFormProps {
  title: string;
  onConfigChange?: (config: LeafletEditorOptions) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ title, onConfigChange }) => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState<LeafletEditorOptions>({});

  const handleValuesChange = (changedValues: any, allValues: LeafletEditorOptions) => {
    setConfig(allValues);
    onConfigChange?.(allValues);
  };

  const generateConfigJson = () => {
    return JSON.stringify(config, null, 2);
  };

  const applyConfigFromJson = (jsonString: string) => {
    try {
      const parsedConfig = JSON.parse(jsonString);
      setConfig(parsedConfig);
      form.setFieldsValue(parsedConfig);
      onConfigChange?.(parsedConfig);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Card title={`${title}配置`} size="small" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={config}
          onValuesChange={handleValuesChange}
          size="small"
        >
          {/* 基础配置 */}
          <Collapse size="small" ghost>
            <Panel header="基础配置" key="basic">
              <Form.Item label="坐标精度" name="coordPrecision">
                <InputNumber
                  min={0}
                  max={10}
                  placeholder="默认值: 6"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item label="默认几何" name="defaultGeometry">
                <TextArea
                  rows={3}
                  placeholder="GeoJSON格式的默认几何信息"
                />
              </Form.Item>
            </Panel>
          </Collapse>

          {/* 吸附配置 */}
          <Collapse size="small" ghost>
            <Panel header="吸附配置" key="snap">
              <Form.Item label="启用吸附" name={['snap', 'enabled']} valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="吸附模式" name={['snap', 'modes']}>
                <Select
                  mode="multiple"
                  placeholder="选择吸附模式"
                  style={{ width: '100%' }}
                  options={[
                    { label: '顶点吸附', value: 'vertex' },
                    { label: '边吸附', value: 'edge' }
                  ]}
                />
              </Form.Item>

              <Form.Item label="吸附阈值" name={['snap', 'tolerance']}>
                <InputNumber
                  min={0}
                  placeholder="像素值，默认值: 10"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item label="启用吸附高亮" name={['snap', 'highlight', 'enabled']} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Panel>
          </Collapse>

          {/* 编辑配置 */}
          <Collapse size="small" ghost>
            <Panel header="编辑配置" key="edit">
              <Form.Item label="启用编辑" name={['edit', 'enabled']} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Panel>
          </Collapse>

          {/* 校验配置 */}
          <Collapse size="small" ghost>
            <Panel header="校验配置" key="validation">
              <Form.Item label="允许自相交" name={['validation', 'allowSelfIntersect']} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Panel>
          </Collapse>

          {/* 样式配置 */}
          <Collapse size="small" ghost>
            <Panel header="样式配置" key="style">
              <Form.Item label="默认样式" name="defaultStyle">
                <TextArea
                  rows={6}
                  placeholder="Leaflet样式配置JSON"
                />
              </Form.Item>
            </Panel>
          </Collapse>
        </Form>
      </Card>

      {/* JSON配置显示 */}
      <Card title="配置JSON" size="small">
        <TextArea
          value={generateConfigJson()}
          onChange={(e) => applyConfigFromJson(e.target.value)}
          rows={12}
          placeholder="配置JSON将在这里显示，也可以直接编辑JSON"
          style={{ 
            fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
            fontSize: '12px'
          }}
        />
        
        <Space style={{ marginTop: 12, width: '100%' }}>
          <Button type="primary" onClick={() => onConfigChange?.(config)}>
            应用配置
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置表单
          </Button>
          <Button onClick={() => {
            const emptyConfig = {};
            setConfig(emptyConfig);
            form.setFieldsValue(emptyConfig);
            onConfigChange?.(emptyConfig);
          }}>
            清空配置
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ConfigForm;
