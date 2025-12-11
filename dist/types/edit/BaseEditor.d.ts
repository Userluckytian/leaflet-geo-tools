import { PolygonEditorState } from "../types";
export declare abstract class BaseEditor {
    private static currentActiveEditor;
    protected map: L.Map;
    protected currentState: PolygonEditorState;
    protected stateListeners: ((state: PolygonEditorState) => void)[];
    protected isDraggingPolygon: boolean;
    protected dragStartLatLng: L.LatLng | null;
    protected isVisible: boolean;
    constructor(map: L.Map);
    /**
     * 激活当前编辑器实例
     */
    protected activate(): void;
    /**
         * 停用当前编辑器实例
         */
    protected deactivate(): void;
    /**
     * 检查当前实例是否激活
     */
    protected isActive(): boolean;
    /**
     * 静态方法：停用所有编辑器（压根不用，我都不想写！）
     */
    static deactivateAllEditors(): void;
    /**
     * 强制停用编辑状态（但不改变激活状态）
     */
    protected forceExitEditMode(): void;
    /** 状态改变时，触发存储的所有监听事件的回调
     *
     *
     * @private
     * @memberof BaseEditor
     */
    protected updateAndNotifyStateChange(status: PolygonEditorState): void;
    /** 设置当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof BaseEditor
     */
    setCurrentState(status: PolygonEditorState): void;
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    onStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 移除监听器的方法
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    offStateChange(listener: (state: PolygonEditorState) => void): void;
    /** 清空所有状态监听器
     *
     */
    clearAllStateListeners(): void;
    /** 退出编辑模式
     *
     *
     * @abstract
     * @memberof BaseEditor
     */
    abstract exitEditMode(): void;
}
