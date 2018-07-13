/**
 * 三维模型加载
 * @param url obj 和 mtl 路径
 * @param canvas 渲染 canvas
 * @constructor
 */
function Application(url, canvasElement) {

    this.renderer = null;
    this.canvas = canvasElement;
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.recalcAspectRatio = recalcAspectRatio();
    this.scene = null;
    this.defaultCamera = {
        posCamera : new THREE.Vector3(-100.0, 60, 0),

    }

}