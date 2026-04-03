import React from 'react';
import { Card } from 'antd';
import TiandituMap from './TiandituMap';
import ConfigForm from './ConfigForm';
import type { LeafletEditorOptions } from 'leaflet-geo-tools';
import '../styles/tab-layout.less';

export interface BaseTabProps {
  title: string;
  onMapReady?: (map: L.Map) => void;
  onConfigChange?: (config: LeafletEditorOptions) => void;
  onGeometryLoad?: (geometry: any) => void;
}

const BaseTab: React.FC<BaseTabProps> = ({ title, onMapReady, onConfigChange, onGeometryLoad }) => {
  return (
    <div className="tab-container">
      <div className="tab-content">
        {/* 左侧面板 */}
        <div className="left-panel">
          <ConfigForm 
            title={title} 
            onConfigChange={onConfigChange} 
            onGeometryLoad={onGeometryLoad}
          />
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
