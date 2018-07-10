### threeJs开发指南
#### 第二章 总结

- 场景是ThreeJs库的最主要的容器，我们可以将想要渲染的对象添加到场景中去。
- 场景并没有很多特殊的选项和属性，最主要的功能就是允许我们添加对象、移除对象，以及处理场景中的 children 属性。
- 我们可以通过配置 **Fog** 对象为场景添加雾化的效果。
- 几何体和网格关系密切，几何体定义对象的外观，赋予材质后我们可以用它来创建网格。
- threeJs 提供了很多的标准几何体，我们也可以自己去创建。
- 可以通过编程去控制 **mesh** 的 **position**、**rotation**、和**scale**属性。
- 通过 **translate** 属性，可以相对当前的位置移动网格。

#### 第三章 使用**threeJs**里的各种光源

##### 1 环境光 **AmbientLight**
1. 基础光源 。
2. 颜色会添加到整个场景和所有对象的颜色上。
3. 不能投射阴影，因为这种光没有方向。

##### 平行光 **DirectionalLight**

##### 半球光 **HemisphereLight**

##### 点光 **PointLight**

##### 矩形光 **RectAreaLight**

##### 聚光灯光源 **SpotLight**

##### **THREE.Color()** 对象

18 - three.js 笔记 - THREE.Color 对象
19 - three.js 笔记 - AmbientLight 光源

