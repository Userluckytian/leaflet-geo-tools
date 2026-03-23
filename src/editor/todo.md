---

   Author: 
   Date: 2026-03-19 11:51:15
   Description: 剩余内容
   参考网站: https://www.runoob.com/markdown/md-advance.html

---


### 1，markerPointEditor.ts 
因为不支持多marker的形式，且因为不支持编辑呀，所以做完了。（感觉还是不够完整，最好从创建图层--点击事件--编辑等再检查一遍。）
### 2，polylineEditor.ts
支持多线的形式，支持编辑 (✅)（1：缺少线的整个拖动。2：线在绘制状态时，撤销上一个点后再恢复撤销的点。）  
### 3：polygonEditor.ts
全部支持  (✅)
### 4：rectangleEditoe.ts
貌似没考虑多矩形面的情况（leafletjs不支持呀...） (✅)
### 5：circleEditor.ts
约束: circleEditor 要求传递的options.defaultGeometry是中点，options.defaultStyle中传递半径{radius:10} (✅)




