import { circle, point, booleanPointInPolygon, polygon, area, center, distance } from '@turf/turf';
import * as L from 'leaflet';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// #endregion 
var PolygonEditorState;
(function (PolygonEditorState) {
    PolygonEditorState["Idle"] = "idle";
    PolygonEditorState["Drawing"] = "drawing";
    PolygonEditorState["Editing"] = "editing"; // 正在编辑
})(PolygonEditorState || (PolygonEditorState = {}));
// #endregion

var km_value = 1000; // 1千米 = 1000米
var LeafletCircle = /** @class */ (function () {
    function LeafletCircle(map, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.circleLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
        };
        this.center = null;
        this.radius = 0;
        this.tempCoords = [];
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletCircle
         */
        this.mapClickEvent = function (e) {
            // this.tempCoords.push([e.latlng.lat, e.latlng.lng])
            if (_this.tempCoords.length === 0) {
                _this.tempCoords.push(e.latlng);
            }
            else {
                var finalCoords = [_this.tempCoords[0], e.latlng];
                _this.renderLayer(finalCoords);
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletCircle
         */
        this.mapMouseMoveEvent = function (e) {
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            if (!_this.tempCoords.length)
                return;
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            var lastMoveEndPoint = e.latlng;
            if (_this.tempCoords.length > 0) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletCircle.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[-90, -180]坐标，也就是页面的左下角
        var circleOptions = __assign(__assign({ pane: 'overlayPane', radius: 0 }, this.drawLayerStyle), options);
        this.circleLayer = L.circle([181, 181], circleOptions);
        this.circleLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.renderLayer = function (coords) {
        if (this.circleLayer) {
            this.center = coords[0];
            this.radius = this.center.distanceTo(coords[1]);
            this.circleLayer.setLatLng(this.center);
            this.circleLayer.setRadius(this.radius);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.geojson = function () {
        if (this.circleLayer && this.center) {
            // 发出消息(圆需要自己定制吐出的结构)
            var lnglat = [this.center.lng, this.center.lat];
            var options = { steps: 64, units: 'kilometers', properties: { type: 'circle' } };
            var geojson = circle(lnglat, this.radius / km_value, options); // 获取图形！
            return geojson;
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.destroy = function () {
        if (this.circleLayer) {
            this.circleLayer.remove();
            this.circleLayer = null;
        }
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletCircle.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletCircle.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletCircle
     */
    LeafletCircle.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletCircle;
}());

var MarkerPoint = /** @class */ (function () {
    function MarkerPoint(map, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.markerLayer = null;
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof markerPoint
         */
        this.mapClickEvent = function (e) {
            if (_this.markerLayer) {
                _this.markerLayer.setLatLng([e.latlng.lat, e.latlng.lng]);
                _this.reset();
            }
        };
        this.map = map;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            this.map.getContainer().style.cursor = 'crosshair';
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    MarkerPoint.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[-90, -180]坐标，也就是页面的左下角
        var markerOptions = __assign({ pane: 'markerPane', icon: MarkerPoint.markerIcon }, options);
        this.markerLayer = L.marker([181, 181], markerOptions);
        this.markerLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof markerPoint
     */
    MarkerPoint.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof MarkerPoint
     */
    MarkerPoint.prototype.reset = function () {
        // 设置完毕就关闭地图事件监听
        this.map.off('click', this.mapClickEvent);
        this.map.getContainer().style.cursor = 'grab';
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof markerPoint
     */
    MarkerPoint.prototype.geojson = function () {
        if (this.markerLayer) {
            return this.markerLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof markerPoint
     */
    MarkerPoint.prototype.destroy = function () {
        if (this.markerLayer) {
            this.markerLayer.remove();
            this.markerLayer = null;
        }
        this.reset();
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof MarkerPoint
     */
    MarkerPoint.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    MarkerPoint.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    MarkerPoint.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof MarkerPoint
     */
    MarkerPoint.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    MarkerPoint.markerIcon = L.divIcon({
        className: 'draw-marker-icon',
        html: '<div style="width: 16px; height: 16px; border-radius: 8px; overflow: hidden; border: solid 1px red; background: #ff000048"></div>'
    });
    return MarkerPoint;
}());

var LeafletPolygon = /** @class */ (function () {
    function LeafletPolygon(map, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.polygonLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
        };
        this.tempCoords = [];
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolygon
         */
        this.mapClickEvent = function (e) {
            _this.tempCoords.push([e.latlng.lat, e.latlng.lng]);
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolygon
         */
        this.mapDblClickEvent = function (e) {
            if (_this.polygonLayer) {
                // 渲染图层, 先剔除重复坐标，双击事件实际触发了2次单机事件，所以，需要剔除重复坐标
                var finalCoords = _this.deduplicateCoordinates(_this.tempCoords);
                _this.renderLayer(__spreadArray(__spreadArray([], finalCoords, true), [finalCoords[0]], false));
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolygon
         */
        this.mapMouseMoveEvent = function (e) {
            if (!_this.tempCoords.length)
                return;
            var lastMoveEndPoint = [e.latlng.lat, e.latlng.lng];
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (_this.tempCoords.length === 1) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 3：有两个及以上的点时，我们删掉在只有一个点时，塞入的最后移动的那个点，也就是前一个if语句中塞入的那个点，然后添加此刻移动结束的点。
            var fixedPoints = _this.tempCoords.slice(0, _this.tempCoords.length - 1); // 除最后一个点外的所有点
            _this.tempCoords = __spreadArray(__spreadArray([], fixedPoints, true), [lastMoveEndPoint], false);
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletPolygon.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180], [-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polygonOptions = __assign(__assign({ pane: 'overlayPane' }, this.drawLayerStyle), options);
        this.polygonLayer = L.polygon([[181, 181], [181, 181], [181, 181], [181, 181]], polygonOptions);
        this.polygonLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('dblclick', this.mapDblClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.renderLayer = function (coords) {
        if (this.polygonLayer) {
            this.polygonLayer.setLatLngs(coords);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.geojson = function () {
        if (this.polygonLayer) {
            return this.polygonLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.destroy = function () {
        if (this.polygonLayer) {
            this.polygonLayer.remove();
            this.polygonLayer = null;
        }
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('dblclick', this.mapDblClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    LeafletPolygon.prototype.deduplicateCoordinates = function (coordinates, precision) {
        if (precision === void 0) { precision = 6; }
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return [];
        }
        var result = [coordinates[0]]; // 总是保留第一个坐标
        for (var i = 1; i < coordinates.length; i++) {
            var current = coordinates[i];
            var previous = coordinates[i - 1];
            // 检查当前坐标是否与上一个坐标相同（在指定精度下）
            var isDuplicate = current[0].toFixed(precision) === previous[0].toFixed(precision) &&
                current[1].toFixed(precision) === previous[1].toFixed(precision);
            if (!isDuplicate) {
                result.push(current);
            }
        }
        return result;
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletPolygon.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletPolygon.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletPolygon
     */
    LeafletPolygon.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletPolygon;
}());

var LeafletPolyline = /** @class */ (function () {
    function LeafletPolyline(map, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.lineLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
        };
        this.tempCoords = [];
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolyLine
         */
        this.mapClickEvent = function (e) {
            _this.tempCoords.push([e.latlng.lat, e.latlng.lng]);
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolyLine
         */
        this.mapDblClickEvent = function (e) {
            if (_this.lineLayer) {
                // 渲染图层, 先剔除重复坐标，双击事件实际触发了2次单机事件，所以，需要剔除重复坐标
                var finalCoords = _this.deduplicateCoordinates(_this.tempCoords);
                _this.renderLayer(finalCoords);
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletPolyLine
         */
        this.mapMouseMoveEvent = function (e) {
            if (!_this.tempCoords.length)
                return;
            var lastMoveEndPoint = [e.latlng.lat, e.latlng.lng];
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (_this.tempCoords.length === 1) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 3：有两个及以上的点时，我们删掉在只有一个点时，塞入的最后移动的那个点，也就是前一个if语句中塞入的那个点，然后添加此刻移动结束的点。
            var fixedPoints = _this.tempCoords.slice(0, _this.tempCoords.length - 1); // 除最后一个点外的所有点
            _this.tempCoords = __spreadArray(__spreadArray([], fixedPoints, true), [lastMoveEndPoint], false);
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletPolyline.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polylineOptions = __assign(__assign({ pane: 'overlayPane' }, this.drawLayerStyle), options);
        this.lineLayer = L.polyline([[181, 181], [182, 182]], polylineOptions);
        this.lineLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('dblclick', this.mapDblClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        // 关闭全部监听器
        this.clearAllStateListeners();
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.renderLayer = function (coords) {
        if (this.lineLayer) {
            this.lineLayer.setLatLngs(coords);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.geojson = function () {
        if (this.lineLayer) {
            return this.lineLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.destroy = function () {
        if (this.lineLayer) {
            this.map.removeLayer(this.lineLayer);
            this.lineLayer.remove();
            this.lineLayer = null;
        }
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('dblclick', this.mapDblClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    LeafletPolyline.prototype.deduplicateCoordinates = function (coordinates, precision) {
        if (precision === void 0) { precision = 6; }
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return [];
        }
        var result = [coordinates[0]]; // 总是保留第一个坐标
        for (var i = 1; i < coordinates.length; i++) {
            var current = coordinates[i];
            var previous = coordinates[i - 1];
            // 检查当前坐标是否与上一个坐标相同（在指定精度下）
            var isDuplicate = current[0].toFixed(precision) === previous[0].toFixed(precision) &&
                current[1].toFixed(precision) === previous[1].toFixed(precision);
            if (!isDuplicate) {
                result.push(current);
            }
        }
        return result;
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletPolyline.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletPolyline.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletPolyLine
     */
    LeafletPolyline.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletPolyline;
}());

var LeafletRectangle = /** @class */ (function () {
    function LeafletRectangle(map, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.rectangleLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
        };
        this.tempCoords = [];
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletRectangle
         */
        this.mapClickEvent = function (e) {
            if (_this.tempCoords.length === 0) {
                _this.tempCoords.push(e.latlng);
            }
            else {
                var finalCoords = [_this.tempCoords[0], e.latlng];
                _this.renderLayer(finalCoords);
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletRectangle
         */
        this.mapMouseMoveEvent = function (e) {
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            if (!_this.tempCoords.length)
                return;
            var lastMoveEndPoint = e.latlng;
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (_this.tempCoords.length > 0) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletRectangle.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polylineOptions = __assign(__assign({ pane: 'overlayPane' }, this.drawLayerStyle), options);
        this.rectangleLayer = L.rectangle([[181, 181], [182, 182]], polylineOptions);
        this.rectangleLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.renderLayer = function (coords) {
        if (this.rectangleLayer) {
            var bounds = L.latLngBounds(coords);
            this.rectangleLayer.setBounds(bounds);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.geojson = function () {
        if (this.rectangleLayer) {
            return this.rectangleLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.destroy = function () {
        if (this.rectangleLayer) {
            this.rectangleLayer.remove();
            this.rectangleLayer = null;
        }
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletRectangle.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletRectangle.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletRectangle
     */
    LeafletRectangle.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletRectangle;
}());

/**
 * 1：吸附源是谁?
 * 假设图上有abc三个几何图形，然后你此刻在编辑C几何图层，那么吸附源就是除去C几何图层外的其他两个图层A和B。比如A和B均是多边形，我要先收集A和B的全部顶点。以拖动C几何中的一个顶点p1为例，我就要把P1和AB图层的所有顶点进行比较，来判断吸附到谁身上。综上: 吸附源是【A和B的全部顶点】。
 * 2: 后续我想在页面放置按钮：1：开启吸附、关闭吸附 2：吸附方式: 顶点吸附、线吸附。针对2我不确定应该是自动判断还是让用户选择(根据用户拖动的内容来自动选择吸附模式，留个口子，可能只要线吸附或者顶点吸附)
 * 3:对于数据格式，我们可以提前整理出一个处理好的拆分数据结构，比如：
 * const draggedGeometry = {
 *   type: 'polygon', // 或 'polyline'
 *   vertices: [p1, p2, p3, p4], // 所有顶点
 *   edges: [         // 所有边（线段）
 *     {start: p1, end: p2},
 *     {start: p2, end: p3},
 *     // ...
 *   ],
 *   bounds: {minX, minY, maxX, maxY}, // 包围盒(这个是否需要),
 *   geometry: {...}
 * };
 * 4:地图编辑中可能有大量几何元素，需要优化, 只在拖动点周围查询
 * 5: 对于顶点吸附：以拖动C几何中的一个顶点p1为例，我就要把从周围获取的顶点都进行比较，来判断吸附到谁身上
 * 6：对于线吸附：采用平行边投影吸附（暂时未使用线和线的吸附，因为arcgis没有好像）
 *     6.1：我拖动的是一条边 E = [P₁, P₂]。
 *     6.2：吸附源是其他周围的边集合 E' = {[A₁, A₂], [B₁, B₂], ...}。
 *     6.3. 判断E与E'中每条边是否近似平行（允许小误差）,（注意这里，如果E和E'是交叉的，只要角度小于某个阈值，则仍旧认为平行），平行则继续
 *     6.4 计算P1到E'中平行线的距离d1，P2到E'线的距离d2
 *     6.5. 计算平均距离 d_avg = (d1 + d2) / 2
 *     6.6. 如果 d_avg < 阈值 → 吸附
 *     6.7. 吸附时：将E整条边平行移动到E'对应的平行边上
 *
 */
var SnapController = /** @class */ (function () {
    function SnapController(map) {
        this.tolerance = 8; // px
        this.modes = ['vertex'];
        this.vertexSources = []; // 顶点吸附源
        this.edgeSources = []; // 边缘吸附源
        this.map = map;
    }
    /** 设置阈值
     *
     *
     * @param {number} tolerance
     * @memberof SnapController
     */
    SnapController.prototype.setTolerance = function (tolerance) {
        this.tolerance = tolerance;
    };
    /** 设置吸附模式
     *
     *
     * @param {SnapMode[]} modes
     * @memberof SnapController
     */
    SnapController.prototype.setModes = function (modes) {
        this.modes = modes;
    };
    /** 设置吸附源
     *
     *
     * @param {L.LatLng[]} points
     * @memberof SnapController
     */
    SnapController.prototype.setGeometrySources = function (indices) {
        this.vertexSources = indices.flatMap(function (i) { return i.vertices; });
        this.edgeSources = indices.flatMap(function (i) { return i.edges; });
        console.log('吸附源：', this.vertexSources, this.edgeSources);
    };
    /** 顶点吸附
     *
     *
     * @param {L.LatLng} input
     * @return {*}  {(L.LatLng | null)}
     * @memberof SnapController
     */
    SnapController.prototype.snapVertex = function (input) {
        var _a;
        if (!this.modes.includes('vertex'))
            return null;
        var inputPx = this.map.latLngToLayerPoint(input);
        var closest = null;
        for (var _i = 0, _b = this.vertexSources; _i < _b.length; _i++) {
            var p = _b[_i];
            var pPx = this.map.latLngToLayerPoint(p);
            var dist = inputPx.distanceTo(pPx);
            if (dist < this.tolerance && (!closest || dist < closest.dist)) {
                closest = { point: p, dist: dist };
            }
        }
        return (_a = closest === null || closest === void 0 ? void 0 : closest.point) !== null && _a !== void 0 ? _a : null;
    };
    /** 返回输入点即将吸附的目标边线
     *
     *
     * @param {L.LatLng} input
     * @return {*}  {({ start: L.LatLng; end: L.LatLng } | null)}
     * @memberof SnapController
     */
    SnapController.prototype.getClosestEdge = function (input) {
        var closest = null;
        var minDistance = Infinity;
        var inputPx = this.map.latLngToLayerPoint(input);
        for (var _i = 0, _a = this.edgeSources; _i < _a.length; _i++) {
            var edge = _a[_i];
            var projected = this.projectPointToSegment(input, edge.start, edge.end);
            var projectedPx = this.map.latLngToContainerPoint(projected);
            // 像素距离计算
            var distance = inputPx.distanceTo(projectedPx);
            if (distance < minDistance && distance <= this.tolerance) {
                minDistance = distance;
                closest = edge;
            }
        }
        return closest;
    };
    /** 边线吸附
     *
     *
     * @protected
     * @param {L.LatLng} latlng
     * @return {*}  {(L.LatLng | null)}
     * @memberof BaseEditor
     */
    SnapController.prototype.snapEdge = function (latlng) {
        if (!this.edgeSources.length)
            return null;
        var latlngPx = this.map.latLngToContainerPoint(latlng);
        var closestPoint = null;
        var minDistance = Infinity;
        for (var _i = 0, _a = this.edgeSources; _i < _a.length; _i++) {
            var _b = _a[_i], start = _b.start, end = _b.end;
            var projected = this.projectPointToSegment(latlng, start, end);
            // 使用像素坐标计算距离
            var projectedPx = this.map.latLngToContainerPoint(projected);
            var distancePx = latlngPx.distanceTo(projectedPx);
            if (distancePx < minDistance && distancePx <= this.tolerance) {
                minDistance = distancePx;
                closestPoint = projected;
            }
        }
        return closestPoint;
    };
    /** 将一个点 p 投影到一条线段 ab 上，返回投影点的位置。
     *
     *
     * @private
     * @param {L.LatLng} p
     * @param {L.LatLng} a
     * @param {L.LatLng} b
     * @return {*}  {L.LatLng}
     * @memberof SnapController
     */
    SnapController.prototype.projectPointToSegment = function (p, a, b) {
        var ax = a.lng, ay = a.lat;
        var bx = b.lng, by = b.lat;
        var px = p.lng, py = p.lat;
        var dx = bx - ax;
        var dy = by - ay;
        if (dx === 0 && dy === 0)
            return a;
        var t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
        var clampedT = Math.max(0, Math.min(1, t));
        return L.latLng(ay + clampedT * dy, ax + clampedT * dx);
    };
    return SnapController;
}());

// BaseEditor.ts - 基础形状编辑器
var BaseEditor = /** @class */ (function () {
    function BaseEditor(map, options) {
        this.currentState = PolygonEditorState.Idle; // 当前状态
        this.stateListeners = []; // 状态监听器存储数组，比如来了多个监听函数，触发的时候，要遍历全部监听函数。
        this.isDraggingPolygon = false; // 是否是拖动多边形
        this.dragStartLatLng = null; // 拖动多边形时，用户鼠标按下（mousedown）那一刻的坐标点，然后鼠标移动（mousemove）时，遍历全部的marker，做坐标偏移计算。
        this.isVisible = true; // 图层可见性
        this.highlightCircleMarker = null; // 吸附时，高亮显示的marker
        this.highlightEdgeLayer = null; // 吸附时，高亮显示的边线
        if (!map)
            throw new Error('传入的地图对象异常，请先确保地图对象已实例完成。');
        this.map = map;
        // 初始化吸附控制器 
        this.snapHighlightLayer = L.layerGroup().addTo(map);
        this.initSnap(map, options === null || options === void 0 ? void 0 : options.snap);
    }
    // #region 实例是否是激活状态（编辑时，就是激活态，否则就是非激活态，这时，关闭全部事件） 
    /**
     * 激活当前编辑器实例
     */
    BaseEditor.prototype.activate = function () {
        // console.log('激活编辑器:', this.constructor.name);
        // 保存之前的激活编辑器
        var previousActiveEditor = BaseEditor.currentActiveEditor;
        // 停用之前激活的编辑器
        if (previousActiveEditor && previousActiveEditor !== this) {
            // console.log('停用之前的编辑器:', previousActiveEditor.constructor.name);
            previousActiveEditor.forceExitEditMode(); // 强制退出编辑模式
            previousActiveEditor.deactivate(); // 停用激活状态
        }
        // 设置当前实例为激活状态
        BaseEditor.currentActiveEditor = this;
    };
    /**
     * 停用当前编辑器实例
     */
    BaseEditor.prototype.deactivate = function () {
        // console.log('停用编辑器:', this.constructor.name);
        if (BaseEditor.currentActiveEditor === this) {
            BaseEditor.currentActiveEditor = null;
        }
    };
    /**
     * 检查当前实例是否激活
     */
    BaseEditor.prototype.isActive = function () {
        return BaseEditor.currentActiveEditor === this && this.isVisible;
    };
    /**
     * 静态方法：停用所有编辑器（压根不用，我都不想写！）
     */
    BaseEditor.deactivateAllEditors = function () {
        // console.log('停用所有编辑器');
        if (BaseEditor.currentActiveEditor) {
            BaseEditor.currentActiveEditor.deactivate();
        }
    };
    /**
     * 强制停用编辑状态（但不改变激活状态）
     */
    BaseEditor.prototype.forceExitEditMode = function () {
        // console.log('强制退出编辑模式:', this.constructor.name);
        this.exitEditMode();
        if (this.currentState === PolygonEditorState.Editing) {
            this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        }
        this.isDraggingPolygon = false;
        this.dragStartLatLng = null;
    };
    // #endregion
    // #region 事件回调
    /** 状态改变时，触发存储的所有监听事件的回调
     *
     *
     * @private
     * @memberof BaseEditor
     */
    BaseEditor.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    /** 设置当前的状态，
     *
     *
     * @param {PolygonEditorState} status
     * @memberof BaseEditor
     */
    BaseEditor.prototype.setCurrentState = function (status) {
        this.currentState = status;
    };
    /** 外部监听者添加的回调监听函数，存储到这边，状态改变时，触发这些监听事件的回调
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    BaseEditor.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        listener(this.currentState);
    };
    /** 移除监听器的方法
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof BaseEditor
     */
    BaseEditor.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    BaseEditor.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    // #endregion
    // #region 吸附行为
    /*
    arcgis，
    1：拖动面时，不进行吸附行为，
    2：拖动点接近另一个点时，点被吸附到一起，
    3：拖动一个点接近一条线时，点会被吸附到线上
    4：拖动一条线接近另一条线时，会根据鼠标按下拖动的那个坐标去吸附目标线，而拖动的线会跟着跑，同步的图形也在变化
     */
    /** 初始化吸附控制器
     *
     *
     * @protected
     * @param {L.Map} map
     * @param {SnapOptions} [snap]
     * @memberof BaseEditor
     */
    BaseEditor.prototype.initSnap = function (map, snap) {
        var _a, _b;
        if (!(snap === null || snap === void 0 ? void 0 : snap.enabled))
            return;
        this.snapController = new SnapController(map);
        this.snapController.setModes((_a = snap.modes) !== null && _a !== void 0 ? _a : ['vertex']);
        this.snapController.setTolerance((_b = snap.tolerance) !== null && _b !== void 0 ? _b : 8);
    };
    /** 【吸附器】确定最终的坐标(顶点会去吸附边和其他顶点)
     *
     *
     * @protected
     * @param {L.LatLng} latlng
     * @return {*}  {L.LatLng}
     * @memberof BaseEditor
     */
    BaseEditor.prototype.applySnapWithTarget = function (latlng, autoHighlight) {
        var _a, _b, _c, _d, _e, _f;
        if (autoHighlight === void 0) { autoHighlight = true; }
        // 移除高亮的图层
        this.clearSnapHighlights();
        var snappedVertex = (_b = (_a = this.snapController) === null || _a === void 0 ? void 0 : _a.snapVertex) === null || _b === void 0 ? void 0 : _b.call(_a, latlng);
        if (snappedVertex) {
            console.log('顶点吸附：', snappedVertex);
            if (autoHighlight)
                this.highlightPoint(snappedVertex); // ✅ 自动高亮
            return {
                snappedLatLng: snappedVertex,
                snapped: true,
                type: 'vertex',
                target: snappedVertex
            };
        }
        var snappedEdge = (_d = (_c = this.snapController) === null || _c === void 0 ? void 0 : _c.snapEdge) === null || _d === void 0 ? void 0 : _d.call(_c, latlng);
        if (snappedEdge) {
            console.log('边缘吸附：', snappedEdge);
            var edge = (_f = (_e = this.snapController) === null || _e === void 0 ? void 0 : _e.getClosestEdge) === null || _f === void 0 ? void 0 : _f.call(_e, latlng); // 返回输入点即将吸附的目标边线
            if (autoHighlight && edge)
                this.highlightEdge(edge); // ✅ 自动高亮
            return {
                snappedLatLng: snappedEdge,
                snapped: true,
                type: 'edge',
                target: edge
            };
        }
        return {
            snappedLatLng: latlng,
            snapped: false
        };
    };
    /** 【顶点吸附器】收集所有其他图层的顶点信息
     *
     *
     * @protected
     * @param {L.Map} map
     * @param {L.Layer} excludeLayer
     * @return {*}  {L.LatLng[]}
     * @memberof BaseEditor
     */
    BaseEditor.prototype.collectAllOtherGeometryIndices = function (map, excludeLayer) {
        var _this = this;
        var indices = [];
        map.eachLayer(function (layer) {
            if (layer !== excludeLayer && layer.toGeoJSON) {
                var geo = layer.toGeoJSON();
                var geometry = geo.type === 'Feature' ? geo.geometry : geo;
                try {
                    var index = _this.buildGeometryIndex(geometry);
                    indices.push(index);
                }
                catch (e) {
                    console.warn('跳过不支持的图层类型', e);
                }
            }
        });
        return indices;
    };
    /** 高亮吸附目标点
     *
     *
     * @protected
     * @param {{ start: L.LatLng; end: L.LatLng }} edge
     * @memberof BaseEditor
     */
    BaseEditor.prototype.highlightPoint = function (latlng) {
        // 清除上一次的高亮图层
        if (this.highlightCircleMarker) {
            this.highlightCircleMarker.remove();
            this.highlightCircleMarker = null;
        }
        var marker = L.circleMarker(latlng, {
            radius: 15,
            color: '#00ff00',
            weight: 2,
            fillOpacity: 0.8
        });
        this.snapHighlightLayer.addLayer(marker);
        this.highlightCircleMarker = marker;
    };
    /** 高亮吸附目标线段
     *
     *
     * @protected
     * @param {{ start: L.LatLng; end: L.LatLng }} edge
     * @memberof BaseEditor
     */
    BaseEditor.prototype.highlightEdge = function (edge) {
        // 移除上次吸附高亮图层
        if (this.highlightEdgeLayer) {
            this.highlightEdgeLayer.remove();
            this.highlightEdgeLayer = null;
        }
        // 添加新的高亮图层
        var edgeLine = L.polyline([edge.start, edge.end], {
            color: '#00ff00',
            weight: 5,
            dashArray: '4,2',
            pane: 'overlayPane'
        });
        this.snapHighlightLayer.addLayer(edgeLine);
        this.highlightEdgeLayer = edgeLine;
    };
    /** 移除上次吸附高亮图层
     *
     *
     * @protected
     * @memberof BaseEditor
     */
    BaseEditor.prototype.clearSnapHighlights = function () {
        // 清除上一次的高亮图层
        this.snapHighlightLayer.clearLayers();
        this.highlightCircleMarker = null;
        this.highlightEdgeLayer = null;
    };
    // 清理吸附相关资源的方法
    BaseEditor.prototype.cleanupSnapResources = function () {
        // 1. 清理高亮层
        this.clearSnapHighlights();
        this.map.removeLayer(this.snapHighlightLayer);
        // 2. 清理吸附控制器
        this.snapController = undefined;
    };
    // #endregion
    // #region 辅助函数
    /** 提取多边形的坐标点（全部平铺到一个数组中）
     *
     *
     * @protected
     * @param {GeoJSON.GeoJSON} geo
     * @return {*}  {L.LatLng[]}
     * @memberof BaseEditor
     */
    BaseEditor.prototype.extractVerticesFromGeoJSON = function (geo) {
        var result = [];
        if (geo.type === 'Feature')
            geo = geo.geometry;
        if (geo.type === 'Polygon') {
            geo.coordinates.forEach(function (ring) {
                return ring.forEach(function (_a) {
                    var lng = _a[0], lat = _a[1];
                    return result.push(L.latLng(lat, lng));
                });
            });
        }
        else if (geo.type === 'MultiPolygon') {
            geo.coordinates.forEach(function (polygon) {
                return polygon.forEach(function (ring) {
                    return ring.forEach(function (_a) {
                        var lng = _a[0], lat = _a[1];
                        return result.push(L.latLng(lat, lng));
                    });
                });
            });
        }
        return result;
    };
    /** 构建空间数据索引
     *
     *
     * @protected
     * @param {GeoJSON.Geometry} geometry
     * @return {*}  {GeometryIndex}
     * @memberof BaseEditor
     */
    BaseEditor.prototype.buildGeometryIndex = function (geometry) {
        var vertices = [];
        var edges = [];
        if (geometry.type === 'Polygon') {
            geometry.coordinates.forEach(function (ring) {
                var ringPoints = ring.map(function (_a) {
                    var lng = _a[0], lat = _a[1];
                    return L.latLng(lat, lng);
                });
                vertices.push.apply(vertices, ringPoints);
                for (var i = 0; i < ringPoints.length; i++) {
                    var start = ringPoints[i];
                    var end = ringPoints[(i + 1) % ringPoints.length]; // 闭合
                    edges.push({ start: start, end: end });
                }
            });
        }
        else if (geometry.type === 'MultiPolygon') {
            geometry.coordinates.forEach(function (polygon) {
                polygon.forEach(function (ring) {
                    var ringPoints = ring.map(function (_a) {
                        var lng = _a[0], lat = _a[1];
                        return L.latLng(lat, lng);
                    });
                    vertices.push.apply(vertices, ringPoints);
                    for (var i = 0; i < ringPoints.length; i++) {
                        var start = ringPoints[i];
                        var end = ringPoints[(i + 1) % ringPoints.length];
                        edges.push({ start: start, end: end });
                    }
                });
            });
        }
        else if (geometry.type === 'LineString') {
            var linePoints = geometry.coordinates.map(function (_a) {
                var lng = _a[0], lat = _a[1];
                return L.latLng(lat, lng);
            });
            vertices.push.apply(vertices, linePoints);
            for (var i = 0; i < linePoints.length - 1; i++) {
                edges.push({ start: linePoints[i], end: linePoints[i + 1] });
            }
        }
        else if (geometry.type === 'MultiLineString') {
            geometry.coordinates.forEach(function (line) {
                var linePoints = line.map(function (_a) {
                    var lng = _a[0], lat = _a[1];
                    return L.latLng(lat, lng);
                });
                vertices.push.apply(vertices, linePoints);
                for (var i = 0; i < linePoints.length - 1; i++) {
                    edges.push({ start: linePoints[i], end: linePoints[i + 1] });
                }
            });
        }
        else {
            throw new Error("\u4E0D\u652F\u6301\u7684 geometry \u7C7B\u578B: ".concat(geometry.type));
        }
        var bounds = L.latLngBounds(vertices);
        return {
            type: geometry.type.startsWith('Polygon') ? 'polygon' : 'polyline',
            vertices: vertices,
            edges: edges,
            bounds: bounds,
            geometry: geometry
        };
    };
    // 静态属性 - 所有编辑器实例共享同一个激活状态
    BaseEditor.currentActiveEditor = null;
    return BaseEditor;
}());

// BasePolygonEditor.ts - 多边形基类
var BasePolygonEditor = /** @class */ (function (_super) {
    __extends(BasePolygonEditor, _super);
    function BasePolygonEditor(map, options) {
        var _this = _super.call(this, map, options) || this;
        _this.vertexMarkers = []; // 存储顶点标记的数组
        _this.midpointMarkers = []; // 存储【线中点】标记的数组
        _this.historyStack = []; // 历史记录，存储快照
        _this.redoStack = []; // 重做记录，存储快照
        return _this;
    }
    // #region 操作行为
    /** 撤回到上一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BasePolygonEditor.prototype.undoEdit = function () {
        if (this.historyStack.length < 2)
            return;
        var popItem = this.historyStack.pop(); // 弹出当前状态
        if (popItem)
            this.redoStack.push(popItem); // 用于重做
        var previous = this.historyStack[this.historyStack.length - 1]; // 获取上一个状态
        this.reBuildMarkerAndRender(previous);
    };
    /** 前进到刚才测回的一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BasePolygonEditor.prototype.redoEdit = function () {
        if (!this.redoStack.length)
            return;
        var next = this.redoStack.pop();
        if (next) {
            this.historyStack.push(next);
            this.reBuildMarkerAndRender(next);
        }
    };
    /** 全部撤回（建议写到二次确认的弹窗后触发）
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BasePolygonEditor.prototype.resetToInitial = function () {
        if (!this.historyStack.length)
            return;
        // 保存当前状态到重做栈，以便用户可以恢复（简言之，将撤销全部的操作也当作一个快照，方便用户后悔）
        var currentState = this.historyStack[this.historyStack.length - 1];
        var initial = this.historyStack[0];
        // 存储快照
        this.redoStack.push(currentState);
        // 渲染初始状态
        this.reBuildMarkerAndRender(initial);
    };
    /** 完成编辑行为
     *
     *
     * @memberof BaseEditor
     */
    BasePolygonEditor.prototype.commitEdit = function () {
        // 读取当前 marker 坐标，构建完整结构 [面][环][点][latlng]
        var current = this.vertexMarkers.map(function (polygon) {
            return polygon.map(function (ring) {
                return ring.map(function (marker) { return [marker.getLatLng().lat, marker.getLatLng().lng]; });
            });
        });
        this.historyStack = [current]; // 读取当前状态作为新的初始快照
        this.redoStack = []; // 清空重做栈（如果有）
        this.exitEditMode();
        // 事件监听停止。
        this.deactivate();
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        this.reset();
    };
    /** 地图状态重置
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    BasePolygonEditor.prototype.reset = function () {
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
    };
    /** 移除所有中点标记（若存在正在拖动的，则跳过）
     *
     *
     * @memberof BasePolygonEditor
     */
    BasePolygonEditor.prototype.removeAllMidPointMarkers = function (skipMarker) {
        var _this = this;
        var newMidpoints = [];
        this.midpointMarkers.flat(2).forEach(function (pair) {
            var keepInsert = pair.insert === skipMarker;
            var keepEdge = pair.edge === skipMarker;
            if (!keepInsert) {
                _this.map.removeLayer(pair.insert);
            }
            if (!keepEdge) {
                _this.map.removeLayer(pair.edge);
            }
            // 如果有任一 marker 被保留，就保留这个 pair
            if (keepInsert || keepEdge) {
                newMidpoints.push(pair);
            }
        });
        // 重新组织为二维结构（可选）
        this.midpointMarkers = newMidpoints.length > 0 ? [[__spreadArray([], newMidpoints, true)]] : [];
    };
    return BasePolygonEditor;
}(BaseEditor));

var LeafletPolygonEditor = /** @class */ (function (_super) {
    __extends(LeafletPolygonEditor, _super);
    /** 创建一个多边形编辑类
     *
     * @param {L.Map} map 地图对象
     * @param {LeafletPolylineOptionsExpends} [options={}] 要构建的多边形的样式属性以及额外自定义的信息
     * @param {GeoJSON.Geometry} [defaultGeometry] 默认的空间信息
     * @memberof LeafletEditPolygon
     */
    function LeafletPolygonEditor(map, options, defaultGeometry) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, map, { snap: options === null || options === void 0 ? void 0 : options.snap }) || this;
        _this.polygonLayer = null;
        // 图层初始化时
        _this.drawLayerStyle = {
            weight: 2,
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
            fill: true, // no fill color means default fill color (gray for `dot` and `circle` markers, transparent for `plus` and `star`)
        };
        _this.tempCoords = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof markerPoint
         */
        _this.mapClickEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            // 绘制时的逻辑
            if (_this.currentState === PolygonEditorState.Drawing) {
                _this.tempCoords.push([e.latlng.lat, e.latlng.lng]);
                return;
            }
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditPolygon
         */
        _this.mapDblClickEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.canConsume(e))
                return;
            if (!_this.polygonLayer)
                throw new Error('面图层实例化失败，无法完成图层创建，请重试');
            // 情况1： 正在绘制状态时，绘制的逻辑
            if (_this.currentState === PolygonEditorState.Drawing) {
                // 渲染图层, 先剔除重复坐标，双击事件实际触发了2次单机事件，所以，需要剔除重复坐标
                var finalCoords = _this.deduplicateCoordinates(_this.tempCoords);
                // 渲染单个面：[[面坐标]]
                var renderCoords = [__spreadArray(__spreadArray([], finalCoords, true), [finalCoords[0]], false)];
                _this.renderLayer([renderCoords]);
                _this.tempCoords = []; // 清空吧，虽然不清空也没事，毕竟后面就不使用了
                _this.reset();
                // 设置为空闲状态，并发出状态通知
                _this.updateAndNotifyStateChange(PolygonEditorState.Idle);
                return;
            }
            else {
                // 情况 2：已绘制完成后的后续双击事件的逻辑均走这个
                var clickedLatLng = e.latlng;
                var polygonGeoJSON = _this.polygonLayer.toGeoJSON();
                // 判断用户是否点击到了面上，是的话，就开始编辑模式
                var turfPoint = point([clickedLatLng.lng, clickedLatLng.lat]);
                var isInside = booleanPointInPolygon(turfPoint, polygonGeoJSON);
                if (isInside && _this.currentState !== PolygonEditorState.Editing) {
                    // 1：禁用双击地图放大功能
                    _this.map.doubleClickZoom.disable();
                    // 2：状态变更，并发出状态通知
                    _this.updateAndNotifyStateChange(PolygonEditorState.Editing);
                    // 3: 设置当前激活态是本实例，因为事件监听和激活态实例是关联的，只有激活的实例才处理事件
                    _this.isActive();
                    // 4: 进入编辑模式
                    _this.enterEditMode();
                }
                else {
                    _this.commitEdit();
                }
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditPolygon
         */
        _this.mapMouseMoveEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            // 逻辑1： 绘制时的逻辑
            if (_this.currentState === PolygonEditorState.Drawing) {
                if (!_this.tempCoords.length)
                    return;
                var lastMoveEndPoint = [e.latlng.lat, e.latlng.lng];
                // 1：一个点也没有时，我们移动事件，也什么也不做。
                // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
                if (_this.tempCoords.length === 1) {
                    _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
                }
                // 3：有两个及以上的点时，我们删掉在只有一个点时，塞入的最后移动的那个点，也就是前一个if语句中塞入的那个点，然后添加此刻移动结束的点。
                var fixedPoints = _this.tempCoords.slice(0, _this.tempCoords.length - 1); // 除最后一个点外的所有点
                _this.tempCoords = __spreadArray(__spreadArray([], fixedPoints, true), [lastMoveEndPoint], false);
                // 实时渲染, 包装成 [面][环][点] 结构
                _this.renderLayer([[_this.tempCoords]]);
                return;
            }
            // 逻辑2：编辑状态下的逻辑（编辑状态下如果分多个逻辑，需要定义新的变量用于区分。但这些都是在编辑状态下才会执行）
            if (_this.currentState === PolygonEditorState.Editing) {
                // 🎯 编辑模式下的逻辑（可扩展），例如：拖动整个面时显示辅助线、吸附提示等
                // 事件机制1：拖动机制时的事件。
                if (_this.isDraggingPolygon && _this.dragStartLatLng) {
                    var deltaLat_1 = e.latlng.lat - _this.dragStartLatLng.lat;
                    var deltaLng_1 = e.latlng.lng - _this.dragStartLatLng.lng;
                    _this.vertexMarkers.forEach(function (polygon) {
                        polygon.forEach(function (ring) {
                            ring.forEach(function (marker) {
                                var old = marker.getLatLng();
                                marker.setLatLng([old.lat + deltaLat_1, old.lng + deltaLng_1]);
                            });
                        });
                    });
                    var updated = _this.vertexMarkers.map(function (polygon) {
                        return polygon.map(function (ring) {
                            return ring.map(function (marker) { return [marker.getLatLng().lat, marker.getLatLng().lng]; });
                        });
                    });
                    _this.renderLayer(updated);
                    _this.updateMidpoints();
                    _this.dragStartLatLng = e.latlng; // 连续拖动
                }
                // 事件机制2：吸附事件
            }
        };
        /**  地图鼠标抬起事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditPolygon
         */
        _this.mapMouseUpEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            // 条件1: 编辑事件
            if (_this.currentState === PolygonEditorState.Editing) {
                // 条件1-1： 编辑状态下： 拖动面的事件
                if (_this.isDraggingPolygon) {
                    _this.isDraggingPolygon = false;
                    _this.dragStartLatLng = null;
                    _this.map.dragging.enable();
                    var updated = _this.vertexMarkers.map(function (polygon) {
                        return polygon.map(function (ring) {
                            return ring.map(function (marker) { return [marker.getLatLng().lat, marker.getLatLng().lng]; });
                        });
                    });
                    _this.renderLayer(updated);
                    _this.historyStack.push(updated);
                    _this.updateMidpoints();
                    return;
                }
            }
        };
        if (_this.map) {
            // 创建时激活
            _this.activate();
            var existGeometry = !!defaultGeometry;
            // 初始化时，设置绘制状态为true(双击结束绘制时关闭绘制状态，其生命周期到头，且不再改变)，且发出状态通知
            _this.updateAndNotifyStateChange(existGeometry ? PolygonEditorState.Idle : PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            _this.map.getContainer().style.cursor = existGeometry ? 'grab' : 'crosshair';
            // 不需要设置十字光标和禁用双击放大
            existGeometry ? _this.map.doubleClickZoom.enable() : _this.map.doubleClickZoom.disable();
            _this.initLayers(options, existGeometry ? defaultGeometry : undefined);
            _this.initMapEvent(_this.map);
        }
        return _this;
    }
    // 初始化图层
    LeafletPolygonEditor.prototype.initLayers = function (options, defaultGeometry) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180], [-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polygonOptions = __assign(__assign({ pane: 'overlayPane', layerVisible: true, defaultStyle: this.drawLayerStyle }, this.drawLayerStyle), options);
        var coords = [[181, 181], [181, 181], [181, 181], [181, 181]]; // 默认空图形
        if (defaultGeometry) {
            coords = this.convertGeoJSONToLatLngs(defaultGeometry);
        }
        this.polygonLayer = L.polygon(coords, polygonOptions);
        this.polygonLayer.addTo(this.map);
        this.initPolygonEvent();
    };
    /** 实例化面图层事件
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.initPolygonEvent = function () {
        var _this = this;
        if (this.polygonLayer) {
            this.polygonLayer.on('mousedown', function (e) {
                // 关键：只有激活的实例才处理事件
                if (!_this.isActive())
                    return;
                if (_this.currentState === PolygonEditorState.Editing) {
                    _this.isDraggingPolygon = true;
                    _this.dragStartLatLng = e.latlng;
                    _this.map.dragging.disable();
                }
            });
        }
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.initMapEvent = function (map) {
        // 绘制、编辑用前三个
        map.on('click', this.mapClickEvent);
        map.on('dblclick', this.mapDblClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
        // 拖动面用的这个
        map.on('mouseup', this.mapMouseUpEvent);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.renderLayer = function (coords) {
        if (!this.polygonLayer) {
            throw new Error('图层不存在，无法渲染');
        }
        var latlngs = coords.map(function (polygon) {
            return polygon.map(function (ring) {
                return ring.map(function (_a) {
                    var lat = _a[0], lng = _a[1];
                    return L.latLng(lat, lng);
                });
            });
        });
        this.polygonLayer.setLatLngs(latlngs);
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.geojson = function () {
        if (this.polygonLayer) {
            return this.polygonLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 返回绘制的图层
     *
     * 应用场景1： 地图上存在多个图层实例，每个图层的options属性中有其唯一id标识。现在若要删除其中一个图层，就需要先找到这个图层实例的options中存储的id标识，然后调用后台的删除接口。
     *
     * 应用场景2： 更改图层样式。
     *
     * （简言之： 场景太多，索性直接返回图层对象即可）
     * @return {*}
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.getLayer = function () {
        return this.polygonLayer;
    };
    /** 控制图层显示
     *
     *
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.show = function () {
        var _a;
        this.isVisible = true;
        // 使用用户默认设置的样式，而不是我自定义的！
        (_a = this.polygonLayer) === null || _a === void 0 ? void 0 : _a.setStyle(__assign(__assign({}, this.polygonLayer.options.defaultStyle), { layerVisible: true }));
    };
    /** 控制图层隐藏
     *
    *
    * @memberof LeafletEditPolygon
    */
    LeafletPolygonEditor.prototype.hide = function () {
        var _a;
        this.isVisible = false;
        var hideStyle = {
            color: 'red',
            weight: 0,
            fill: false, // no fill color means default fill color (gray for `dot` and `circle` markers, transparent for `plus` and `star`)
            fillColor: 'red', // same color as the line
            fillOpacity: 0
        };
        (_a = this.polygonLayer) === null || _a === void 0 ? void 0 : _a.setStyle(__assign(__assign({}, hideStyle), { layerVisible: false }));
        // ✅ 退出编辑状态（若存在）
        if (this.currentState === PolygonEditorState.Editing) {
            this.exitEditMode();
            this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        }
    };
    /** 设置图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.setVisible = function (visible) {
        if (visible) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    /** 获取图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.getLayerVisible = function () {
        var _a;
        return ((_a = this.polygonLayer) === null || _a === void 0 ? void 0 : _a.options).layerVisible;
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.destroy = function () {
        // #region 1：绘制图层用到的内容
        this.destroyLayer();
        // #endregion
        // #region 2：编辑模式用到的内容
        // 关闭事件监听内容
        this.deactivate();
        // 编辑模式的内容也重置
        this.exitEditMode();
        // #endregion
        // #region 3：吸附用到的内容
        this.cleanupSnapResources();
        // #endregion
        // #region3：地图相关内容处理（关闭事件监听，恢复部分交互功能【缩放、鼠标手势】）
        this.offMapEvent(this.map);
        this.reset();
        // #endregion
        // #region4：清除类自身绑定的相关事件
        this.clearAllStateListeners();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        // #endregion
    };
    /** 销毁绘制的图层
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.destroyLayer = function () {
        // 1.1清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 1.2从地图中移除图层
        if (this.polygonLayer) {
            this.polygonLayer.remove();
            this.polygonLayer = null;
        }
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('dblclick', this.mapDblClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
        map.off('mouseup', this.mapMouseUpEvent);
    };
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    LeafletPolygonEditor.prototype.deduplicateCoordinates = function (coordinates, precision) {
        if (precision === void 0) { precision = 6; }
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return [];
        }
        var result = [coordinates[0]]; // 总是保留第一个坐标
        for (var i = 1; i < coordinates.length; i++) {
            var current = coordinates[i];
            var previous = coordinates[i - 1];
            // 检查当前坐标是否与上一个坐标相同（在指定精度下）
            var isDuplicate = current[0].toFixed(precision) === previous[0].toFixed(precision) &&
                current[1].toFixed(precision) === previous[1].toFixed(precision);
            if (!isDuplicate) {
                result.push(current);
            }
        }
        return result;
    };
    // #endregion
    // #region 编辑用到的工具函数
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.enterEditMode = function () {
        var _a;
        if (!this.polygonLayer)
            return;
        var latlngs = this.polygonLayer.getLatLngs();
        var coords;
        if (Array.isArray(latlngs[0][0])) {
            // MultiPolygon
            coords = latlngs.map(function (polygon) {
                return polygon.map(function (ring) { return ring.map(function (p) { return [p.lat, p.lng]; }); });
            });
        }
        else {
            // Polygon
            coords = [
                latlngs.map(function (ring) { return ring.map(function (p) { return [p.lat, p.lng]; }); })
            ];
        }
        // 记录初始快照
        this.historyStack.push(coords);
        // 清空重做栈
        this.redoStack = [];
        // ✅ 设置吸附源（排除当前图层） 
        var otherIndices = this.collectAllOtherGeometryIndices(this.map, this.polygonLayer);
        (_a = this.snapController) === null || _a === void 0 ? void 0 : _a.setGeometrySources(otherIndices);
        // 渲染每个顶点为可拖动 marker
        this.reBuildMarker(coords);
        // 渲染边的中线点
        this.insertMidpointMarkers();
    };
    /** 退出编辑模式
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.exitEditMode = function () {
        var _this = this;
        // 移除所有顶点 marker
        this.vertexMarkers.flat(2).forEach(function (marker) {
            _this.map.removeLayer(marker);
        });
        this.vertexMarkers = [];
        // 移除所有中点 marker
        this.removeAllMidPointMarkers();
    };
    /** 插入中间点坐标
     *
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.insertMidpointMarkers = function (skipMarker) {
        var _this = this;
        if (!this.polygonLayer || this.currentState !== PolygonEditorState.Editing)
            return;
        // 清除旧的中点标记（若数组中存在）
        this.removeAllMidPointMarkers(skipMarker);
        this.vertexMarkers.forEach(function (polygon, polygonIndex) {
            var polygonMidpoints = [];
            polygon.forEach(function (ring, ringIndex) {
                var ringMidpoints = [];
                for (var i = 0; i < ring.length; i++) {
                    var nextIndex = (i + 1) % ring.length;
                    var p1 = ring[i];
                    var p2 = ring[nextIndex];
                    // ✅ 跳过当前边包含 skipMarker 的情况
                    if (skipMarker && (skipMarker === p1 || skipMarker === p2 || skipMarker.pairRef === p1 || skipMarker.pairRef === p2)) {
                        continue;
                    }
                    var insertMidpoint = _this.createInsertMidpointMarker(p1, p2, polygonIndex, ringIndex, nextIndex, 0.3);
                    // 插入边控制点（用于拖动边） 
                    var edgeDragMarker = _this.createEdgeDragMarker(p1, p2, polygonIndex, ringIndex, 0.6);
                    ringMidpoints.push({ insert: insertMidpoint, edge: edgeDragMarker });
                    // 附加：互相引用 （虽然写的晚，但是一般都会在【createInsertMidpointMarker、createEdgeDragMarker】中绑定的dragstart事件之前完成）
                    insertMidpoint.pairRef = edgeDragMarker;
                    edgeDragMarker.pairRef = insertMidpoint;
                }
                polygonMidpoints.push(ringMidpoints);
            });
            _this.midpointMarkers.push(polygonMidpoints);
        });
    };
    /** 创建一个中点标记
     *
     *
     * @private
     * @param {L.Marker} p1 起点 marker
     * @param {L.Marker} p2 终点 marker
     * @param {number} polygonIndex 多边形索引
     * @param {number} ringIndex 环索引
     * @param {number} insertIndex 插入点的位置
     * @param {number} positionRadio 位置比率
     * @return {*}  {L.Marker}
     * @memberof LeafletPolygonEditor
     */
    LeafletPolygonEditor.prototype.createInsertMidpointMarker = function (p1, p2, polygonIndex, ringIndex, insertIndex, positionRadio) {
        var _this = this;
        var midPoint = this.getFractionalPointOnEdge(p1.getLatLng(), p2.getLatLng(), positionRadio);
        var marker = L.marker(midPoint, {
            draggable: true,
            icon: this.buildMarkerIcon("border-radius: 50%; background: #ffffff80; border: solid 1px #f00;", [14, 14])
        }).addTo(this.map);
        // 开始拖动时，移除线拖动的marker
        marker.on('dragstart', function () {
            var pair = marker.pairRef;
            if (pair) {
                _this.map.removeLayer(pair);
            }
        });
        // 中点被拖动时，图形同步更新
        marker.on('drag', function () {
            // 0：先进行吸附处理（确定吸附点）
            var latlng = _this.applySnapWithTarget(marker.getLatLng()).snappedLatLng;
            // 1. 拷贝当前顶点坐标
            var coords = _this.vertexMarkers.map(function (polygon) {
                return polygon.map(function (ring) {
                    return ring.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
                });
            });
            // 2. 插入中点坐标到对应位置（不修改原 marker 数组）
            var ring = coords[polygonIndex][ringIndex];
            var newRing = __spreadArray([], ring, true);
            newRing.splice(insertIndex, 0, [latlng.lat, latlng.lng]);
            // 3. 构造新的坐标结构
            var newCoords = __spreadArray([], coords, true);
            newCoords[polygonIndex] = __spreadArray([], coords[polygonIndex], true);
            newCoords[polygonIndex][ringIndex] = newRing;
            // 4. 实时渲染
            _this.renderLayer(newCoords);
        });
        // 中点拖动结束后，移除此处中点，执行添加新的顶点
        marker.on('dragend', function () {
            // 0：先进行吸附处理（只是用于确定吸附点，不再进行高亮）
            var latlng = _this.applySnapWithTarget(marker.getLatLng(), false).snappedLatLng;
            // 移除可能存在的高亮
            _this.clearSnapHighlights();
            // 1. 从地图中移除中点 marker
            _this.map.removeLayer(marker);
            // 2. 创建新的顶点 marker
            var newMarker = L.marker(latlng, {
                draggable: true,
                icon: _this.buildMarkerIcon()
            }).addTo(_this.map);
            // 3. 插入到顶点数组
            _this.vertexMarkers[polygonIndex][ringIndex].splice(insertIndex, 0, newMarker);
            // 4. 绑定事件
            newMarker.on('drag', function () {
                // 先进行吸附处理（确定吸附点）
                var latlng = _this.applySnapWithTarget(newMarker.getLatLng()).snappedLatLng;
                marker.setLatLng(latlng);
                _this.renderLayerFromMarkers();
                _this.updateMidpoints();
            });
            newMarker.on('dragend', function () {
                // 1. 移除可能存在的高亮
                _this.clearSnapHighlights();
                // 2. 更新历史记录
                _this.pushHistoryFromMarkers();
            });
            newMarker.on('contextmenu', function () {
                var currentRing = _this.vertexMarkers[polygonIndex][ringIndex];
                if (currentRing.length > 3) {
                    // 关键：查找当前 marker 的实际索引
                    var currentIndex = currentRing.findIndex(function (m) { return m === newMarker; });
                    if (currentIndex !== -1) {
                        _this.map.removeLayer(newMarker);
                        currentRing.splice(currentIndex, 1);
                        _this.renderLayerFromMarkers();
                        _this.pushHistoryFromMarkers();
                        _this.updateMidpoints();
                    }
                }
                else {
                    alert('环点数不能少于3个');
                }
            });
            // 5. 刷新图层和中点
            _this.renderLayerFromMarkers();
            _this.pushHistoryFromMarkers();
            _this.updateMidpoints();
        });
        return marker;
    };
    /** 创建一个可拖动的边控制点，用于拖动整条边
     * @param p1 起点 marker
     * @param p2 终点 marker
     * @param polygonIndex 多边形索引
     * @param ringIndex 环索引
     * @param {number} positionRadio 位置比率
     * @returns L.Marker
     */
    LeafletPolygonEditor.prototype.createEdgeDragMarker = function (p1, p2, polygonIndex, ringIndex, positionRadio) {
        var _this = this;
        var midDragPoint = this.getFractionalPointOnEdge(p1.getLatLng(), p2.getLatLng(), positionRadio);
        var marker = L.marker(midDragPoint, {
            draggable: true,
            icon: this.buildMarkerIcon("border-radius: 50%; background: #007bff80; border: solid 1px #007bff;", [12, 12])
        }).addTo(this.map);
        var lastLatLng = null;
        marker.on('dragstart', function () {
            lastLatLng = marker.getLatLng();
            // 移除配对中点
            var pair = marker.pairRef;
            if (pair && _this.map.hasLayer(pair)) {
                _this.map.removeLayer(pair);
            }
        });
        marker.on('drag', function () {
            if (!lastLatLng)
                return;
            var current = _this.applySnapWithTarget(marker.getLatLng()).snappedLatLng;
            var deltaLat = current.lat - lastLatLng.lat;
            var deltaLng = current.lng - lastLatLng.lng;
            var latlng1 = p1.getLatLng();
            var latlng2 = p2.getLatLng();
            p1.setLatLng([latlng1.lat + deltaLat, latlng1.lng + deltaLng]);
            p2.setLatLng([latlng2.lat + deltaLat, latlng2.lng + deltaLng]);
            _this.renderLayerFromMarkers();
            _this.updateMidpoints(marker); // ✅ 传入当前 marker，避免被销毁
            lastLatLng = current;
        });
        marker.on('dragend', function () {
            // 1. 移除可能存在的高亮
            _this.clearSnapHighlights();
            // 2. 重新渲染更新中点 marker
            _this.updateMidpoints();
            _this.pushHistoryFromMarkers();
        });
        return marker;
    };
    /** 实时更新中线点的位置（传参意思：用户正在拖动的避免销毁和重新构建）
     *
     *
     * @private
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.updateMidpoints = function (skipMarker) {
        // 清除旧的中点
        this.removeAllMidPointMarkers(skipMarker);
        // 重新插入
        this.insertMidpointMarkers(skipMarker);
    };
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {string} [iconStyle="border-radius: 50%;background: #ffffff;border: solid 3px red;"]
     * @param {L.PointExpression} [iconSize=[20, 20]]
     * @param {L.DivIconOptions} [options]
     * @return {*}  {L.DivIcon}
     * @memberof LeafletEditPolygon
     */
    LeafletPolygonEditor.prototype.buildMarkerIcon = function (iconStyle, iconSize, options) {
        if (iconStyle === void 0) { iconStyle = "border-radius: 50%;background: #ffffff;border: solid 3px red;"; }
        if (iconSize === void 0) { iconSize = [20, 20]; }
        var defaultIconStyle = "width:".concat(iconSize[0], "px; height: ").concat(iconSize[1], "px;");
        return L.divIcon(__assign({ className: 'edit-polygon-marker', html: "<div style=\"".concat(iconStyle + defaultIconStyle, "\"></div>"), iconSize: iconSize }, options));
    };
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     * @param latlngs 坐标数组
     */
    LeafletPolygonEditor.prototype.reBuildMarkerAndRender = function (latlngs) {
        this.renderLayer(latlngs);
        this.reBuildMarker(latlngs);
        this.updateMidpoints();
    };
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    LeafletPolygonEditor.prototype.reBuildMarker = function (coords) {
        var _this = this;
        // 清除旧的 marker
        this.vertexMarkers.flat(2).forEach(function (m) { return _this.map.removeLayer(m); });
        this.vertexMarkers = [];
        coords.forEach(function (polygon, polygonIndex) {
            var polygonMarkers = [];
            polygon.forEach(function (ring, ringIndex) {
                var ringMarkers = [];
                ring.forEach(function (coord, pointIndex) {
                    var latlng = L.latLng(coord[0], coord[1]);
                    var marker = L.marker(latlng, {
                        draggable: true,
                        icon: _this.buildMarkerIcon()
                    }).addTo(_this.map);
                    // 拖动时更新图形
                    marker.on('drag', function () {
                        // 先进行吸附处理（确定吸附点）
                        var latlng = _this.applySnapWithTarget(marker.getLatLng()).snappedLatLng;
                        marker.setLatLng(latlng);
                        _this.renderLayerFromMarkers();
                        _this.updateMidpoints();
                    });
                    // 拖动结束后记录历史
                    marker.on('dragend', function () {
                        // 1. 移除可能存在的高亮
                        _this.clearSnapHighlights();
                        // 2. 更新历史记录
                        _this.pushHistoryFromMarkers();
                    });
                    // 右键删除点（前提是环点数大于3）
                    marker.on('contextmenu', function () {
                        var ring = _this.vertexMarkers[polygonIndex][ringIndex];
                        if (ring.length > 3) {
                            _this.map.removeLayer(marker);
                            // 这里应该查找当前 marker 的索引，而不是使用捕获时的 pointIndex
                            var currentIndex = ring.findIndex(function (m) { return m === marker; });
                            if (currentIndex !== -1) {
                                ring.splice(currentIndex, 1);
                                _this.renderLayerFromMarkers();
                                _this.pushHistoryFromMarkers();
                                _this.updateMidpoints();
                            }
                        }
                        else {
                            alert('环点数不能少于3个');
                        }
                    });
                    ringMarkers.push(marker);
                });
                polygonMarkers.push(ringMarkers);
            });
            _this.vertexMarkers.push(polygonMarkers);
        });
    };
    LeafletPolygonEditor.prototype.renderLayerFromMarkers = function () {
        var coords = this.vertexMarkers.map(function (polygon) {
            return polygon.map(function (ring) {
                return ring.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
            });
        });
        this.renderLayer(coords);
    };
    LeafletPolygonEditor.prototype.pushHistoryFromMarkers = function () {
        var coords = this.vertexMarkers.map(function (polygon) {
            return polygon.map(function (ring) {
                return ring.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
            });
        });
        this.historyStack.push(coords);
    };
    // #endregion
    // #region 辅助函数
    /**  判断点击事件是否自己身上
     *
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof LeafletEditRectangle
     */
    LeafletPolygonEditor.prototype.isClickOnMyLayer = function (e) {
        if (!this.polygonLayer)
            return false;
        try {
            var polygonGeoJSON = this.polygonLayer.toGeoJSON();
            var turfPoint = point([e.latlng.lng, e.latlng.lat]);
            return booleanPointInPolygon(turfPoint, polygonGeoJSON);
        }
        catch (error) {
            console.error('检查点击图层时出错:', error);
            return false;
        }
    };
    LeafletPolygonEditor.prototype.canConsume = function (e) {
        // 如果是绘制操作，则直接跳过判断，后面的逻辑是给编辑操作准备的
        if (this.currentState === PolygonEditorState.Drawing)
            return true;
        if (!this.isVisible)
            return false;
        var clickIsSelf = this.isClickOnMyLayer(e);
        // 已经激活的实例，确保点击在自己的图层上
        if (this.isActive()) {
            return clickIsSelf;
        }
        else {
            if (clickIsSelf) {
                // console.log('重新激活编辑器');
                this.activate();
                return true;
            }
        }
        return false;
    };
    /** 转换【多边形】的GeoJSON数据为Leaflet可接受的格式
     *
     *
     * @private
     * @param {GeoJSON.Geometry} geometry
     * @return {*}  {(L.LatLngExpression[][] | L.LatLngExpression[][][])}
     * @memberof LeafletPolygonEditor
     */
    LeafletPolygonEditor.prototype.convertGeoJSONToLatLngs = function (geometry) {
        if (geometry.type === 'Polygon') {
            // Polygon: [ [ [lng, lat], [lng, lat], ... ], [hole1], [hole2], ... ]
            return geometry.coordinates.map(function (ring) {
                return ring.map(function (_a) {
                    var lng = _a[0], lat = _a[1];
                    return [lat, lng];
                });
            });
        }
        else if (geometry.type === 'MultiPolygon') {
            // MultiPolygon: [ [ [ [lng, lat], ... ], [hole1], ... ], [ [ ... ] ], ... ]
            return geometry.coordinates.map(function (polygon) {
                return polygon.map(function (ring) {
                    return ring.map(function (_a) {
                        var lng = _a[0], lat = _a[1];
                        return [lat, lng];
                    });
                });
            });
        }
        else {
            throw new Error('不支持的 geometry 类型: ' + geometry.type);
        }
    };
    /**
     * 获取边上某个比例位置的点（例如 1/3、2/3）
     * @param p1 起点
     * @param p2 终点
     * @param ratio 比例（0~1），例如 1/3 = 0.333
     * @returns L.LatLng
     */
    LeafletPolygonEditor.prototype.getFractionalPointOnEdge = function (p1, p2, ratio) {
        var lat = p1.lat + (p2.lat - p1.lat) * ratio;
        var lng = p1.lng + (p2.lng - p1.lng) * ratio;
        return L.latLng(lat, lng);
    };
    return LeafletPolygonEditor;
}(BasePolygonEditor));

// BaseRectangleEditor.ts - 矩形基类
var BaseRectangleEditor = /** @class */ (function (_super) {
    __extends(BaseRectangleEditor, _super);
    function BaseRectangleEditor(map, options) {
        var _this = _super.call(this, map, options) || this;
        _this.vertexMarkers = []; // 存储顶点标记的数组
        _this.historyStack = []; // 历史记录，存储快照
        _this.redoStack = []; // 重做记录，存储快照
        return _this;
    }
    // #region 操作行为
    /** 撤回到上一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BaseRectangleEditor.prototype.undoEdit = function () {
        if (this.historyStack.length < 2)
            return;
        var popItem = this.historyStack.pop(); // 弹出当前状态
        if (popItem)
            this.redoStack.push(popItem); // 用于重做
        var previous = this.historyStack[this.historyStack.length - 1]; // 获取上一个状态
        this.reBuildMarkerAndRender(previous);
    };
    /** 前进到刚才测回的一步
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BaseRectangleEditor.prototype.redoEdit = function () {
        if (!this.redoStack.length)
            return;
        var next = this.redoStack.pop();
        if (next) {
            this.historyStack.push(next);
            this.reBuildMarkerAndRender(next);
        }
    };
    /** 全部撤回（建议写到二次确认的弹窗后触发）
     *
     *
     * @return {*}  {void}
     * @memberof BaseEditor
     */
    BaseRectangleEditor.prototype.resetToInitial = function () {
        if (!this.historyStack.length)
            return;
        // 保存当前状态到重做栈，以便用户可以恢复（简言之，将撤销全部的操作也当作一个快照，方便用户后悔）
        var currentState = this.historyStack[this.historyStack.length - 1];
        var initial = this.historyStack[0];
        // 存储快照
        this.redoStack.push(currentState);
        // 渲染初始状态
        this.reBuildMarkerAndRender(initial);
    };
    /** 完成编辑行为
     *
     *
     * @memberof SimpleBaseEditor
     */
    BaseRectangleEditor.prototype.commitEdit = function () {
        var current = this.vertexMarkers.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
        this.historyStack = [current]; // 读取当前状态作为新的初始快照
        this.redoStack = []; // 清空重做栈（如果有）
        this.exitEditMode();
        // 事件监听停止。
        this.deactivate();
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        this.reset();
    };
    /** 地图状态重置
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    BaseRectangleEditor.prototype.reset = function () {
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
    };
    return BaseRectangleEditor;
}(BaseEditor));

var LeafletRectangleEditor = /** @class */ (function (_super) {
    __extends(LeafletRectangleEditor, _super);
    /** 创建一个矩形编辑类
     *
     * @param {L.Map} map 地图对象
     * @param {LeafletPolylineOptionsExpends} [options={}] 要构建的多边形的样式属性
     * @param {GeoJSON.Geometry} [defaultGeometry] 默认的空间信息
     * @memberof LeafletEditPolygon
     */
    function LeafletRectangleEditor(map, options, defaultGeometry) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this, map, { snap: options === null || options === void 0 ? void 0 : options.snap }) || this;
        _this.rectangleLayer = null;
        // 图层初始化时
        _this.drawLayerStyle = {
            weight: 2,
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
            fill: true, // no fill color means default fill color (gray for `dot` and `circle` markers, transparent for `plus` and `star`)
        };
        _this.tempCoords = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditRectangle
         */
        _this.mapClickEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            // 绘制时的逻辑
            if (_this.currentState === PolygonEditorState.Drawing) {
                if (_this.tempCoords.length === 0) {
                    _this.tempCoords.push(e.latlng);
                }
                else {
                    var finalCoords = [_this.tempCoords[0], e.latlng];
                    _this.renderLayer(finalCoords);
                    _this.tempCoords = []; // 清空吧，虽然不清空也没事，毕竟后面就不使用了
                    _this.reset();
                    // 设置为空闲状态，并发出状态通知- 61 + 
                    _this.updateAndNotifyStateChange(PolygonEditorState.Idle);
                }
            }
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditRectangle
         */
        _this.mapDblClickEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.canConsume(e))
                return;
            if (!_this.rectangleLayer)
                throw new Error('图层实例化失败，无法完成图层创建，请重试');
            var clickedLatLng = e.latlng;
            var polygonGeoJSON = _this.rectangleLayer.toGeoJSON();
            // 判断用户是否点击到了面上，是的话，就开始编辑模式
            var turfPoint = point([clickedLatLng.lng, clickedLatLng.lat]);
            var isInside = booleanPointInPolygon(turfPoint, polygonGeoJSON);
            if (isInside) {
                if (_this.currentState !== PolygonEditorState.Editing) {
                    // 1：禁用双击地图放大功能
                    _this.map.doubleClickZoom.disable();
                    // 2：状态变更，并发出状态通知
                    _this.updateAndNotifyStateChange(PolygonEditorState.Editing);
                    // 3: 设置当前激活态是本实例，因为事件监听和激活态实例是关联的，只有激活的实例才处理事件
                    _this.isActive();
                    // 4: 进入编辑模式
                    _this.enterEditMode();
                }
            }
            else {
                _this.commitEdit();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditRectangle
         */
        _this.mapMouseMoveEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            if (_this.currentState === PolygonEditorState.Drawing) {
                // 1：一个点也没有时，我们移动事件，也什么也不做。
                if (!_this.tempCoords.length)
                    return;
                var lastMoveEndPoint = e.latlng;
                // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
                if (_this.tempCoords.length > 0) {
                    _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
                }
                // 实时渲染
                _this.renderLayer(_this.tempCoords);
            }
            // 编辑时的逻辑
            if (_this.currentState === PolygonEditorState.Editing) {
                // 事件机制1：拖动机制时的事件。
                if (_this.isDraggingPolygon && _this.dragStartLatLng) {
                    var deltaLat_1 = e.latlng.lat - _this.dragStartLatLng.lat;
                    var deltaLng_1 = e.latlng.lng - _this.dragStartLatLng.lng;
                    _this.vertexMarkers.forEach(function (marker) {
                        var old = marker.getLatLng();
                        marker.setLatLng([old.lat + deltaLat_1, old.lng + deltaLng_1]);
                    });
                    var updated = _this.vertexMarkers.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
                    _this.renderLayerFromCoords(updated);
                    _this.dragStartLatLng = e.latlng; // 连续拖动
                }
            }
        };
        /**  地图鼠标抬起事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletEditRectangle
         */
        _this.mapMouseUpEvent = function (e) {
            // 关键：只有激活的实例才处理事件
            if (!_this.isActive())
                return;
            // 条件1: 编辑事件
            if (_this.currentState === PolygonEditorState.Editing) {
                // 条件1-1： 编辑状态下： 拖动面的事件
                if (_this.isDraggingPolygon) {
                    _this.isDraggingPolygon = false;
                    _this.dragStartLatLng = null;
                    _this.map.dragging.enable();
                    var updated = _this.vertexMarkers.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
                    _this.renderLayerFromCoords(updated); // 可更新也可不更新，因为mousemove的最后一次可以理解为已经更新过了
                    _this.historyStack.push(updated);
                    return;
                }
            }
        };
        if (_this.map) {
            // 创建时激活
            _this.activate();
            var existGeometry = !!defaultGeometry;
            // 初始化时，设置绘制状态为true(双击结束绘制时关闭绘制状态，其生命周期到头，且不再改变)，且发出状态通知
            _this.updateAndNotifyStateChange(existGeometry ? PolygonEditorState.Idle : PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            _this.map.getContainer().style.cursor = existGeometry ? 'grab' : 'crosshair';
            // 不需要设置十字光标和禁用双击放大
            existGeometry ? _this.map.doubleClickZoom.enable() : _this.map.doubleClickZoom.disable();
            _this.initLayers(options, existGeometry ? defaultGeometry : undefined);
            _this.initMapEvent(_this.map);
        }
        return _this;
    }
    // 初始化图层
    LeafletRectangleEditor.prototype.initLayers = function (options, defaultGeometry) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polylineOptions = __assign(__assign({ pane: 'overlayPane', layerVisible: true, defaultStyle: this.drawLayerStyle }, this.drawLayerStyle), options);
        var coords = [[181, 181], [182, 182]]; // 默认空图形
        if (defaultGeometry) {
            coords = this.convertRectGeoJSONToLatLngs(defaultGeometry);
        }
        this.rectangleLayer = L.rectangle(coords, polylineOptions);
        this.rectangleLayer.addTo(this.map);
        this.initPolygonEvent();
    };
    /** 实例化矩形图层事件
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.initPolygonEvent = function () {
        var _this = this;
        if (this.rectangleLayer) {
            this.rectangleLayer.on('mousedown', function (e) {
                // 关键：只有激活的实例才处理事件
                if (!_this.isActive())
                    return;
                if (_this.currentState === PolygonEditorState.Editing) {
                    _this.isDraggingPolygon = true;
                    _this.dragStartLatLng = e.latlng;
                    _this.map.dragging.disable();
                }
            });
        }
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.initMapEvent = function (map) {
        // 绘制操作会用到这俩
        map.on('click', this.mapClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
        // 编辑操作会用到双击事件
        map.on('dblclick', this.mapDblClickEvent);
        // 拖动面用的这个
        map.on('mouseup', this.mapMouseUpEvent);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.renderLayer = function (coords) {
        if (this.rectangleLayer) {
            var bounds = L.latLngBounds(coords);
            this.rectangleLayer.setBounds(bounds);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 渲染图层-2
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.renderLayerFromCoords = function (coords) {
        if (!this.rectangleLayer)
            return;
        // 将 number[][] 转换为 L.LatLng[]
        var latlngs = coords.map(function (coord) { return L.latLng(coord[0], coord[1]); });
        this.renderLayer(latlngs);
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.geojson = function () {
        if (this.rectangleLayer) {
            return this.rectangleLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 返回绘制的图层
     *
     * 应用场景1： 地图上存在多个图层实例，每个图层的options属性中有其唯一id标识。现在若要删除其中一个图层，就需要先找到这个图层实例的options中存储的id标识，然后调用后台的删除接口。
     *
     * 应用场景2： 更改图层样式。
     *
     * （简言之： 场景太多，索性直接返回图层对象即可）
     * @return {*}
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.getLayer = function () {
        return this.rectangleLayer;
    };
    /** 控制图层显示
     *
     *
     * @memberof LeafletEditPolygon
     */
    LeafletRectangleEditor.prototype.show = function () {
        var _a;
        this.isVisible = true;
        // 使用用户默认设置的样式，而不是我自定义的！
        (_a = this.rectangleLayer) === null || _a === void 0 ? void 0 : _a.setStyle(__assign(__assign({}, this.rectangleLayer.options.defaultStyle), { layerVisible: true }));
    };
    /** 控制图层隐藏
     *
    *
    * @memberof LeafletEditPolygon
    */
    LeafletRectangleEditor.prototype.hide = function () {
        var _a;
        this.isVisible = false;
        var hideStyle = {
            color: 'red',
            weight: 0,
            fill: false, // no fill color means default fill color (gray for `dot` and `circle` markers, transparent for `plus` and `star`)
            fillColor: 'red', // same color as the line
            fillOpacity: 0,
        };
        (_a = this.rectangleLayer) === null || _a === void 0 ? void 0 : _a.setStyle(__assign(__assign({}, hideStyle), { layerVisible: false }));
        // ✅ 退出编辑状态（若存在）
        if (this.currentState === PolygonEditorState.Editing) {
            this.exitEditMode();
            this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        }
    };
    /** 设置图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    LeafletRectangleEditor.prototype.setVisible = function (visible) {
        if (visible) {
            this.show();
        }
        else {
            this.hide();
        }
    };
    /** 获取图层显隐
     *
     *
     * @param {boolean} visible
     * @memberof LeafletEditPolygon
     */
    LeafletRectangleEditor.prototype.getLayerVisible = function () {
        var _a;
        return ((_a = this.rectangleLayer) === null || _a === void 0 ? void 0 : _a.options).layerVisible;
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.destroy = function () {
        // #region 1：绘制图层用到的内容
        this.destroyLayer();
        // #endregion
        // #region 2：编辑模式用到的内容
        // 关闭事件监听内容
        this.deactivate();
        // 编辑模式的内容也重置
        this.exitEditMode();
        // #endregion
        // #region 3：吸附用到的内容
        this.cleanupSnapResources();
        // #endregion
        // #region4：地图相关内容处理（关闭事件监听，恢复部分交互功能【缩放、鼠标手势】）
        this.offMapEvent(this.map);
        this.reset();
        // #endregion
        // #region5：清除类自身绑定的相关事件
        this.clearAllStateListeners();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
        // #endregion
    };
    /** 销毁绘制的图层
     *
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.destroyLayer = function () {
        // 1.1清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 1.2从地图中移除图层
        if (this.rectangleLayer) {
            this.rectangleLayer.remove();
            this.rectangleLayer = null;
        }
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.offMapEvent = function (map) {
        // 绘制操作会用到这俩
        map.off('click', this.mapClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
        // 编辑操作会用到双击事件
        map.off('dblclick', this.mapDblClickEvent);
        // 拖动面用的这个
        map.off('mouseup', this.mapMouseUpEvent);
    };
    // #endregion
    // #region 编辑用到的工具函数
    /** 进入编辑模式
     * 1: 更新编辑状态变量
     * 2: 构建marker点
     * 3: 给marker添加拖动事件
     *
     * @private
     * @return {*}  {void}
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.enterEditMode = function () {
        var _a;
        if (!this.rectangleLayer)
            return;
        var bounds = this.rectangleLayer.getBounds();
        var corners = [
            bounds.getNorthWest(), // 左上
            bounds.getNorthEast(), // 右上
            bounds.getSouthEast(), // 右下
            bounds.getSouthWest() // 左下
        ];
        var coords = corners.map(function (p) { return [p.lat, p.lng]; });
        // 记录初始快照
        this.historyStack.push(coords);
        // 清空重做栈
        this.redoStack = [];
        // ✅ 设置吸附源（排除当前图层） 
        var otherIndices = this.collectAllOtherGeometryIndices(this.map, this.rectangleLayer);
        (_a = this.snapController) === null || _a === void 0 ? void 0 : _a.setGeometrySources(otherIndices);
        // 渲染每个顶点为可拖动 marker
        this.reBuildMarker(coords);
    };
    /** 退出编辑模式
     * 进入编辑模式时，事件内部绑定了三个事件（drag、dragend、contextmenu），
     * 事件绑定之后是需要解绑的，不过Leaflet 的事件绑定是和对象实例绑定的，
     * 一旦你调用 map.removeLayer(marker)，
     * 这个 marker 就被销毁了，它的事件也随之失效，
     * 所以你只需要在 exitEditMode() 中清理掉 vertexMarkers，
     * 就可以完成“事件解绑”的效果
     *
     * @private
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.exitEditMode = function () {
        var _this = this;
        // 移除真实拐点Marker
        this.vertexMarkers.forEach(function (marker) {
            _this.map.removeLayer(marker); // 移除 marker，会默认清除Marker自身的事件
        });
        this.vertexMarkers = [];
    };
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {string} [iconStyle="border-radius: 50%;background: #ffffff;border: solid 3px red;"]
     * @param {L.PointExpression} [iconSize=[20, 20]]
     * @param {L.DivIconOptions} [options]
     * @return {*}  {L.DivIcon}
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.buildMarkerIcon = function (iconStyle, iconSize, options) {
        if (iconStyle === void 0) { iconStyle = "border-radius: 50%;background: #ffffff;border: solid 3px red;"; }
        if (iconSize === void 0) { iconSize = [20, 20]; }
        var defaultIconStyle = "width:".concat(iconSize[0], "px; height: ").concat(iconSize[1], "px;");
        return L.divIcon(__assign({ className: 'edit-polygon-marker', html: "<div style=\"".concat(iconStyle + defaultIconStyle, "\"></div>"), iconSize: iconSize }, options));
    };
    /** 根据坐标重建 marker 和图形 + 重新渲染图层
     *
     * @param latlngs 坐标数组
     */
    LeafletRectangleEditor.prototype.reBuildMarkerAndRender = function (latlngs) {
        // 1. 重新渲染矩形
        this.renderLayerFromCoords(latlngs);
        // 2. 重新构建顶点标记
        this.reBuildMarker(latlngs);
    };
    /** 根据坐标重建 marker 和图形
     *
     * @param latlngs 坐标数组
     */
    LeafletRectangleEditor.prototype.reBuildMarker = function (latlngs) {
        var _this = this;
        // 清除旧 marker
        this.vertexMarkers.forEach(function (m) { return _this.map.removeLayer(m); });
        this.vertexMarkers = [];
        // 确保有4个顶点（矩形的四个角）
        var corners;
        if (latlngs.length === 2) {
            // 如果是2个点（对角点），计算4个角
            var coord1 = latlngs[0], coord2 = latlngs[1];
            var lat1 = coord1[0], lng1 = coord1[1];
            var lat2 = coord2[0], lng2 = coord2[1];
            var top_1 = Math.max(lat1, lat2);
            var bottom = Math.min(lat1, lat2);
            var left = Math.min(lng1, lng2);
            var right = Math.max(lng1, lng2);
            corners = [
                L.latLng(top_1, left), // 左上
                L.latLng(top_1, right), // 右上
                L.latLng(bottom, right), // 右下
                L.latLng(bottom, left) // 左下
            ];
        }
        else if (latlngs.length === 4) {
            // 如果已经是4个点，直接使用
            corners = latlngs.map(function (coord) { return L.latLng(coord[0], coord[1]); });
        }
        else {
            console.error('无效的坐标数量:', latlngs.length);
            return;
        }
        // 构建4个顶点的 marker
        corners.forEach(function (latlng, index) {
            var marker = L.marker(latlng, {
                draggable: true,
                icon: _this.buildMarkerIcon()
            }).addTo(_this.map);
            _this.vertexMarkers.push(marker);
            _this.bindMarkerEvents(marker, index);
        });
    };
    /** 绑定 marker 事件 */
    LeafletRectangleEditor.prototype.bindMarkerEvents = function (marker, index) {
        var _this = this;
        marker.on('drag', function () {
            // 应用吸附
            var newLatLng = _this.applySnapWithTarget(marker.getLatLng()).snappedLatLng;
            // 更新当前拖动的 marker
            marker.setLatLng(newLatLng);
            // 重新计算矩形的四个角
            _this.updateRectangleCorners(index, newLatLng);
        });
        marker.on('dragend', function () {
            // 拖动结束时清除吸附高亮
            _this.clearSnapHighlights();
            // 更新历史记录
            var updated = _this.vertexMarkers.map(function (m) { return [m.getLatLng().lat, m.getLatLng().lng]; });
            _this.historyStack.push(__spreadArray([], updated, true));
        });
    };
    /** 更新矩形角点 */
    LeafletRectangleEditor.prototype.updateRectangleCorners = function (draggedIndex, newLatLng) {
        var _this = this;
        // 获取所有当前坐标
        var currentCorners = this.vertexMarkers.map(function (m) { return m.getLatLng(); });
        // 根据拖动的角点重新计算矩形
        var newCorners;
        if (draggedIndex === 0) { // 左上角
            newCorners = [
                newLatLng,
                L.latLng(newLatLng.lat, currentCorners[1].lng),
                L.latLng(currentCorners[2].lat, currentCorners[1].lng),
                L.latLng(currentCorners[2].lat, newLatLng.lng)
            ];
        }
        else if (draggedIndex === 1) { // 右上角
            newCorners = [
                L.latLng(newLatLng.lat, currentCorners[0].lng),
                newLatLng,
                L.latLng(currentCorners[2].lat, newLatLng.lng),
                L.latLng(currentCorners[2].lat, currentCorners[0].lng)
            ];
        }
        else if (draggedIndex === 2) { // 右下角
            newCorners = [
                L.latLng(currentCorners[0].lat, currentCorners[0].lng),
                L.latLng(currentCorners[0].lat, newLatLng.lng),
                newLatLng,
                L.latLng(newLatLng.lat, currentCorners[0].lng)
            ];
        }
        else { // 左下角
            newCorners = [
                L.latLng(currentCorners[0].lat, newLatLng.lng),
                L.latLng(currentCorners[0].lat, currentCorners[1].lng),
                L.latLng(newLatLng.lat, currentCorners[1].lng),
                newLatLng
            ];
        }
        // 更新所有 marker 位置
        newCorners.forEach(function (latlng, i) {
            _this.vertexMarkers[i].setLatLng(latlng);
        });
        // 重新渲染矩形
        this.renderLayer(newCorners);
    };
    // #endregion
    // #region 辅助函数
    /**  判断点击事件是否自己身上
     *
     *
     *
     * @private
     * @param {L.LeafletMouseEvent} e
     * @return {*}  {boolean}
     * @memberof LeafletEditRectangle
     */
    LeafletRectangleEditor.prototype.isClickOnMyLayer = function (e) {
        if (!this.rectangleLayer)
            return false;
        try {
            var polygonGeoJSON = this.rectangleLayer.toGeoJSON();
            var turfPoint = point([e.latlng.lng, e.latlng.lat]);
            return booleanPointInPolygon(turfPoint, polygonGeoJSON);
        }
        catch (error) {
            console.error('检查点击图层时出错:', error);
            return false;
        }
    };
    LeafletRectangleEditor.prototype.canConsume = function (e) {
        // 如果是绘制操作，则直接跳过判断，后面的逻辑是给编辑操作准备的
        if (this.currentState === PolygonEditorState.Drawing)
            return true;
        if (!this.isVisible)
            return false;
        var clickIsSelf = this.isClickOnMyLayer(e);
        // 已经激活的实例，确保点击在自己的图层上
        if (this.isActive()) {
            return clickIsSelf;
        }
        else {
            if (clickIsSelf) {
                // console.log('重新激活编辑器');
                this.activate();
                return true;
            }
        }
        return false;
    };
    /** 转换【矩形】的geojson-经纬度坐标
     *
     *
     * @private
     * @param {GeoJSON.Geometry} geometry
     * @return {*}  {L.LatLngBoundsExpression}
     * @memberof LeafletRectangleEditor
     */
    LeafletRectangleEditor.prototype.convertRectGeoJSONToLatLngs = function (geometry) {
        if (geometry.type === 'Polygon') {
            var coords = geometry.coordinates[0]; // [[lng, lat], ...]
            var lats = coords.map(function (c) { return c[1]; });
            var lngs = coords.map(function (c) { return c[0]; });
            var south = Math.min.apply(Math, lats);
            var north = Math.max.apply(Math, lats);
            var west = Math.min.apply(Math, lngs);
            var east = Math.max.apply(Math, lngs);
            return [[south, west], [north, east]];
        }
        else {
            throw new Error('不支持的 geometry 类型: ' + geometry.type);
        }
    };
    return LeafletRectangleEditor;
}(BaseRectangleEditor));

var HECTARE_THRESHOLD = 10000; // 1公顷 = 10000平方米
var SQUARE_KILOMETER_THRESHOLD = 1000000; // 1平方公里 = 1000000平方米
// 单位映射表
var UNIT_MAP = {
    'zh': {
        'squareMeter': '平方米',
        'hectare': '公顷',
        'squareKilometer': '平方公里'
    },
    'en': {
        'squareMeter': 'm²',
        'hectare': 'ha',
        'squareKilometer': 'km²'
    }
};
var LeafletArea = /** @class */ (function () {
    function LeafletArea(map, measureOptions, options) {
        if (measureOptions === void 0) { measureOptions = { precision: 2, lang: 'zh' }; }
        if (options === void 0) { options = {}; }
        var _this = this;
        this.polygonLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
            fillColor: "red", // 设置填充颜色
            fillOpacity: 0.3, // 设置填充透明度
        };
        // marker图层
        this.markerLayer = null;
        this.tempCoords = [];
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletArea
         */
        this.mapClickEvent = function (e) {
            _this.tempCoords.push([e.latlng.lat, e.latlng.lng]);
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletArea
         */
        this.mapDblClickEvent = function (e) {
            if (_this.polygonLayer) {
                // 渲染图层, 先剔除重复坐标，双击事件实际触发了2次单机事件，所以，需要剔除重复坐标
                var finalCoords = _this.deduplicateCoordinates(_this.tempCoords);
                _this.renderLayer(__spreadArray(__spreadArray([], finalCoords, true), [finalCoords[0]], false));
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletArea
         */
        this.mapMouseMoveEvent = function (e) {
            if (!_this.tempCoords.length)
                return;
            var lastMoveEndPoint = [e.latlng.lat, e.latlng.lng];
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (_this.tempCoords.length === 1) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 3：有两个及以上的点时，我们删掉在只有一个点时，塞入的最后移动的那个点，也就是前一个if语句中塞入的那个点，然后添加此刻移动结束的点。
            var fixedPoints = _this.tempCoords.slice(0, _this.tempCoords.length - 1); // 除最后一个点外的所有点
            _this.tempCoords = __spreadArray(__spreadArray([], fixedPoints, true), [lastMoveEndPoint], false);
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        this.measureOptions = measureOptions;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletArea.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180], [-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polygonOptions = __assign(__assign({ pane: 'overlayPane' }, this.drawLayerStyle), options);
        this.polygonLayer = L.polygon([[181, 181], [181, 181], [181, 181], [181, 181]], polygonOptions);
        this.polygonLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletArea
     */
    LeafletArea.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('dblclick', this.mapDblClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletArea
     */
    LeafletArea.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 初始化时，设置绘制状态为true，且发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletArea
     */
    LeafletArea.prototype.renderLayer = function (coords) {
        if (this.polygonLayer) {
            this.polygonLayer.setLatLngs(coords);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
        // 无论鼠标移动，还是双击结束绘制，这个事件都会触发，所以我索性直接在这个组件中计算面积信息了，这样就不用考虑在鼠标移动事件和双击事件中写2遍了。
        if (coords.length > 2) {
            if (this.markerLayer) {
                this.markerLayer.remove();
                this.markerLayer = null;
            }
            // 这里因为mousemove的缘故，我不能确定提供的坐标点的数量是否包含了“结束点”：也就是结束点和第一个点要相同，索性，我再添加一遍
            var polygonCoords = __spreadArray(__spreadArray([], coords, true), [coords[0]], false);
            var turfPolygon = polygon([polygonCoords]);
            var areaNum = area(turfPolygon);
            var areaInfo = this.formatArea(areaNum, this.measureOptions);
            var areaCenter = center(turfPolygon);
            var markerCenter = areaCenter.geometry.coordinates;
            var markerOptions = {
                pane: 'markerPane',
                icon: this.measureMarkerIcon(areaInfo),
            };
            this.markerLayer = L.marker(markerCenter, markerOptions);
            this.markerLayer.addTo(this.map);
            // this.markerArr.push(marker);
        }
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletArea
     */
    LeafletArea.prototype.geojson = function () {
        if (this.polygonLayer) {
            return this.polygonLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletArea
     */
    LeafletArea.prototype.destroy = function () {
        if (this.polygonLayer) {
            this.polygonLayer.remove();
            this.polygonLayer = null;
        }
        if (this.markerLayer) {
            this.markerLayer.remove();
            this.markerLayer = null;
        }
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletArea
     */
    LeafletArea.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('dblclick', this.mapDblClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {FormattedArea} area
     * @return {*}  {L.DivIcon}
     * @memberof LeafletArea
     */
    LeafletArea.prototype.measureMarkerIcon = function (area) {
        return L.divIcon({
            className: 'measure-area-marker',
            html: "<div style=\"width: 10px;height: 10px; text-align: center; position: relative;\">\n                            <!-- \u6784\u5EFA\u5C0F\u5706\u70B9 -->\n                            <div style=\"width: 10px;height: 10px;border-radius: 50%;background: #ffffff;border: solid 2px red; position: absolute;left: 1px;top: 1px;\"></div>\n                            <!-- \u4E0B\u9762\u7684\u5185\u5BB9\u5C55\u793A\u6587\u5B57 -->\n                            <div style=\"width: max-content; padding: 3px; border: solid 1px red; background: #ffffff;  position: absolute; left: 10px; top: 10px;\">\n                                ".concat(area.val, " ").concat(area.unit, "\n                            </div>\n                        </div>")
        });
    };
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    LeafletArea.prototype.deduplicateCoordinates = function (coordinates, precision) {
        if (precision === void 0) { precision = 6; }
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return [];
        }
        var result = [coordinates[0]]; // 总是保留第一个坐标
        for (var i = 1; i < coordinates.length; i++) {
            var current = coordinates[i];
            var previous = coordinates[i - 1];
            // 检查当前坐标是否与上一个坐标相同（在指定精度下）
            var isDuplicate = current[0].toFixed(precision) === previous[0].toFixed(precision) &&
                current[1].toFixed(precision) === previous[1].toFixed(precision);
            if (!isDuplicate) {
                result.push(current);
            }
        }
        return result;
    };
    // #endregion
    // #region 面积单位换算函数，内容偏多，这块不用看，知道有面积计算就行
    /**
     * 面积单位转换函数
     * @param {number} squareMeters - 输入的平方米数值
     * @returns {FormattedArea} 格式化后的面积对象
     */
    LeafletArea.prototype.formatArea = function (squareMeters, options) {
        var _a = options.lang, lang = _a === void 0 ? 'zh' : _a, _b = options.precision, precision = _b === void 0 ? 2 : _b;
        var units = UNIT_MAP[lang];
        // 参数验证
        if (squareMeters < 0) {
            throw new Error('面积值不能为负数');
        }
        if (precision < 0 || precision > 10) {
            throw new Error('精度值必须在0-10之间');
        }
        if (squareMeters >= SQUARE_KILOMETER_THRESHOLD) {
            // 转换为平方千米并保留2位小数
            var squareKilometers = squareMeters / SQUARE_KILOMETER_THRESHOLD;
            return {
                val: parseFloat(squareKilometers.toFixed(precision)),
                unit: units.squareKilometer
            };
        }
        else if (squareMeters >= HECTARE_THRESHOLD) {
            // 转换为公顷并保留2位小数
            var hectares = squareMeters / HECTARE_THRESHOLD;
            return {
                val: parseFloat(hectares.toFixed(precision)),
                unit: units.hectare
            };
        }
        else {
            // 保持平方米并保留2位小数
            return {
                val: parseFloat(squareMeters.toFixed(precision)),
                unit: units.squareMeter
            };
        }
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletArea
     */
    LeafletArea.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletArea.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletArea.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletArea
     */
    LeafletArea.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletArea;
}());

var LeafletDistance = /** @class */ (function () {
    /**
     * 创建一个测量距离的类
     * @param {L.Map} map 地图对象
     * @param {distanceOptions} [measureOptions={ units: 'meters' }] turf库的测量距离的options选项
     * @param {L.PolylineOptions} [options={}] 测量距离时的polyline样式，允许用户自定义
     * @memberof LeafletDistance
     */
    function LeafletDistance(map, measureOptions, options) {
        if (measureOptions === void 0) { measureOptions = { units: 'meters', precision: 2, lang: 'zh' }; }
        if (options === void 0) { options = {}; }
        var _this = this;
        this.lineLayer = null;
        // 图层初始化时
        this.drawLayerStyle = {
            color: 'red', // 设置边线颜色
        };
        this.tempCoords = [];
        this.markerArr = []; // 用于存放临时生成的marker弹窗
        this.totalDistance = 0;
        // 1：我们需要记录当前状态是处于绘制状态--见：currentState变量
        this.currentState = PolygonEditorState.Idle; // 默认空闲状态
        // 2：我们需要一个数组，存储全部的监听事件，然后在状态改变时，触发所有这些事件的监听回调！
        this.stateListeners = [];
        // #region 工具函数，点图层的逻辑只需要看上面的内容就行了
        /**  地图点击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletDistance
         */
        this.mapClickEvent = function (e) {
            _this.tempCoords.push([e.latlng.lat, e.latlng.lng]);
            // todo：每次点击后，在该处添加popup弹窗
            _this.calcDistanceAndCreatePopup(_this.tempCoords);
        };
        /**  地图双击事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletDistance
         */
        this.mapDblClickEvent = function (e) {
            if (_this.lineLayer) {
                // 渲染图层, 先剔除重复坐标，双击事件实际触发了2次单机事件，所以，需要剔除重复坐标
                var finalCoords = _this.deduplicateCoordinates(_this.tempCoords);
                _this.renderLayer(finalCoords);
                _this.reset();
            }
        };
        /**  地图鼠标移动事件，用于设置点的位置
         *
         *
         * @private
         * @param {L.LeafletMouseEvent} e
         * @memberof LeafletDistance
         */
        this.mapMouseMoveEvent = function (e) {
            if (!_this.tempCoords.length)
                return;
            var lastMoveEndPoint = [e.latlng.lat, e.latlng.lng];
            // 1：一个点也没有时，我们移动事件，也什么也不做。
            // 2：只有一个点时，我们只保留第一个点和此刻移动结束的点。
            if (_this.tempCoords.length === 1) {
                _this.tempCoords = [_this.tempCoords[0], lastMoveEndPoint];
            }
            // 3：有两个及以上的点时，我们删掉在只有一个点时，塞入的最后移动的那个点，也就是前一个if语句中塞入的那个点，然后添加此刻移动结束的点。
            var fixedPoints = _this.tempCoords.slice(0, _this.tempCoords.length - 1); // 除最后一个点外的所有点
            _this.tempCoords = __spreadArray(__spreadArray([], fixedPoints, true), [lastMoveEndPoint], false);
            // 实时渲染
            _this.renderLayer(_this.tempCoords);
        };
        this.map = map;
        this.measureOptions = measureOptions;
        if (this.map) {
            // 初始化时，设置绘制状态为true，且发出状态通知
            this.updateAndNotifyStateChange(PolygonEditorState.Drawing);
            this.totalDistance = 0;
            // 鼠标手势设置为十字
            this.map.getContainer().style.cursor = 'crosshair';
            // 禁用双击地图放大功能
            this.map.doubleClickZoom.disable();
            this.initLayers(options);
            this.initMapEvent(this.map);
        }
    }
    // 初始化图层
    LeafletDistance.prototype.initLayers = function (options) {
        // 试图给一个非法的经纬度，来测试是否leaflet直接抛出异常。如果不行，后续使用[[-90, -180], [-90, -180]]坐标，也就是页面的左下角
        var polylineOptions = __assign(__assign({ pane: 'overlayPane' }, this.drawLayerStyle), options);
        this.lineLayer = L.polyline([[181, 181], [182, 182]], polylineOptions);
        this.lineLayer.addTo(this.map);
    };
    /** 初始化地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.initMapEvent = function (map) {
        map.on('click', this.mapClickEvent);
        map.on('dblclick', this.mapDblClickEvent);
        map.on('mousemove', this.mapMouseMoveEvent);
    };
    /** 状态重置
     *
     *
     * @private
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.reset = function () {
        // 清空坐标把，因为没什么用了
        this.tempCoords = [];
        // 设置完毕就关闭地图事件监听
        this.offMapEvent(this.map);
        this.map.getContainer().style.cursor = 'grab';
        // 恢复双击地图放大事件
        this.map.doubleClickZoom.enable();
        // 设置为空闲状态，并发出状态通知
        this.updateAndNotifyStateChange(PolygonEditorState.Idle);
    };
    /** 渲染图层
     *
     *
     * @private
     * @param { [][]} coords
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.renderLayer = function (coords) {
        if (this.lineLayer) {
            this.lineLayer.setLatLngs(coords);
        }
        else {
            throw new Error('图层不存在，无法渲染');
        }
    };
    /** 返回图层的空间信息
     *
     * 担心用户在绘制后，想要获取到点位的经纬度信息，遂提供吐出geojson的方法
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.geojson = function () {
        if (this.lineLayer) {
            return this.lineLayer.toGeoJSON();
        }
        else {
            throw new Error("未捕获到图层，无法获取到geojson数据");
        }
    };
    /** 销毁图层，从地图中移除图层
     *
     *
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.destroy = function () {
        if (this.lineLayer) {
            this.lineLayer.remove();
            this.lineLayer = null;
        }
        if (this.markerArr && this.markerArr.length) {
            this.markerArr.forEach(function (marker) {
                marker.remove();
            });
        }
        this.markerArr = [];
        this.reset();
    };
    /** 关闭地图事件监听
     *
     *
     * @private
     * @param {L.Map} map 地图对象
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.offMapEvent = function (map) {
        map.off('click', this.mapClickEvent);
        map.off('dblclick', this.mapDblClickEvent);
        map.off('mousemove', this.mapMouseMoveEvent);
    };
    /**
     * 简单坐标去重 - 剔除连续重复坐标
     * @param {Array} coordinates - 坐标数组 [[lat, lng], [lat, lng], ...]
     * @param {number} precision - 精度（小数位数），默认6位
     * @returns {Array} 去重后的坐标数组
     */
    LeafletDistance.prototype.deduplicateCoordinates = function (coordinates, precision) {
        if (precision === void 0) { precision = 6; }
        if (!Array.isArray(coordinates) || coordinates.length === 0) {
            return [];
        }
        var result = [coordinates[0]]; // 总是保留第一个坐标
        for (var i = 1; i < coordinates.length; i++) {
            var current = coordinates[i];
            var previous = coordinates[i - 1];
            // 检查当前坐标是否与上一个坐标相同（在指定精度下）
            var isDuplicate = current[0].toFixed(precision) === previous[0].toFixed(precision) &&
                current[1].toFixed(precision) === previous[1].toFixed(precision);
            if (!isDuplicate) {
                result.push(current);
            }
        }
        return result;
    };
    /**
     * 计算距离并创建popup
     *
     * @private
     * @param {number[][]} coordinates
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.calcDistanceAndCreatePopup = function (coordinates) {
        var finalCoords = this.deduplicateCoordinates(this.tempCoords);
        var waitingMeasure = finalCoords.slice(-2);
        if (waitingMeasure.length === 1) {
            var markerOptions = {
                pane: 'markerPane',
                icon: this.measureMarkerIcon(this.measureOptions.lang === 'zh' ? '起点' : 'start point'),
            };
            // 定义popup起点
            var marker = L.marker(waitingMeasure[0], markerOptions).addTo(this.map);
            this.markerArr.push(marker);
        }
        if (waitingMeasure.length >= 2) {
            // 开始计算
            var measureDistance = distance(waitingMeasure[0], waitingMeasure[1], this.measureOptions);
            this.totalDistance += measureDistance;
            // 使用新的格式化函数
            var formatted = this.formatDistance(this.totalDistance, this.measureOptions);
            var markerOptions = {
                pane: 'markerPane',
                icon: this.measureMarkerIcon(formatted),
            };
            var marker = L.marker(waitingMeasure[1], markerOptions).addTo(this.map);
            this.markerArr.push(marker);
        }
    };
    /** 动态生成marker图标(天地图应该是构建的点图层+marker图层两个)
     *
     *
     * @private
     * @param {(number | string)} distance
     * @return {*}  {L.DivIcon}
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.measureMarkerIcon = function (distance) {
        return L.divIcon({
            className: 'measure-distance-marker',
            html: "<div style=\"width: 10px;height: 10px; text-align: center; position: relative;\">\n                        <!-- \u6784\u5EFA\u5C0F\u5706\u70B9 -->\n                        <div style=\"width: 10px;height: 10px;border-radius: 50%;background: #ffffff;border: solid 2px red; position: absolute;left: 1px;top: 1px;\"></div>\n                        <!-- \u4E0B\u9762\u7684\u5185\u5BB9\u5C55\u793A\u6587\u5B57 -->\n                        <div style=\"width: max-content; padding: 3px; border: solid 1px red; background: #ffffff;  position: absolute; left: 10px; top: 10px;\">\n                            ".concat(typeof distance === 'string' ? distance : "".concat(distance.val, " ").concat(distance.unit), "\n                        </div>\n                    </div>")
        });
    };
    // #endregion
    // #region 距离单位换算函数，内容偏多，这块不用看，知道有距离计算就行
    /**
     * 格式化距离单位
     * @param value 原始距离值
     * @param unit 原始单位
     * @param options 格式化选项
     * @returns 格式化后的距离对象
     */
    LeafletDistance.prototype.formatDistance = function (value, options) {
        var _a = options.lang, lang = _a === void 0 ? 'zh' : _a, _b = options.precision, precision = _b === void 0 ? 2 : _b, units = options.units;
        // 先统一处理同义词
        var normalizedUnit = this.normalizeUnit(units);
        switch (normalizedUnit) {
            // 国际单位制 - 米/千米系列
            case 'meters':
                return this.formatMetricSystem(value, 'meters', lang, precision);
            case 'kilometers':
                return this.formatMetricSystem(value * 1000, 'meters', lang, precision);
            case 'centimeters':
                return this.formatMetricSystem(value / 100, 'meters', lang, precision);
            case 'millimeters':
                return this.formatMetricSystem(value / 1000, 'meters', lang, precision);
            // 英里
            case 'miles':
                return {
                    val: Number(value.toFixed(precision)),
                    unit: this.getUnitName('miles', lang)
                };
            // 海里
            case 'nauticalmiles':
                return {
                    val: Number(value.toFixed(precision)),
                    unit: this.getUnitName('nauticalmiles', lang)
                };
            // 英尺
            case 'feet':
                return this.formatFeet(value, lang, precision);
            // 码
            case 'yards':
                return this.formatYards(value, lang, precision);
            // 英寸
            case 'inches':
                return this.formatInches(value, lang, precision);
            // 角度单位（特殊处理）
            case 'radians':
                return {
                    val: Number(value.toFixed(4)), // 角度单位固定4位小数
                    unit: this.getUnitName('radians', lang)
                };
            case 'degrees':
                return {
                    val: Number(value.toFixed(4)), // 角度单位固定4位小数
                    unit: this.getUnitName('degrees', lang)
                };
            default:
                return {
                    val: Number(value.toFixed(precision)),
                    unit: this.getUnitName(normalizedUnit, lang)
                };
        }
    };
    /** 统一处理单位同义词 */
    LeafletDistance.prototype.normalizeUnit = function (unit) {
        var synonymMap = {
            'metres': 'meters',
            'millimetres': 'millimeters',
            'centimetres': 'centimeters',
            'kilometres': 'kilometers'
        };
        return synonymMap[unit] || unit;
    };
    /** 获取单位名称（支持中英文） */
    LeafletDistance.prototype.getUnitName = function (unit, lang) {
        var _a;
        var unitMap = {
            'meters': { en: 'meters', zh: '米' },
            'kilometers': { en: 'kilometers', zh: '公里' },
            'centimeters': { en: 'centimeters', zh: '厘米' },
            'millimeters': { en: 'millimeters', zh: '毫米' },
            'miles': { en: 'miles', zh: '英里' },
            'nauticalmiles': { en: 'nautical miles', zh: '海里' },
            'feet': { en: 'feet', zh: '英尺' },
            'yards': { en: 'yards', zh: '码' },
            'inches': { en: 'inches', zh: '英寸' },
            'radians': { en: 'radians', zh: '弧度' },
            'degrees': { en: 'degrees', zh: '度' }
        };
        return ((_a = unitMap[unit]) === null || _a === void 0 ? void 0 : _a[lang]) || unit;
    };
    /** 处理国际单位制换算 */
    LeafletDistance.prototype.formatMetricSystem = function (meters, originalUnit, lang, precision) {
        if (meters >= 1000) {
            // 转换为公里
            return {
                val: Number((meters / 1000).toFixed(precision)),
                unit: this.getUnitName('kilometers', lang)
            };
        }
        else {
            // 保持为米，根据原始单位决定显示
            if (originalUnit === 'meters') {
                return {
                    val: Number(meters.toFixed(precision)),
                    unit: this.getUnitName('meters', lang)
                };
            }
            else {
                // 从厘米/毫米转换过来的，直接显示米
                return {
                    val: Number(meters.toFixed(precision)),
                    unit: this.getUnitName('meters', lang)
                };
            }
        }
    };
    /** 处理英尺换算 */
    LeafletDistance.prototype.formatFeet = function (feet, lang, precision) {
        if (feet < 5280) {
            // 显示英尺（取整）
            return {
                val: lang === 'en' ? Math.round(feet) : Number(feet.toFixed(precision)),
                unit: this.getUnitName('feet', lang)
            };
        }
        else {
            // 转换为英里
            return {
                val: Number((feet / 5280).toFixed(precision)),
                unit: this.getUnitName('miles', lang)
            };
        }
    };
    /** 处理码换算 */
    LeafletDistance.prototype.formatYards = function (yards, lang, precision) {
        if (yards < 1760) {
            // 显示码（取整）
            return {
                val: lang === 'en' ? Math.round(yards) : Number(yards.toFixed(precision)),
                unit: this.getUnitName('yards', lang)
            };
        }
        else {
            // 转换为英里
            return {
                val: Number((yards / 1760).toFixed(precision)),
                unit: this.getUnitName('miles', lang)
            };
        }
    };
    /** 处理英寸换算 */
    LeafletDistance.prototype.formatInches = function (inches, lang, precision) {
        if (inches < 12) {
            // 显示英寸（取整）
            return {
                val: lang === 'en' ? Math.round(inches) : Number(inches.toFixed(precision)),
                unit: this.getUnitName('inches', lang)
            };
        }
        else if (inches < 63360) {
            // 转换为英尺
            return {
                val: Number((inches / 12).toFixed(lang === 'en' ? 1 : precision)),
                unit: this.getUnitName('feet', lang)
            };
        }
        else {
            // 转换为英里
            return {
                val: Number((inches / 63360).toFixed(precision)),
                unit: this.getUnitName('miles', lang)
            };
        }
    };
    // #endregion
    // #region 绘制状态改变时的事件回调
    /** 【外部使用】的监听器，用于监听状态改变事件
     *
     *
     * @param {(state: PolygonEditorState) => void} listener
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.onStateChange = function (listener) {
        // 存储回调事件并立刻触发一次
        this.stateListeners.push(listener);
        // 立即回调当前状态
        listener(this.currentState);
    };
    /** 添加移除单个监听器的方法
     *
     */
    LeafletDistance.prototype.offStateChange = function (listener) {
        var index = this.stateListeners.indexOf(listener);
        if (index > -1) {
            this.stateListeners.splice(index, 1);
        }
    };
    /** 清空所有状态监听器
     *
     */
    LeafletDistance.prototype.clearAllStateListeners = function () {
        this.stateListeners = [];
    };
    /** 内部使用，状态改变时，触发所有的监听事件
     *
     *
     * @private
     * @memberof LeafletDistance
     */
    LeafletDistance.prototype.updateAndNotifyStateChange = function (status) {
        var _this = this;
        this.currentState = status;
        this.stateListeners.forEach(function (fn) { return fn(_this.currentState); });
    };
    return LeafletDistance;
}());

// src/index.ts
// UMD需要默认导出
var LeafletGeoTools = {
    LeafletCircle: LeafletCircle,
    MarkerPoint: MarkerPoint,
    LeafletPolygon: LeafletPolygon,
    LeafletPolyline: LeafletPolyline,
    LeafletRectangle: LeafletRectangle,
    LeafletArea: LeafletArea,
    LeafletDistance: LeafletDistance,
    LeafletRectangleEditor: LeafletRectangleEditor,
    LeafletPolygonEditor: LeafletPolygonEditor,
    // ... 其他类
};

export { LeafletArea, LeafletCircle, LeafletDistance, LeafletPolygon, LeafletPolygonEditor, LeafletPolyline, LeafletRectangle, LeafletRectangleEditor, MarkerPoint, PolygonEditorState, LeafletGeoTools as default };
