// uiManager.js

/**
 * UI Manager
 * 
 * 기능:
 * - 좌표 표시 UI 관리
 * 
 * 사용법:
 * 1. HTML에서 이 스크립트를 로드합니다.
 * 2. initUIManager() 함수를 호출하여 UI를 초기화합니다.
 * 3. updateCoordinates() 함수를 호출하여 좌표를 업데이트합니다.
 */

let coordinatesElement;

/**
 * UI 관리자 초기화
 */
function initUIManager() {
    // 좌표 표시 요소 생성
    coordinatesElement = document.createElement('div');
    coordinatesElement.id = 'coordinates';
    coordinatesElement.textContent = 'X: 0, Y: 0, Z: 0';
    document.body.appendChild(coordinatesElement);
}

/**
 * 좌표 표시 업데이트
 * @param {THREE.Vector3} position - 우주선의 위치 좌표
 */
function updateCoordinates(position) {
    if (coordinatesElement && position) {
        coordinatesElement.textContent = 
            `X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}, Z: ${position.z.toFixed(0)}`;
    }
}

// 전역으로 사용할 수 있도록 설정
window.initUIManager = initUIManager;
window.updateCoordinates = updateCoordinates;