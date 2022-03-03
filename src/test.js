import * as THREE from 'three'
import {ObjectControls} from 'threejs-object-controls/ObjectControls.js';
import * as dat from 'lil-gui'

        // if (!Detector.webgl) Detector.addGetWebGLMessage();

        var renderer = new THREE.WebGLRenderer();

        var camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
        var scene = new THREE.Scene();

        var matFloor = new THREE.MeshPhongMaterial({ dithering: true });
        var matBox = new THREE.MeshPhongMaterial({ color: 0xebe20d, dithering: true });

        var geoFloor = new THREE.BoxGeometry(1000, 1, 1000);
        var geoBox = new THREE.BoxGeometry(2, 2, 2);

        var mshFloor = new THREE.Mesh(geoFloor, matFloor);
        var mshBox = new THREE.Mesh(geoBox, matBox);
        var mshBox2 = new THREE.Mesh(geoBox, matBox);

        var ambient = new THREE.AmbientLight(0xffffff, 0.1);

        var spotLight = new THREE.SpotLight(0xffffff, 1);
        var lightHelper;

        var gui, guiElements, param = { color: '0xffffff' };
        var controls;

        function init() {

            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            renderer.gammaInput = true;
            renderer.gammaOutput = true;

            camera.position.set(0, 5, 50);
            camera.position.z = 30;

            spotLight.position.set(15, 40, 35);
            spotLight.castShadow = true;
            spotLight.angle = 0.18;
            spotLight.penumbra = 0;
            spotLight.decay = 2;
            spotLight.distance = 200;
            spotLight.intensity = 2;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 1;
            spotLight.shadow.camera.far = 200;

            lightHelper = new THREE.SpotLightHelper(spotLight);

            matFloor.color.set(0x808080);

            mshFloor.receiveShadow = true;
            mshFloor.position.set(0, - 0.05, 0);

            mshBox.castShadow = true;
            mshBox2.castShadow = true;
            mshBox.position.set(-3, 2.3, 3);
            mshBox2.position.set(3, 2.3, 3);

            camera.lookAt(mshBox.position);

            scene.add(camera);
            scene.add(mshFloor);
            scene.add(mshBox);
            scene.add(mshBox2);
            scene.add(ambient);
            scene.add(spotLight);
            scene.add(new THREE.AxisHelper(10));
            scene.add(lightHelper);

            document.body.appendChild(renderer.domElement);
            renderer.setSize(window.innerWidth, window.innerHeight);

            /** instantiate ObjectControls**/
            controls = new ObjectControls(camera, renderer.domElement, mshBox);
            controls.setDistance(8, 200); // set min - max distance for zoom
            controls.setZoomSpeed(0.5); // set zoom speed
            controls.enableVerticalRotation();
            controls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4);
            controls.setRotationSpeed(0.05);

            window.addEventListener('resize', onResize, false);

        }

        function onResize() {

            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = (window.innerWidth / window.innerHeight);
            camera.updateProjectionMatrix();

        }

        function animate() {
            /* Auto rotation usage example
             * the auto rotation for mshBox2 is enabled if the user is not interacting or if the selected mesh is not mshBox2
            */
             if(!controls.isUserInteractionActive() || controls.getObjectToMove() != mshBox2){
                //mshBox2 auto rotation
                mshBox2.rotation.y += 0.01;
            }

            requestAnimationFrame(animate);
            render();
        }

        function render() {
            lightHelper.update(); // required
            renderer.render(scene, camera);
        }

        function clearGui() {

            if (gui) gui.destroy();

            gui = new dat.GUI();

            gui.open();

        }

        function buildGui() {

            clearGui();

            addGui('light color', spotLight.color.getHex(), function (val) {

                spotLight.color.setHex(val);

            }, true);

            addGui('intensity', spotLight.intensity, function (val) {

                spotLight.intensity = val;

            }, false, 0, 2);

            addGui('distance', spotLight.distance, function (val) {

                spotLight.distance = val;

            }, false, 0, 200);

            addGui('angle', spotLight.angle, function (val) {

                spotLight.angle = val;

            }, false, 0, Math.PI / 3);

            addGui('penumbra', spotLight.penumbra, function (val) {

                spotLight.penumbra = val;

            }, false, 0, 1);

            addGui('decay', spotLight.decay, function (val) {

                spotLight.decay = val;

            }, false, 1, 2);

            var changeMeshConfig = {
                useMesh1: function () {
                    controls.setObjectToMove(mshBox);
                },
                useMesh2: function () {
                    controls.setObjectToMove(mshBox2);
                },
                useBoth: function () {
                    controls.setObjectToMove([mshBox,mshBox2]);
                }
            };
            gui.add(changeMeshConfig, 'useMesh1');
            gui.add(changeMeshConfig, 'useMesh2');
            gui.add(changeMeshConfig, 'useBoth');
        }

        function addGui(name, value, callback, isColor, min, max) {

            var node;
            param[name] = value;

            if (isColor) {

                node = gui.addColor(param, name).onChange(function () {

                    callback(param[name]);

                });

            } else if (typeof value == 'object') {

                node = gui.add(param, name, value).onChange(function () {

                    callback(param[name]);

                });

            } else {

                node = gui.add(param, name, min, max).onChange(function () {

                    callback(param[name]);

                });

            }

            return node;

        }

        init();
        animate();
        buildGui();