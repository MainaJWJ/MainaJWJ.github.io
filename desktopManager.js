// desktopManager.js
// 이 파일은 바탕화면 아이콘 관리 및 렌더링을 담당합니다.
// 바탕화면에 아이콘 표시, 단일클릭 시 색 변화, 더블클릭 시 앱 실행 요청을 appLauncher에 전송
// Note: windowManager.deactivateAllWindows()와 startMenu.close()는 appengine.js에서 처리 
// 바탕화면 아이콘 생성, 마우스이벤트, 키보드이벤트, 앱실행 신호를 appengine으로 전송

// 역할: 바탕화면 아이콘을 관리하는 선생님
// 책임: 
// 1. 바탕화면의 아이콘들을 배치하고 관리함
// 2. 아이콘을 클릭했을 때 파란색으로 변하게 함
// 3. 아이콘을 더블클릭했을 때 "앱 실행해줘!"라고 다른 관리자에게 요청함
// 4. 마우스로 드래그해서 여러 아이콘을 선택할 수 있게 함
// 5. 키보드 방향키로 아이콘을 선택하고 이동할 수 있게 함

import appLauncher from './appLauncher.js';
import startMenu from './startMenu.js'; // 시작 메뉴 제어를 위해 import

// 1. 아이콘 데이터 정의
// 왼쪽 열 아이콘
// 각 아이콘은 id(시스템 식별자), title(표시명), iconUrl(아이콘 경로)로 구성
// ID가 핵심: 시스템 내부 식별용 (중복 불가, 변경시 시스템 영향)
// Title은 부가: 사용자 표시용 (중복 허용, 변경 가능)
const DESKTOP_ICONS = [
  {
    id: 'icon-my-computer',      // 시스템 내부에서 앱을 구분하기 위한 고유 식별자
    title: 'My Computer',        // 사용자에게 보여줄 앱 이름
    iconUrl: './image/mycomputer.png'  // 아이콘 이미지 경로
  },
  {
    id: 'texteditor',
    title: 'Text editor',
    iconUrl: './image/doc.png'
  },
  {
    id: 'text-counter',
    title: 'Text Counter',
    iconUrl: './image/wordpad.png'
  },
  {
    id: 'calculator',
    title: 'Calculator',
    iconUrl: './image/calculator.png'
  },
  {
    id: 'flight',
    title: 'flight',
    iconUrl: './image/earth.png'
  }
];

// 오른쪽 열 아이콘
const DESKTOP_ICONS_COL2 = [
  {
    id: 'solar-system',
    title: 'Solar System',
    iconUrl: './image/windowsearth.png'
  },
  {
    id: 'saturn',
    title: 'Saturn',
    iconUrl: './image/earth.png'
  },
  {
    id: 'recorder',
    title: 'Recorder',
    iconUrl: './image/mediaplayer.png'
  },
  {
    id: 'creative-cloud',
    title: 'Creative Cloud',
    iconUrl: './image/Photoshop.png'
  },
  {
    id: 'neumorphic-elements',
    title: 'Neumorphic UI',
    iconUrl: './image/mspaint.png'
  }
];



// 세 번째 열 아이콘
const DESKTOP_ICONS_COL3 = [
  {
    id: 'solar-system-copy',
    title: 'Solar System',
    iconUrl: './image/windowsearth.png'
  },
  {
    id: 'saturn-copy',
    title: 'Saturn',
    iconUrl: './image/earth.png'
  },
  {
    id: 'recorder-copy',
    title: 'Recorder',
    iconUrl: './image/mediaplayer.png'
  },
  {
    id: 'creative-cloud-copy',
    title: 'Creative Cloud',
    iconUrl: './image/Photoshop.png'
  },
  {
    id: 'neumorphic-elements-copy',
    title: 'Neumorphic UI',
    iconUrl: './image/mspaint.png'
  },
  // 전체화면 앱 아이콘 추가
  {
    id: 'logon',
    title: 'Logon',
    iconUrl: './image/logoff.png'
  },
  {
    id: 'flower',
    title: 'Flower',
    iconUrl: './image/protect.png'
  },
  {
    id: 'pipes',
    title: 'Pipes',
    iconUrl: './image/protect.png'
  }
];

console.log('desktopManager.js loaded');

/**
 * DESKTOP_ICONS 배열 데이터를 기반으로 바탕화면 아이콘을 생성하고 모든 상호작용을 설정합니다.
 * 이 함수는 데스크톱이 로드될 때 자동으로 실행됩니다.
 */
function initializeDesktop() {
  const container1 = document.getElementById('desktop-icons');
  const container2 = document.getElementById('desktop-icons-col2');
  const container3 = document.getElementById('desktop-icons-col3');
  const desktopArea = document.getElementById('desktop-area');

  if (!container1 || !container2 || !container3 || !desktopArea) {
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

    // 아이콘 단일 클릭 이벤트: 아이콘 선택 효과 (배경색 변경)
    iconEl.addEventListener('click', (e) => {
      e.stopPropagation();
      clearAllSelections();
      iconEl.classList.add('selected');
    });

    // 아이콘 더블 클릭 이벤트: 앱 실행 요청
    // appLauncher.launchApp()을 호출하여 앱 실행을 요청함
    // 이때 iconData에는 ID가 포함되어 있어 앱을 식별할 수 있음
    iconEl.addEventListener('dblclick', () => {
      // 앱 실행 요청
      appLauncher.launchApp(iconData);
    });

    iconEl.appendChild(img);
    iconEl.appendChild(span);
    return iconEl;
  };

  // --- 이벤트 리스너 설정 ---
  desktopArea.addEventListener('mousedown', (e) => {
    if (e.target !== desktopArea) return;

    // 1. 드래그 선택 로직 시작
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

  // 키보드 이벤트 리스너 추가
  // 방향키로 아이콘 선택 이동, Enter 키로 선택된 아이콘 실행, Esc 키로 아이콘 선택 해제
  document.addEventListener('keydown', (e) => {
    // 아이콘 배열이 비어있으면 처리하지 않음
    if (iconRects.length === 0) return;

    // 현재 선택된 아이콘 찾기
    const selectedIcon = document.querySelector('.desktop-icon.selected');
    
    // Esc 키: 선택 해제
    if (e.key === 'Escape') {
      clearAllSelections();
      return;
    }
    
    // Enter 키: 선택된 아이콘 실행
    if (e.key === 'Enter' && selectedIcon) {
      const iconData = [...DESKTOP_ICONS, ...DESKTOP_ICONS_COL2, ...DESKTOP_ICONS_COL3].find(icon => icon.id === selectedIcon.id);
      if (iconData) {
        appLauncher.launchApp(iconData);
      }
      return;
    }
    
    // 방향키 처리
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      
      // 현재 선택된 아이콘이 없으면 첫 번째 아이콘 선택
      if (!selectedIcon) {
        const firstIcon = document.querySelector('.desktop-icon');
        if (firstIcon) {
          clearAllSelections();
          firstIcon.classList.add('selected');
        }
        return;
      }
      
      // 현재 선택된 아이콘의 위치 정보 가져오기
      const selectedRect = selectedIcon.getBoundingClientRect();
      const selectedIndex = iconRects.findIndex(icon => icon.id === selectedIcon.id);
      
      // 방향에 따라 다음 아이콘 찾기
      let nextIcon = null;
      let minDistance = Infinity;
      
      iconRects.forEach(icon => {
        // 자기 자신은 제외
        if (icon.id === selectedIcon.id) return;
        
        const iconRect = icon.rect;
        let isValid = false;
        let distance = 0;
        
        // 방향키에 따라 유효한 아이콘과 거리 계산
        switch (e.key) {
          case 'ArrowUp':
            isValid = iconRect.bottom <= selectedRect.top;
            if (isValid) {
              distance = Math.abs(iconRect.bottom - selectedRect.top) + 
                        Math.abs((iconRect.left + iconRect.right) / 2 - (selectedRect.left + selectedRect.right) / 2) * 0.1;
            }
            break;
          case 'ArrowDown':
            isValid = iconRect.top >= selectedRect.bottom;
            if (isValid) {
              distance = Math.abs(iconRect.top - selectedRect.bottom) + 
                        Math.abs((iconRect.left + iconRect.right) / 2 - (selectedRect.left + selectedRect.right) / 2) * 0.1;
            }
            break;
          case 'ArrowLeft':
            isValid = iconRect.right <= selectedRect.left;
            if (isValid) {
              distance = Math.abs(iconRect.right - selectedRect.left) + 
                        Math.abs((iconRect.top + iconRect.bottom) / 2 - (selectedRect.top + selectedRect.bottom) / 2) * 0.1;
            }
            break;
          case 'ArrowRight':
            isValid = iconRect.left >= selectedRect.right;
            if (isValid) {
              distance = Math.abs(iconRect.left - selectedRect.right) + 
                        Math.abs((iconRect.top + iconRect.bottom) / 2 - (selectedRect.top + selectedRect.bottom) / 2) * 0.1;
            }
            break;
        }
        
        // 유효하고 더 가까운 아이콘이면 업데이트
        if (isValid && distance < minDistance) {
          minDistance = distance;
          nextIcon = icon.element;
        }
      });
      
      // 다음 아이콘이 있으면 선택
      if (nextIcon) {
        clearAllSelections();
        nextIcon.classList.add('selected');
      }
    }
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
  container3.innerHTML = '';

  DESKTOP_ICONS.forEach(iconData => {
    container1.appendChild(createIconElement(iconData));
  });

  DESKTOP_ICONS_COL2.forEach(iconData => {
    container2.appendChild(createIconElement(iconData));
  });

  DESKTOP_ICONS_COL3.forEach(iconData => {
    container3.appendChild(createIconElement(iconData));
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

// 아이콘 데이터를 외부에서 접근할 수 있도록 getter 함수 제공
function getDesktopIcons() {
  return {
    leftColumn: DESKTOP_ICONS,
    rightColumn: DESKTOP_ICONS_COL2,
    thirdColumn: DESKTOP_ICONS_COL3
  };
}

// 모듈 내보내기
export default {
  initializeDesktop,
  getDesktopIcons
};