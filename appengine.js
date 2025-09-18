// 이 파일은 데스크톱의 핵심 동작을 조정하는 엔진입니다.
// 역할: 이미 실행된 창들과 작업표시줄 사이의 통신을 중계하는 중계자/조정자
// 비유: 학교 방송실장 (각 교실과 행정실 사이의 연락을 중계)
import windowManager from './windowManager.js';
import startMenu from './startMenu.js'; // 시작 메뉴 제어를 위해 import
import desktopManager from './desktopManager.js'; // 데스크톱 아이콘 관리
import appLauncher from './appLauncher.js'; // 앱 실행 관리

console.log('appengine.js loaded');

/**
 * 데스크톱을 초기화합니다.
 * 역할: 데스크톱 전체 시스템을 초기화하고 이벤트 리스너를 등록
 */
function initializeDesktop() {
  // 데스크톱 아이콘 초기화
  desktopManager.initializeDesktop();
  
  // 데스크톱 영역 클릭 이벤트 리스너 추가
  const desktopArea = document.getElementById('desktop-area');
  if (desktopArea) {
    desktopArea.addEventListener('click', (e) => {
      // 데스크톱 영역을 직접 클릭한 경우에만 처리
      if (e.target === desktopArea) {
        // 모든 창 비활성화
        windowManager.deactivateAllWindows();
        
        // 작업표시줄에 모든 탭 비활성화 요청
        const taskbarFrame = document.getElementById('taskbar-frame');
        if (taskbarFrame) {
          taskbarFrame.contentWindow.postMessage({
            type: 'deactivateAllTaskbarTabs'
          }, '*');
        }
        
        // 시작 메뉴 닫기
        startMenu.close();
      }
    });
    
    // 마우스 다운 이벤트도 추가 (데스크톱 영역 드래그 선택 시작을 위해)
    desktopArea.addEventListener('mousedown', (e) => {
      // 데스크톱 영역을 직접 클릭한 경우에만 처리
      if (e.target === desktopArea) {
        // 시작 메뉴 닫기
        if (startMenu.isOpen) {
          startMenu.close();
        }
      }
    });
  }
}

// DOM이 준비되면 데스크톱 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initializeDesktop);