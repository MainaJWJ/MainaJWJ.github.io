// myShipControl.js

/**
 * Space Shuttle Controller
 * 
 * 기능:
 * - space shuttle 3D 모델 로드 (GLB)
 * - 키보드를 통한 기체 조종 (방향키: 피치/요, 스페이스바: 부스트)
 * - JSON 설정 파일 로드 및 적용 (성능, 카메라 거리, 모델 크기 등)
 * - 기체 애니메이션 업데이트
 * 
 * 의존성:
 * - Three.js (r128)
 * - GLTFLoader
 * 
 * 사용법:
 * 1. HTML에서 Three.js 및 GLTFLoader를 먼저 로드해야 합니다.
 * 2. 이 스크립트를 로드합니다.
 * 3. `initMyShipControl(scene, camera)` 함수를 호출합니다.
 *    - `scene`: Three.js Scene 객체
 *    - `camera`: Three.js Camera 객체
 */

// 전역 변수
let spaceship = {
    mesh: null,        // 로드된 3D 모델 그룹
    model: null,       // 로드된 3D 모델 (gltf.scene)
    mixer: null,       // 애니메이션 믹서
    config: null,      // 로드된 설정 (JSON)
    // 조종 관련 상태
    yawAngle: 0,
    pitchAngle: 0,
    rollAngle: 0,
    keys: {},
    frozen: false      // 정지 상태 플래그 추가
};

// playerScale 변수 추가
let playerScale = 1.0;

// 카메라 줌 관련 변수
let cameraZoom = 1.0;  // 줌 레벨 (1.0 = 기본, < 1.0 = 확대, > 1.0 = 축소)
const CAMERA_ZOOM_SENSITIVITY = 0.1;  // 줌 감도

// 기본 설정 (JSON 로드 실패 시 사용)
const DEFAULT_CONFIG = {
    "model": {
        "file": "model/space shuttle/space shuttle.glb",
        "scale": 5,
        "initialRotation": { "x": 0, "y": 90, "z": 0 }
    },
    "performance": {
        "speed": 40,
        "acceleration": 50,
        "turnSensitivity": 0.025,
        "pitchLimits": { "up": 80, "down": -60 },
        "maxRollAngle": 24
    },
    "camera": {
        "follow": {
            "x": -50,
            "y": 20,
            "z": 0
        },
        "rear_view": {
            "x": 200,
            "y": 50,
            "z": 0
        }
    }
};

// 설정 로드
async function loadSpaceshipConfig() {
    try {
        // setting.json 파일 로드
        const settingsResponse = await fetch('./setting.json');
        if (!settingsResponse.ok) {
            throw new Error(`HTTP error! status: ${settingsResponse.status} for setting.json`);
        }
        const settings = await settingsResponse.json();
        playerScale = settings.playerScale || 1.0;
        console.log('Settings loaded:', settings);

        const response = await fetch('./model/space shuttle/space shuttle.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        console.log('Spaceship config loaded:', config);
        return config;
    } catch (error) {
        console.error('Failed to load spaceship config, using default values.', error);
        return DEFAULT_CONFIG;
    }
}

// 3D 모델 로드
function loadSpaceshipModel(scene, onModelLoaded) {
    const loader = new THREE.GLTFLoader();
    
    // 모델 파일 경로 (설정에서 가져오거나 기본값 사용)
    const modelPath = (spaceship.config && spaceship.config.model.file) ? 
                      spaceship.config.model.file : 
                      DEFAULT_CONFIG.model.file;

    loader.load(
        modelPath,
        (gltf) => {
            console.log('Spaceship model loaded successfully.');
            
            // 모델 및 애니메이션 설정
            spaceship.model = gltf.scene;
            
            // 애니메이션이 있는 경우 믹서 생성
            if (gltf.animations && gltf.animations.length > 0) {
                spaceship.mixer = new THREE.AnimationMixer(spaceship.model);
                gltf.animations.forEach((clip) => {
                    spaceship.mixer.clipAction(clip).play();
                });
            }

            // 모델 크기 조정 (설정에서 가져오거나 기본값 사용) - playerScale 적용
            const scale = ((spaceship.config && spaceship.config.model.scale !== undefined) ? 
                          spaceship.config.model.scale : 
                          DEFAULT_CONFIG.model.scale) * playerScale;
            spaceship.model.scale.set(scale, scale, scale);

            // 초기 회전 설정 (설정에서 가져오거나 기본값 사용)
            const initialRotation = (spaceship.config && spaceship.config.model.initialRotation) ? 
                                    spaceship.config.model.initialRotation : 
                                    DEFAULT_CONFIG.model.initialRotation;
            if (initialRotation) {
                spaceship.model.rotation.set(
                    THREE.MathUtils.degToRad(initialRotation.x),
                    THREE.MathUtils.degToRad(initialRotation.y),
                    THREE.MathUtils.degToRad(initialRotation.z)
                );
            }

            // 모델의 그림자 설정
            spaceship.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // 모델을 그룹에 추가하여 위치 및 조작을 용이하게 함
            const modelGroup = new THREE.Group();
            modelGroup.add(spaceship.model);
            // 초기 위치 설정 (블랙홀 근처에 배치)
            modelGroup.position.set(0, 50, 200); // 블랙홀에서 약간 떨어진 위치
            
            spaceship.mesh = modelGroup;
            scene.add(spaceship.mesh);
            
            if (onModelLoaded) onModelLoaded();
        },
        (xhr) => {
            console.log('Spaceship model ' + (xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error happened while loading the spaceship model:', error);
        }
    );
}

// 키보드 이벤트 리스너 설정
function setupKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        spaceship.keys[event.key] = true;
        
        // T 키를 누르면 정지 상태 토글
        if (event.key === 't' || event.key === 'T') {
            spaceship.frozen = !spaceship.frozen;
        }
    }, false);

    document.addEventListener('keyup', (event) => {
        spaceship.keys[event.key] = false;
    }, false);
    
    // 마우스 휠 이벤트 리스너 추가
    document.addEventListener('wheel', (event) => {
        // 줌 레벨 조정 (휠 위로 굴리면 확대, 아래로 굴리면 축소)
        cameraZoom += event.deltaY * CAMERA_ZOOM_SENSITIVITY * 0.01;
        // 줌 레벨 제한 (0.01배 ~ 100배)
        cameraZoom = Math.max(0.01, Math.min(cameraZoom, 100));
    }, false);
}

// 기체 업데이트 (조종 및 물리) - simulator/control.js 방식 적용
function updateSpaceship(deltaTime, camera, cameraMode = 'follow') {
    if (!spaceship.mesh || !spaceship.config) return;
    
    // 설정 가져오기 (성능 부분)
    const config = spaceship.config.performance || DEFAULT_CONFIG.performance;
    var pitchSpeed = config.turnSensitivity;
    var turnSpeed = config.turnSensitivity;
    const maxPitchUp = THREE.MathUtils.degToRad(config.pitchLimits.up);
    const maxPitchDown = THREE.MathUtils.degToRad(config.pitchLimits.down);

    // --- simulator/control.js의 updatePlane 함수에서 가져온 로직 ---
    // Pitch (up/down) control with custom limits
    if (spaceship.keys["ArrowDown"]) { // Pitch Up
        spaceship.pitchAngle = Math.min(maxPitchUp, spaceship.pitchAngle + pitchSpeed);
    }
    if (spaceship.keys["ArrowUp"]) { // Pitch Down
        spaceship.pitchAngle = Math.max(maxPitchDown, spaceship.pitchAngle - pitchSpeed);
    }

    // Yaw (left/right) control
    if (spaceship.keys["ArrowLeft"]) spaceship.yawAngle += turnSpeed;
    if (spaceship.keys["ArrowRight"]) spaceship.yawAngle -= turnSpeed;

    let targetRollAngle = 0;
    const maxRoll = THREE.MathUtils.degToRad(config.maxRollAngle);
    if (spaceship.keys["ArrowLeft"]) targetRollAngle = -maxRoll;
    else if (spaceship.keys["ArrowRight"]) targetRollAngle = maxRoll;
    spaceship.rollAngle += (targetRollAngle - spaceship.rollAngle) * 0.1;

    var yawQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), spaceship.yawAngle);
    var pitchQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), spaceship.pitchAngle);
    var rollQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), spaceship.rollAngle);
    spaceship.mesh.quaternion.copy(yawQ).multiply(pitchQ).multiply(rollQ);

    // 정지 상태가 아닐 때만 위치 이동
    if (!spaceship.frozen) {
        var currentSpeed = config.speed;
        if (spaceship.keys[" "]) currentSpeed *= config.acceleration;

        // 로직은 +X 축을 정면으로 사용합니다.
        var forwardVector = new THREE.Vector3(1, 0, 0);
        forwardVector.applyQuaternion(spaceship.mesh.quaternion);
        spaceship.mesh.position.add(forwardVector.multiplyScalar(currentSpeed * deltaTime));
    }
    // --- 로직 끝 ---

    // 카메라 업데이트
    updateSpaceshipCamera(camera, cameraMode);
}

// 카메라 업데이트
function updateSpaceshipCamera(camera, mode = 'follow') {
    if (!spaceship.mesh) return;

    // 카메라 설정 가져오기
    let cameraSettings;
    if (spaceship.config && spaceship.config.camera) {
        cameraSettings = spaceship.config.camera[mode];
    }
    if (!cameraSettings) {
        // 설정이 없거나 모드가 잘못된 경우 기본값 사용
        cameraSettings = DEFAULT_CONFIG.camera[mode] || DEFAULT_CONFIG.camera.follow;
    }

    // 카메라 오프셋 계산 - playerScale과 cameraZoom 적용
    const offsetX = cameraSettings.x * playerScale * cameraZoom;
    const offsetY = cameraSettings.y * playerScale * cameraZoom;
    const offsetZ = cameraSettings.z * playerScale * cameraZoom;
    
    const relativeCameraOffset = new THREE.Vector3(offsetX, offsetY, offsetZ);
    
    // 기체의 월드 행렬을 사용하여 카메라 위치 계산
    const cameraOffset = relativeCameraOffset.applyMatrix4(spaceship.mesh.matrixWorld);
    
    // 카메라가 바라보는 지점 설정
    let lookAtTarget;
    if (mode === 'follow') {
        // 추적 시점: 기체 앞을 바라봄
        lookAtTarget = new THREE.Vector3(1, 0, 0)
            .applyQuaternion(spaceship.mesh.quaternion)
            .multiplyScalar(50)
            .add(spaceship.mesh.position);
    } else {
        // 후방 시점: 기체 뒤를 바라봄
        lookAtTarget = new THREE.Vector3(-1, 0, 0)
            .applyQuaternion(spaceship.mesh.quaternion)
            .multiplyScalar(50)
            .add(spaceship.mesh.position);
    }

    // 카메라 위치를 부드럽게 이동 (lerp)
    camera.position.lerp(cameraOffset, 0.1);
    
    // 업 벡터 설정 및 시선 방향 조정
    camera.up.set(0, 1, 0);
    camera.lookAt(lookAtTarget);
}

// 애니메이션 업데이트
function updateSpaceshipAnimation(deltaTime) {
    if (spaceship.mixer) {
        spaceship.mixer.update(deltaTime);
    }
}

// 초기화 함수
async function initMyShipControl(scene, camera) {
    console.log("Initializing Spaceship Controller...");
    
    // 1. 설정 로드
    spaceship.config = await loadSpaceshipConfig();
    
    // 2. 모델 로드
    loadSpaceshipModel(scene, () => {
        console.log("Spaceship model is ready.");
        // 3. 키보드 조작 설정
        setupKeyboardControls();
    });
}

// 공개 함수들
window.initMyShipControl = initMyShipControl;
window.updateSpaceship = updateSpaceship;
window.updateSpaceshipAnimation = updateSpaceshipAnimation;