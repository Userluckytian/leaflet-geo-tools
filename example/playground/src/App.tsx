import { ConfigProvider, Tabs } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import 'antd/dist/antd.css';
import PointEditorTab from './components/tabs/PointEditorTab';
import PolylineEditorTab from './components/tabs/PolylineEditorTab';
import PolygonEditorTab from './components/tabs/PolygonEditorTab';
import RectangleEditorTab from './components/tabs/RectangleEditorTab';
import CircleEditorTab from './components/tabs/CircleEditorTab';
import { EditorProvider } from './contexts/EditorContext';

function App() {
  const tabItems = [
    {
      key: '1',
      label: '点编辑器',
      children: (
        <EditorProvider>
          <PointEditorTab />
        </EditorProvider>
      ),
    },
    {
      key: '2', 
      label: '线编辑器',
      children: (
        <EditorProvider>
          <PolylineEditorTab />
        </EditorProvider>
      ),
    },
    {
      key: '3',
      label: '面编辑器', 
      children: (
        <EditorProvider>
          <PolygonEditorTab />
        </EditorProvider>
      ),
    },
    {
      key: '4',
      label: '矩形编辑器',
      children: (
        <EditorProvider>
          <RectangleEditorTab />
        </EditorProvider>
      ),
    },
    {
      key: '5',
      label: '圆编辑器',
      children: (
        <EditorProvider>
          <CircleEditorTab />
        </EditorProvider>
      ),
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
      <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
        <Tabs 
          defaultActiveKey="1" 
          items={tabItems}
          size="large"
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </ConfigProvider>
  );
}

export default App;
