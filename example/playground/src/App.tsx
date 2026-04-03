import { ConfigProvider, Tabs } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';
import PointEditorTab from './components/tabs/PointEditorTab';
import PolylineEditorTab from './components/tabs/PolylineEditorTab';
import PolygonEditorTab from './components/tabs/PolygonEditorTab';

function App() {
  const tabItems = [
    {
      key: '1',
      label: '点编辑器',
      children: <PointEditorTab />,
    },
    {
      key: '2', 
      label: '线编辑器',
      children: <PolylineEditorTab />,
    },
    {
      key: '3',
      label: '面编辑器', 
      children: <PolygonEditorTab />,
    },
    {
      key: '4',
      label: '矩形编辑器',
      children: '矩形编辑器内容开发中...',
    },
    {
      key: '5',
      label: '圆编辑器',
      children: '圆编辑器内容开发中...',
    },
    {
      key: '6',
      label: '拓扑操作',
      children: '拓扑操作内容开发中...',
    },
    {
      key: '7',
      label: '整形操作',
      children: '整形操作内容开发中...',
    }
  ];

  return (
    <ConfigProvider locale={zhCN}>
      <div style={{ padding: '20px', height: '100vh' }}>
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems}
          size="large"
          style={{ height: '100%' }}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
