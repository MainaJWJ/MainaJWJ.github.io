// appLauncher.js
// 이 파일은 앱 실행 기능을 담당합니다.

// 역할: 앱 실행 담당자 (앱 실행자)
// 책임:
// 1. 어떤 앱을 실행할지 판단 (ID로 앱 정보 조회)
// 2. 앱 종류에 따라 적절한 관리자에게 위임
// 3. 새 창 생성 후 작업표시줄에 탭 추가 요청 (초기 설정)
// 4. 앱 실행 옵션들을 저장하고 관리함

import windowManager from './windowManager.js';
import fullscreenAppManager from './fullscreenAppManager.js';

// 앱 실행 옵션 정의
// 각 앱은 고유한 ID를 키로 하여 실행 옵션을 저장함
// ID가 핵심: 시스템 내부 식별용 (중복 불가, 변경시 시스템 영향)
// Title은 부가: 사용자 표시용 (중복 허용, 변경 가능)
const APP_LAUNCH_OPTIONS = {
  'icon-my-computer': {
    title: 'My Computer',           // 사용자에게 보여줄 앱 이름
    iframeSrc: './app/folder.html', // 앱의 HTML 파일 경로
    width: 700,                     // 창 너비 (픽셀)
    height: 520,                    // 창 높이 (픽셀)
    iconUrl: './image/mycomputer.png' // 아이콘 이미지 경로
  },
  'texteditor': {
    title: 'Text editor',
    iframeSrc: './app/texteditor.html',
    width: 700,
    height: 520,
    iconUrl: './image/doc.png'
  },
  'text-counter': {
    title: 'Text Counter',
    iframeSrc: './app/textcounter.html',
    width: 500,
    height: 300,
    iconUrl: './image/wordpad.png'
  },
  'calculator': {
    title: 'Calculator',
    iframeSrc: './app/calculator.html',
    width: 300,
    height: 400,
    iconUrl: './image/calculator.png'
  },
  'flight': {
    title: 'Flight',
    iframeSrc: './app/flight/index.html',
    width: 300,
    height: 400,
    iconUrl: './image/flight.png'
  },
  'solar-system': {
    title: 'Solar System',
    iframeSrc: './app/Solar System.html',
    width: 800,
    height: 600,
    iconUrl: './image/windowsearth.png'
  },
  'saturn': {
    title: 'Saturn',
    iframeSrc: './app/saturn.html',
    width: 800,
    height: 600,
    iconUrl: './image/earth.png'
  },
  'recorder': {
    title: 'Recorder',
    iframeSrc: './app/recorder.html',
    width: 400,
    height: 300,
    iconUrl: './image/mediaplayer.png'
  },
  'creative-cloud': {
    title: 'Glassmorphism Creative Cloud',
    iframeSrc: './app/Glassmorphism Creative Cloud.html',
    width: 700,
    height: 500,
    iconUrl: './image/Photoshop.png'
  },
  'neumorphic-elements': {
    title: 'Neumorphic Elements',
    iframeSrc: './app/Neumorphic Elements.html',
    width: 600,
    height: 500,
    iconUrl: './image/mspaint.png'
  },
  // 세 번째 열 아이콘을 위한 앱 실행 옵션 복사
  'solar-system-copy': {
    title: 'Solar System',
    iframeSrc: './app/Solar System.html',
    width: 800,
    height: 600,
    iconUrl: './image/windowsearth.png'
  },
  'saturn-copy': {
    title: 'Saturn',
    iframeSrc: './app/saturn.html',
    width: 800,
    height: 600,
    iconUrl: './image/earth.png'
  },
  'recorder-copy': {
    title: 'Recorder',
    iframeSrc: './app/recorder.html',
    width: 400,
    height: 300,
    iconUrl: './image/mediaplayer.png'
  },
  'creative-cloud-copy': {
    title: 'Glassmorphism Creative Cloud',
    iframeSrc: './app/Glassmorphism Creative Cloud.html',
    width: 700,
    height: 500,
    iconUrl: './image/Photoshop.png'
  },
  'neumorphic-elements-copy': {
    title: 'Neumorphic Elements',
    iframeSrc: './app/Neumorphic Elements.html',
    width: 600,
    height: 500,
    iconUrl: './image/mspaint.png'
  },
  // Flower 화면보호기 앱
  'flower': {
    title: 'Flower Screensaver',
    iframeSrc: './app/flower/index.html',
    fullscreen: true,              // 전체화면 모드 여부
    iconUrl: './image/protect.png'
  },
  // Pipes 화면보호기 앱
  'pipes': {
    title: 'Pipes Screensaver',
    iframeSrc: './app/pipes/index.html',
    fullscreen: true,              // 전체화면 모드 여부
    iconUrl: './image/protect.png'
  },
  // 크기조절 불가능한 앱 예시
  // resizable: false 속성이 있으면 크기 조절 불가능한 앱으로 처리됨
  'fixed-size-app': {
    title: 'Fixed Size App',
    iframeSrc: './app/fixedsize.html',
    width: 600,
    height: 400,
    resizable: false,              // 크기 조절 가능 여부
    iconUrl: './image/fixedsize.png'
  }
};

console.log('appLauncher.js loaded');

/**
 * 앱을 실행합니다.
 * 이 함수는 desktopManager.js에서 아이콘 더블클릭 시 호출됩니다.
 * @param {Object} iconData - 아이콘 데이터 (id, title, iconUrl 포함)
 * @returns {string} windowId - 생성된 창의 ID
 */
function launchApp(iconData) {
  // 앱 실행 옵션 가져오기
  // iconData.id를 키로 하여 APP_LAUNCH_OPTIONS에서 앱 정보를 찾음
  // ID가 핵심 식별자이므로 반드시 일치해야 함
  const options = APP_LAUNCH_OPTIONS[iconData.id];
  
  if (!options) {
    console.error(`앱 실행 옵션을 찾을 수 없습니다: ${iconData.id}`);
    return;
  }
  
  // 앱 실행 모드 판단
  // fullscreen 속성이 true이면 전체화면 앱, 그렇지 않으면 일반 창 앱
  if (options.fullscreen === true) {
    // 전체화면 앱은 fullscreenAppManager로 위임
    // fullscreenAppManager는 제목 표시줄 없이 화면 전체를 차지하는 앱을 처리함
    return fullscreenAppManager.launchApp(options);
  } else {
    // 일반 창 모드 앱은 windowManager로 위임
    // windowManager는 일반적인 창(제목 표시줄, 크기 조절 핸들 등 포함)을 처리함
    const windowId = windowManager.createWindow(options);
    
    // 작업표시줄에 탭 추가 및 활성화
    // 새 창이 생성되었음을 작업표시줄에 알림
    const taskbarFrame = document.getElementById('taskbar-frame');
    if (taskbarFrame) {
      taskbarFrame.contentWindow.postMessage({ type: 'addTaskbarTab', windowId, title: options.title, iconUrl: options.iconUrl }, '*');
      taskbarFrame.contentWindow.postMessage({ type: 'activateTaskbarTab', windowId }, '*');
    }
    
    return windowId;
  }
}

// 모듈 내보내기
export default {
  launchApp
};