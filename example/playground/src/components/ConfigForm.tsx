import React, { useState } from 'react';
import { Form, InputNumber, Switch, Select, Input, Button, Space, Collapse, Card, ColorPicker } from 'antd';
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

              {/* 吸附高亮样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="高亮样式" key="snapHighlight">
                  <Form.Item label="点高亮颜色" name={['snap', 'highlight', 'pointStyle', 'fillColor']}>
                    <Input placeholder="颜色值，如: #ff7800" />
                  </Form.Item>

                  <Form.Item label="点高亮半径" name={['snap', 'highlight', 'pointStyle', 'radius']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item label="边高亮颜色" name={['snap', 'highlight', 'edgeStyle', 'color']}>
                    <Input placeholder="颜色值，如: #3388ff" />
                  </Form.Item>

                  <Form.Item label="边高亮宽度" name={['snap', 'highlight', 'edgeStyle', 'weight']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>

          {/* 编辑配置 */}
          <Collapse size="small" ghost>
            <Panel header="编辑配置" key="edit">
              <Form.Item label="启用编辑" name={['edit', 'enabled']} valuePropName="checked">
                <Switch />
              </Form.Item>

              {/* 顶点样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="顶点样式" key="vertexStyle">
                  <Form.Item label="顶点颜色" name={['edit', 'vertexsMarkerStyle', 'fillColor']}>
                    <Input placeholder="颜色值，如: #ff7800" />
                  </Form.Item>

                  <Form.Item label="顶点半径" name={['edit', 'vertexsMarkerStyle', 'radius']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Panel>
              </Collapse>

              {/* 拖动边标记配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="拖动边标记" key="dragLineMarker">
                  <Form.Item label="启用拖动边" name={['edit', 'dragLineMarkerOptions', 'enabled']} valuePropName="checked">
                    <Switch />
                  </Form.Item>

                  <Form.Item label="拖动边颜色" name={['edit', 'dragLineMarkerOptions', 'dragMarkerStyle', 'fillColor']}>
                    <Input placeholder="颜色值，如: #3388ff" />
                  </Form.Item>

                  <Form.Item label="拖动边位置比例" name={['edit', 'dragLineMarkerOptions', 'positionRatio']}>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.1}
                      placeholder="0-1之间，默认0.3"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Panel>
              </Collapse>

              {/* 拖动中点标记配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="拖动中点标记" key="dragMidMarker">
                  <Form.Item label="拖动中点颜色" name={['edit', 'dragMidMarkerOptions', 'dragMarkerStyle', 'fillColor']}>
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item label="拖动中点位置比例" name={['edit', 'dragMidMarkerOptions', 'positionRatio']}>
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.1}
                      placeholder="0-1之间，默认0.3"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Panel>
              </Collapse>

              {/* 圆形虚线配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="圆形虚线" key="circleDashLine">
                  <Form.Item label="启用虚线" name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'enabled']} valuePropName="checked">
                    <Switch />
                  </Form.Item>

                  <Form.Item label="虚线颜色" name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'color']}>
                    <Input placeholder="颜色值，如: #666666" />
                  </Form.Item>

                  <Form.Item label="虚线宽度" name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'weight']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item label="虚线样式" name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'dashArray']}>
                    <Input placeholder="如: '5, 10'" />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>

          {/* 校验配置 */}
          <Collapse size="small" ghost>
            <Panel header="校验配置" key="validation">
              <Form.Item label="允许自相交" name={['validation', 'allowSelfIntersect']} valuePropName="checked">
                <Switch />
              </Form.Item>

              {/* 校验失败样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="错误样式" key="errorStyle">
                  <Form.Item label="多边形错误颜色" name={['validation', 'validErrorPolygonStyle', 'color']}>
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item label="多边形错误宽度" name={['validation', 'validErrorPolygonStyle', 'weight']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item label="线错误颜色" name={['validation', 'validErrorLineStyle', 'color']}>
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item label="线错误宽度" name={['validation', 'validErrorLineStyle', 'weight']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item label="点错误颜色" name={['validation', 'validErrorPointStyle', 'fillColor']}>
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item label="点错误半径" name={['validation', 'validErrorPointStyle', 'radius']}>
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>

          {/* 样式配置 */}
          <Collapse size="small" ghost>
            <Panel header="默认样式" key="style">
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
