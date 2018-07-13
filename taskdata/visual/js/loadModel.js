$(function () {

    let stats, scene, camera, renderer, controls, light, selectObject;

    let label = $("#label");
    let arrayId = [];
    let reset_camera = null;

    if (isMobile()) {

        init();
        animate();

    }else{

        $('#reset-camera').hide();

    }

    $('#reset-camera').on('touchstart', function (e) {

        reset_camera = true;

        // 重置相机和轨迹控制
        initCamera();
        initControls();

    });

    // 场景
    function initScene() {

        scene = new THREE.Scene();

    }

    // 相机
    function initCamera() {

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(-100, 60, 0);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

    }

    // 渲染器
    function initRenderer() {

        if (Detector.webgl) {

            renderer = new THREE.WebGLRenderer({

                antialias: true,
                autoClear: true
            });

        } else {

            renderer = new THREE.CanvasRenderer();

        }

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x050505);

        $('#WebGL-output').append(renderer.domElement);

    }

    // 控制控件
    function initControls() {

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        controls.minDistance = 5;
        controls.maxDistance = 100;
        controls.maxPolarAngle = 0.5 * Math.PI;

    }

    // 灯光
    function initLight() {

        light = new THREE.SpotLight(0xE5E5E5);
        light.position.set(-1000, 2000, 3000);
        light.castShadow = true;

        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff));

    }

    // 加载模型
    function initContent() {

        let mtlLoader = new THREE.MTLLoader();

        mtlLoader.setPath('data/room/');

        mtlLoader.load('room3.mtl', function (materials) {

            let objLoader = new THREE.OBJLoader();

            objLoader.setMaterials(materials);
            objLoader.setPath('data/room/');

            objLoader.load('room3.obj', function (object) {

                for (let i = 0; i < object.children.length; i++) {

                    let id = object.children[i].id;

                    // id = 125:地板, 94:两侧墙壁
                    if (id === 125 || id === 94) {

                        // 判断是否是网格对象
                        if (object.children[i].isMesh) {

                            object.children[i].receiveShadow = true;

                            for (let j = 0; j < object.children[i].material.length; j++) {

                                // 设置双面渲染
                                object.children[i].material[j].side = THREE.DoubleSide;

                            }
                        }
                    }
                }

                scene.add(object);

            });
        });

    }

    // 获取 objects 与射线相交的对象数组
    function getIntersects(event, objects) {

        let rayCaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        //通过点击的位置计算出rayCaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;

        // 通过鼠标点的位置和当前相机的矩阵计算出rayCaster
        rayCaster.setFromCamera(mouse, camera);

        // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
        return rayCaster.intersectObjects(objects);

    }

    // 单击触发的事件
    function onTouchStart(event) {

        function createMesh() {

            let material = new THREE.MeshBasicMaterial({color: 0x9B30FF});
            material.transparent = true;
            material.opacity = 0.6;

            //替换焦点最近的一个物体
            let replaceGeometry = intersects[0].object.geometry;
            let replaceObject = new THREE.Mesh(replaceGeometry, material);
            replaceObject.name = "replaceObject";

            scene.add(replaceObject);
            selectObject = intersects[0].object;

        }

        // 获取与射线相交的对象数组
        let intersects = getIntersects(event, scene.children[2].children);

        if (intersects.length > 0 && intersects[0].object.isMesh && intersects[0].object.id !== 95) {

            let existObject = scene.getObjectByName('replaceObject');
            arrayId.push(intersects[0].object.id);

            if (arrayId.length > 1 && arrayId[0] !== arrayId[1]) {

                if (existObject) scene.remove(existObject);

                createMesh();

                // 从数组头部删除元素
                arrayId.shift();

            } else {

                if (arrayId.length === 2) arrayId.shift();

                if (existObject != null) {

                    scene.remove(existObject);
                    selectObject = false;

                } else {

                    createMesh();

                }
            }

        } else if (reset_camera) {

            console.log("reset camera and controls!");
            reset_camera = false;

        } else {

            alert("未选中 Mesh ！");

        }

    }

    // 初始化性能插件
    function initStats() {

        let stats = new Stats();

        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        $("#Stats-output").append(stats.domElement);

        return stats;

    }

    // 更新div的位置
    function renderDiv(object) {

        if (object !== undefined) {

            // 获取选中对象包围盒属性的 vector3 属性
            let boxVector3 = object.geometry.boundingSphere.center;

            // 获取窗口的一半高度和宽度
            let halfWidth = window.innerWidth / 2;
            let halfHeight = window.innerHeight / 2;

            // 逆转相机求出二维坐标
            let vector = boxVector3.clone().project(camera);

            // 修改 div 的位置
            label.css({
                left: vector.x * halfWidth + halfWidth,
                top: -vector.y * halfHeight + halfHeight
            });

            // 显示模型信息
            label.text("id:" + object.id);

        }
    }
    
    // 判断设备
    function isMobile () {
        let ua = navigator.userAgent;

        let ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

            isIphone =!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

            isAndroid = ua.match(/(Android)\s+([\d.]+)/),

            isMobile = isIphone || isAndroid;
        return isMobile;
    }

    // 初始化
    function init() {

        stats = initStats();
        initScene();
        initCamera();
        initRenderer();
        initControls();
        initLight();
        initContent();

        THREEx.WindowResize(renderer, camera);
        window.addEventListener('touchstart', onTouchStart, false);

    }

    function update() {

        stats.update();
        controls.update();

        // 处理 div 的隐藏和显示
        if (!selectObject) {

            label.hide();

        } else {

            renderDiv(selectObject);
            label.show();

        }
    }

    function animate() {

        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        update();

    }

});