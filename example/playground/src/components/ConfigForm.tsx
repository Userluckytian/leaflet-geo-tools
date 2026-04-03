import React, { useState } from 'react';
import { Form, InputNumber, Switch, Select, Input, Button, Space, Collapse, Card, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';

const { Panel } = Collapse;
const { TextArea } = Input;

interface ConfigFormProps {
  title: string;
  onConfigChange?: (config: LeafletEditorOptions) => void;
  onGeometryLoad?: (geometry: any) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ title, onConfigChange, onGeometryLoad }) => {
  const [form] = Form.useForm();
  const [config, setConfig] = useState<LeafletEditorOptions>({});

  // 默认几何数据
  const defaultGeometries = {
    '点编辑器': {
      type: 'Point',
      coordinates: [116.4074, 39.9042] // 北京坐标
    },
    '线编辑器': {
      type: 'LineString',
      coordinates: [
        [116.4074, 39.9042],
        [116.4174, 39.9142],
        [116.4274, 39.9042]
      ]
    },
    '面编辑器': {
      type: 'Polygon',
      coordinates: [[
        [116.4074, 39.9042],
        [116.4174, 39.9142],
        [116.4274, 39.9042],
        [116.4074, 39.9042]
      ]]
    }
  };

  // 默认样式数据
  const defaultStyles = {
    '点编辑器': {
      color: '#ff7800',
      fillColor: '#ff7800',
      fillOpacity: 0.6,
      radius: 8
    },
    '线编辑器': {
      color: '#3388ff',
      weight: 4,
      opacity: 0.8
    },
    '面编辑器': {
      color: '#3388ff',
      fillColor: '#3388ff',
      fillOpacity: 0.3,
      weight: 2
    }
  };

  const handleValuesChange = (changedValues: any, allValues: LeafletEditorOptions) => {
    setConfig(allValues);
    onConfigChange?.(allValues);
  };

  const handleLoadGeometry = () => {
    const geometry = defaultGeometries[title as keyof typeof defaultGeometries];
    if (geometry && onGeometryLoad) {
      onGeometryLoad(geometry);
      // 同时设置到表单中
      form.setFieldValue('defaultGeometry', JSON.stringify(geometry, null, 2));
      // 更新config状态
      const newConfig = { ...config, defaultGeometry: JSON.stringify(geometry, null, 2) };
      setConfig(newConfig);
      onConfigChange?.(newConfig);
    }
  };

  const handleLoadStyle = () => {
    const style = defaultStyles[title as keyof typeof defaultStyles];
    if (style && onGeometryLoad) {
      onGeometryLoad({ defaultStyle: style });
      // 同时设置到表单中
      form.setFieldValue('defaultStyle', JSON.stringify(style, null, 2));
      // 更新config状态
      const newConfig = { ...config, defaultStyle: JSON.stringify(style, null, 2) };
      setConfig(newConfig);
      onConfigChange?.(newConfig);
    }
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
          initialValues={config}
          onValuesChange={handleValuesChange}
          size="small"
          className="config-form"
        >
          {/* 基础配置 */}
          <Collapse size="small" ghost>
            <Panel header="基础配置" key="basic">
              <Form.Item 
                label={
                  <span>
                    坐标精度
                    <Tooltip title="控制几何坐标的小数位数，影响编辑精度">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name="coordPrecision"
              >
                <InputNumber
                  min={0}
                  max={10}
                  placeholder="默认值: 6"
                />
              </Form.Item>

              <Form.Item 
                label={
                  <span>
                    默认几何
                    <Tooltip title="点击加载按钮可加载预设的几何数据">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name="defaultGeometry"
              >
                <Button 
                    type="primary" 
                    onClick={handleLoadGeometry}
                    size="small"
                    style={{ width: '100%' }}
                  >
                    加载默认几何
                  </Button>
              </Form.Item>
            </Panel>
          </Collapse>

          {/* 吸附配置 */}
          <Collapse size="small" ghost>
            <Panel header="吸附配置" key="snap">
              <Form.Item 
                label={
                  <span>
                    启用吸附
                    <Tooltip title="开启后编辑时可以自动吸附到附近的其他几何元素">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['snap', 'enabled']} 
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item 
                label={
                  <span>
                    吸附模式
                    <Tooltip title="选择吸附到顶点还是边">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['snap', 'modes']}
              >
                <Select
                  mode="multiple"
                  placeholder="选择吸附模式"
                  options={[
                    { label: '顶点吸附', value: 'vertex' },
                    { label: '边吸附', value: 'edge' }
                  ]}
                />
              </Form.Item>

              <Form.Item 
                label={
                  <span>
                    吸附阈值
                    <Tooltip title="吸附的最大距离，单位为像素">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['snap', 'tolerance']}
              >
                <InputNumber
                  min={0}
                  placeholder="像素值，默认值: 10"
                />
              </Form.Item>

              <Form.Item 
                label={
                  <span>
                    启用吸附高亮
                    <Tooltip title="开启后吸附时显示高亮效果">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['snap', 'highlight', 'enabled']} 
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              {/* 吸附高亮样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="高亮样式" key="snapHighlight">
                  <Form.Item 
                    label={
                      <span>
                        点高亮颜色
                        <Tooltip title="吸附到顶点时的高亮颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['snap', 'highlight', 'pointStyle', 'fillColor']}
                  >
                    <Input placeholder="颜色值，如: #ff7800" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        点高亮半径
                        <Tooltip title="吸附到顶点时的高亮圆半径">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['snap', 'highlight', 'pointStyle', 'radius']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                    />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        边高亮颜色
                        <Tooltip title="吸附到边时的高亮颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['snap', 'highlight', 'edgeStyle', 'color']}
                  >
                    <Input placeholder="颜色值，如: #3388ff" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        边高亮宽度
                        <Tooltip title="吸附到边时的高亮线条宽度">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['snap', 'highlight', 'edgeStyle', 'weight']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                    />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>

          {/* 编辑配置 */}
          <Collapse size="small" ghost>
            <Panel header="编辑配置" key="edit">
              <Form.Item 
                label={
                  <span>
                    启用编辑
                    <Tooltip title="开启后可以对几何进行编辑操作">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['edit', 'enabled']} 
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              {/* 顶点样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="顶点样式" key="vertexStyle">
                  <Form.Item 
                    label={
                      <span>
                        顶点颜色
                        <Tooltip title="编辑时顶点标记的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'vertexsMarkerStyle', 'fillColor']}
                  >
                    <Input placeholder="颜色值，如: #ff7800" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        顶点半径
                        <Tooltip title="编辑时顶点标记的半径">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'vertexsMarkerStyle', 'radius']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                    />
                  </Form.Item>
                </Panel>
              </Collapse>

              {/* 拖动边标记配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="拖动边标记" key="dragLineMarker">
                  <Form.Item 
                    label={
                      <span>
                        启用拖动边
                        <Tooltip title="开启后可以拖动线段的中点进行编辑">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'dragLineMarkerOptions', 'enabled']} 
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        拖动边颜色
                        <Tooltip title="拖动线段中点标记的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'dragLineMarkerOptions', 'dragMarkerStyle', 'fillColor']}
                  >
                    <Input placeholder="颜色值，如: #3388ff" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        拖动边位置比例
                        <Tooltip title="拖动标记在线段上的位置比例，0-1之间">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'dragLineMarkerOptions', 'positionRatio']}
                  >
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
                  <Form.Item 
                    label={
                      <span>
                        拖动中点颜色
                        <Tooltip title="拖动线段中点标记的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'dragMidMarkerOptions', 'dragMarkerStyle', 'fillColor']}
                  >
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        拖动中点位置比例
                        <Tooltip title="拖动标记在线段中点的位置比例，0-1之间">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'dragMidMarkerOptions', 'positionRatio']}
                  >
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
                  <Form.Item 
                    label={
                      <span>
                        启用虚线
                        <Tooltip title="开启后显示圆形虚线连接">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'enabled']} 
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        虚线颜色
                        <Tooltip title="圆形虚线的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'color']}
                  >
                    <Input placeholder="颜色值，如: #666666" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        虚线宽度
                        <Tooltip title="圆形虚线的线条宽度">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'weight']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        虚线样式
                        <Tooltip title="虚线的样式，如: '5, 10'">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['edit', 'circle_LinkRadiusAndCenterDashLineOptions', 'dashLineStyle', 'dashArray']}
                  >
                    <Input placeholder="如: '5, 10'" />
                  </Form.Item>
                </Panel>
              </Collapse>
            </Panel>
          </Collapse>

          {/* 校验配置 */}
          <Collapse size="small" ghost>
            <Panel header="校验配置" key="validation">
              <Form.Item 
                label={
                  <span>
                    允许自相交
                    <Tooltip title="允许几何图形自相交，如多边形的边可以交叉">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name={['validation', 'allowSelfIntersect']} 
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              {/* 校验失败样式配置 */}
              <Collapse size="small" ghost style={{ marginTop: 8 }}>
                <Panel header="错误样式" key="errorStyle">
                  <Form.Item 
                    label={
                      <span>
                        多边形错误颜色
                        <Tooltip title="多边形校验失败时的边框颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorPolygonStyle', 'color']}
                  >
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        多边形错误宽度
                        <Tooltip title="多边形校验失败时的边框宽度">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorPolygonStyle', 'weight']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        线错误颜色
                        <Tooltip title="线校验失败时的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorLineStyle', 'color']}
                  >
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        线错误宽度
                        <Tooltip title="线校验失败时的线条宽度">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorLineStyle', 'weight']}
                  >
                    <InputNumber
                      min={0}
                      placeholder="像素值"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        点错误颜色
                        <Tooltip title="点校验失败时的颜色">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorPointStyle', 'fillColor']}
                  >
                    <Input placeholder="颜色值，如: #ff0000" />
                  </Form.Item>

                  <Form.Item 
                    label={
                      <span>
                        点错误半径
                        <Tooltip title="点校验失败时的标记半径">
                          <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                        </Tooltip>
                      </span>
                    } 
                    name={['validation', 'validErrorPointStyle', 'radius']}
                  >
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
              <Form.Item 
                label={
                  <span>
                    默认样式
                    <Tooltip title="点击加载按钮可加载预设的样式配置">
                      <QuestionCircleOutlined style={{ marginLeft: 4, color: '#999' }} />
                    </Tooltip>
                  </span>
                } 
                name="defaultStyle"
              >
                <Button 
                    type="primary" 
                    onClick={handleLoadStyle}
                    size="small"
                    style={{ width: '100%' }}
                  >
                    加载默认样式
                  </Button>
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
