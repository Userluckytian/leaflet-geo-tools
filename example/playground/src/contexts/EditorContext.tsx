import React, { createContext, useContext, useReducer, useRef } from 'react';
import type { ReactNode } from 'react';
import L from 'leaflet';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';

// 编辑器状态接口
interface EditorState {
  isDrawing: boolean;
  isEditing: boolean;
  hasGeometry: boolean;
  hasEditor: boolean;
  currentStatus: string;
}

// 编辑器动作类型
type EditorAction = 
  | { type: 'SET_DRAWING'; payload: boolean }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'SET_HAS_GEOMETRY'; payload: boolean }
  | { type: 'SET_HAS_EDITOR'; payload: boolean }
  | { type: 'SET_STATUS'; payload: string }
  | { type: 'RESET' };

// 编辑器上下文接口
interface EditorContextValue {
  state: EditorState;
  mapRef: React.MutableRefObject<L.Map | null>;
  editorRef: React.MutableRefObject<any>;
  config: LeafletEditorOptions;
  dispatch: React.Dispatch<EditorAction>;
  updateConfig: (newConfig: LeafletEditorOptions) => void;
  initializeMap: (map: L.Map) => void;
  // 编辑器操作函数
  startDrawing: () => void;
  stopDrawing: () => void;
  clearGeometry: () => void;
  // 设置编辑器创建函数
  setEditorFactory: (factory: (map: L.Map, config: LeafletEditorOptions) => any) => void;
}

// 初始状态
const initialState: EditorState = {
  isDrawing: false,
  isEditing: false,
  hasGeometry: false,
  hasEditor: false,
  currentStatus: 'idle'
};

// 状态reducer
const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_DRAWING':
      return { ...state, isDrawing: action.payload };
    case 'SET_EDITING':
      return { ...state, isEditing: action.payload };
    case 'SET_HAS_GEOMETRY':
      return { ...state, hasGeometry: action.payload };
    case 'SET_HAS_EDITOR':
      return { ...state, hasEditor: action.payload };
    case 'SET_STATUS':
      return { ...state, currentStatus: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

// 创建上下文
const EditorContext = createContext<EditorContextValue | undefined>(undefined);

// Provider组件
interface EditorProviderProps {
  children: ReactNode;
  initialConfig?: LeafletEditorOptions;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ 
  children, 
  initialConfig = {} 
}) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const [config, setConfig] = React.useState<LeafletEditorOptions>(initialConfig);
  const mapRef = useRef<L.Map | null>(null);
  const editorRef = useRef<any>(null);
  const editorFactoryRef = useRef<((map: L.Map, config: LeafletEditorOptions) => any) | null>(null);

  const updateConfig = (newConfig: LeafletEditorOptions) => {
    setConfig(newConfig);
  };

  const initializeMap = (map: L.Map) => {
    mapRef.current = map;
  };

  const setEditorFactory = (factory: (map: L.Map, config: LeafletEditorOptions) => any) => {
    editorFactoryRef.current = factory;
  };

  const startDrawing = () => {
    if (!mapRef.current || editorRef.current || !editorFactoryRef.current) return;
    
    console.log('Starting drawing with config:', config);
    const editor = editorFactoryRef.current(mapRef.current, config);
    
    if (editor) {
      // 添加状态监听
      editor.onStateChange?.((status: string) => {
        console.log('Editor State Changed:', status);
        dispatch({ type: 'SET_STATUS', payload: status });
        dispatch({ type: 'SET_DRAWING', payload: status === 'drawing' || status === 'Drawing' });
        dispatch({ type: 'SET_EDITING', payload: status === 'editing' || status === 'Editing' });
        dispatch({ type: 'SET_HAS_GEOMETRY', payload: !!editor.layer });
        dispatch({ type: 'SET_HAS_EDITOR', payload: true });
      });
      
      editorRef.current = editor;
    }
  };

  const stopDrawing = () => {
    if (editorRef.current) {
      editorRef.current.commitEdit?.();
    }
  };

  const clearGeometry = () => {
    if (editorRef.current) {
      editorRef.current.destroy?.();
      editorRef.current = null;
      dispatch({ type: 'RESET' });
    }
  };

  const value: EditorContextValue = {
    state,
    mapRef,
    editorRef,
    config,
    dispatch,
    updateConfig,
    initializeMap,
    startDrawing,
    stopDrawing,
    clearGeometry,
    setEditorFactory
  };

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
};

// Hook for using context
export const useEditor = (): EditorContextValue => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export default EditorContext;
