// logonManager.js
// 이 파일은 초기 로그인 화면 관리 및 메시지 처리를 담당합니다.

class LogonManager {
    constructor() {
        this.logonWindowId = 'logon-window';
        this.isInitialized = false;
    }
    
    // 초기 로그인 화면 표시
    initializeLogonScreen() {
        if (this.isInitialized) return;
        
        // DOM이 준비된 후 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createLogonContainer();
                this.setupMessageListener();
                this.isInitialized = true;
            });
        } else {
            this.createLogonContainer();
            this.setupMessageListener();
            this.isInitialized = true;
        }
    }
    
    // 로그인 컨테이너 생성
    createLogonContainer() {
        const logonContainer = document.createElement('div');
        logonContainer.id = 'logon-container';
        logonContainer.innerHTML = `
            <iframe id="logon-frame" src="app/logon.html"></iframe>
        `;
        
        // CSS 스타일 적용
        logonContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: calc(100%);
            z-index: 1000;
        `;
        
        const logonFrame = logonContainer.querySelector('#logon-frame');
        logonFrame.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        
        document.body.appendChild(logonContainer);
    }
    

    
    // 메시지 리스너 설정
    setupMessageListener() {
        window.addEventListener('message', (event) => {
            const data = event.data;
            
            // 로그인 성공 메시지 처리
            if (data === 'logonSuccess' || (typeof data === 'object' && data !== null && data.type === 'logonSuccess')) {
                this.hideLogonScreen();
                this.removeTaskbarTab();
            }
        });
    }
    
    // 로그인 화면 숨기기
    hideLogonScreen() {
        const logonContainer = document.getElementById('logon-container');
        if (logonContainer) {
            logonContainer.style.display = 'none';
        }
    }
    
    // 작업표시줄에서 로그인 탭 제거
    removeTaskbarTab() {
        const taskbarFrame = document.getElementById('taskbar-frame');
        if (taskbarFrame) {
            taskbarFrame.contentWindow.postMessage({
                type: 'removeTaskbarTab',
                windowId: this.logonWindowId
            }, '*');
        }
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const logonManager = new LogonManager();
export default logonManager;