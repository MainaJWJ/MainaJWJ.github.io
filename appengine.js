// 이 파일은 데스크톱 아이콘 생성, 이벤트 처리 등 바탕화면의 핵심 동작을 관리합니다.
import windowManager from './windowManager.js';
import startMenu from './startMenu.js'; // 시작 메뉴 제어를 위해 import

// 1. 아이콘 데이터 정의
// 왼쪽 열 아이콘
const DESKTOP_ICONS = [
  {
    id: 'icon-my-computer',
    title: 'My Computer',
    iconUrl: './image/mycomputer.png',
    windowOptions: {
      title: 'My Computer',
      iframeSrc: './app/folder.html',
      width: 700,
      height: 520,
      iconUrl: './image/mycomputer.png'
    }
  },
  {
    id: 'texteditor',
    title: 'Text editor',
    iconUrl: './image/doc.png',
    windowOptions: {
      title: 'Text editor',
      iframeSrc: './app/texteditor.html',
      width: 700,
      height: 520,
      iconUrl: './image/doc.png'
    }
  },
    {
    id: 'text-counter',
    title: 'Text Counter',
    iconUrl: './image/wordpad.png',
    windowOptions: {
      title: 'Text Counter',
      iframeSrc: './app/textcounter.html',
      width: 500,
      height: 300,
      iconUrl: './image/wordpad.png'
    }
  },
    {
    id: 'calculator',
    title: 'Calculator',
    iconUrl: './image/calculator.png',
    windowOptions: {
      title: 'Calculator',
      iframeSrc: './app/calculator.html',
      width: 300,
      height: 400,
      iconUrl: './image/calculator.png'
    }
  }
];

// 오른쪽 열 아이콘
const DESKTOP_ICONS_COL2 = [


  {
    id: 'solar-system',
    title: 'Solar System',
    iconUrl: './image/windowsearth.png',
    windowOptions: {
      title: 'Solar System',
      iframeSrc: './app/Solar System.html',
      width: 800,
      height: 600,
      iconUrl: './image/windowsearth.png'
    }
  },
  {
    id: 'saturn',
    title: 'Saturn',
    iconUrl: './image/earth.png',
    windowOptions: {
      title: 'Saturn',
      iframeSrc: './app/saturn.html',
      width: 800,
      height: 600,
      iconUrl: './image/earth.png'
    }
  },
  {
    id: 'recorder',
    title: 'Recorder',
    iconUrl: './image/mediaplayer.png',
    windowOptions: {
      title: 'Recorder',
      iframeSrc: './app/recorder.html',
      width: 400,
      height: 300,
      iconUrl: './image/mediaplayer.png'
    }
  },
  {
    id: 'creative-cloud',
    title: 'Creative Cloud',
    iconUrl: './image/Photoshop.png',
    windowOptions: {
      title: 'Glassmorphism Creative Cloud',
      iframeSrc: './app/Glassmorphism Creative Cloud.html',
      width: 700,
      height: 500,
      iconUrl: './image/Photoshop.png'
    }
  },
  {
    id: 'neumorphic-elements',
    title: 'Neumorphic UI',
    iconUrl: './image/mspaint.png',
    windowOptions: {
      title: 'Neumorphic Elements',
      iframeSrc: './app/Neumorphic Elements.html',
      width: 600,
      height: 500,
      iconUrl: './image/mspaint.png'
    }
  }
];


console.log('appengine.js loaded');

/**
 * DESKTOP_ICONS 배열 데이터를 기반으로 바탕화면 아이콘을 생성하고 모든 상호작용을 설정합니다.
 */
function initializeDesktop() {
  const container1 = document.getElementById('desktop-icons');
  const container2 = document.getElementById('desktop-icons-col2');
  const desktopArea = document.getElementById('desktop-area');

  if (!container1 || !container2 || !desktopArea) {
    console.error('필수 데스크톱 요소를 찾을 수 없습니다.');
    return;
  }

  let selectionBox = null;
  let isDragging = false;
  let startCoords = { x: 0, y: 0 };
  let iconRects = [];

  // --- 헬퍼 함수 ---
  const clearAllSelections = () => {
    document.querySelectorAll('.desktop-icon.selected').forEach(icon => {
      icon.classList.remove('selected');
    });
  };

  // 아이콘 DOM 요소를 생성하고 이벤트 리스너를 추가하는 헬퍼 함수
  const createIconElement = (iconData) => {
    const iconEl = document.createElement('div');
    iconEl.className = 'desktop-icon';
    iconEl.id = iconData.id;

    const img = document.createElement('img');
    img.src = iconData.iconUrl;
    img.alt = iconData.title;
    img.ondragstart = (e) => e.preventDefault();

    const span = document.createElement('span');
    span.textContent = iconData.title;

    iconEl.addEventListener('click', (e) => {
      e.stopPropagation();
      clearAllSelections();
      iconEl.classList.add('selected');
    });

    iconEl.addEventListener('dblclick', () => {
      const windowId = windowManager.createWindow(iconData.windowOptions);
      const taskbarFrame = document.getElementById('taskbar-frame');
      if (taskbarFrame) {
        taskbarFrame.contentWindow.postMessage({ type: 'addTaskbarTab', windowId, title: iconData.title, iconUrl: iconData.iconUrl }, '*');
        taskbarFrame.contentWindow.postMessage({ type: 'activateTaskbarTab', windowId }, '*');
      }
    });

    iconEl.appendChild(img);
    iconEl.appendChild(span);
    return iconEl;
  };


  // --- 이벤트 리스너 설정 ---
  desktopArea.addEventListener('mousedown', (e) => {
    if (e.target !== desktopArea) return;

    // 1. 열려있는 창 및 메뉴 닫기/비활성화
    if (startMenu.isOpen) {
      startMenu.close();
    }
    windowManager.deactivateAllWindows();
    const taskbarFrame = document.getElementById('taskbar-frame');
    if (taskbarFrame) {
        taskbarFrame.contentWindow.postMessage({ type: 'deactivateAllTaskbarTabs' }, '*');
    }

    // 2. 드래그 선택 로직 시작
    isDragging = true;
    clearAllSelections();

    selectionBox = document.createElement('div');
    selectionBox.className = 'selection-box';
    desktopArea.appendChild(selectionBox);

    startCoords = { x: e.clientX, y: e.clientY };

    selectionBox.style.left = `${startCoords.x}px`;
    selectionBox.style.top = `${startCoords.y}px`;
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const left = Math.min(startCoords.x, currentX);
    const top = Math.min(startCoords.y, currentY);
    const width = Math.abs(startCoords.x - currentX);
    const height = Math.abs(startCoords.y - currentY);

    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;

    const boxRect = selectionBox.getBoundingClientRect();

    iconRects.forEach(icon => {
      const isIntersecting = !(
        icon.rect.right < boxRect.left ||
        icon.rect.left > boxRect.right ||
        icon.rect.bottom < boxRect.top ||
        icon.rect.top > boxRect.bottom
      );

      icon.element.classList.toggle('selected', isIntersecting);
    });
  }

  function onMouseUp() {
    isDragging = false;
    if (selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  // --- 아이콘 렌더링 ---
  container1.innerHTML = '';
  container2.innerHTML = '';

  DESKTOP_ICONS.forEach(iconData => {
    container1.appendChild(createIconElement(iconData));
  });

  DESKTOP_ICONS_COL2.forEach(iconData => {
    container2.appendChild(createIconElement(iconData));
  });


  // 렌더링 후 아이콘 위치 정보 캐싱
  function cacheIconRects() {
      iconRects = [];
      document.querySelectorAll('.desktop-icon').forEach(iconEl => {
          iconRects.push({
              id: iconEl.id,
              element: iconEl,
              rect: iconEl.getBoundingClientRect()
          });
      });
  }
  cacheIconRects();
  window.addEventListener('resize', cacheIconRects);
}

// DOM이 준비되면 데스크톱 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initializeDesktop);