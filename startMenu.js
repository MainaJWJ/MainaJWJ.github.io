// startMenu.js
// 이 파일은 Windows XP 시작 메뉴를 생성하고 관리하는 모듈입니다.

class StartMenu {
  constructor() {
    // 시작 메뉴가 열려 있는지 여부를 추적하는 속성
    this.isOpen = false;
    
    // 시작 메뉴 요소를 생성합니다.
    this.createStartMenu();
    
    // 이벤트 리스너를 등록합니다.
    this.addEventListeners();
  }

  // 시작 메뉴 HTML 요소를 생성하는 메서드
  createStartMenu() {
    // 시작 메뉴 컨테이너 생성
    this.startMenuEl = document.createElement('div');
    this.startMenuEl.className = 'start-menu';
    this.startMenuEl.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 0;
      width: 386px;
      height: 520px;
      background-color: #4282d6;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      box-shadow: 1px 0px 3px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      display: none;
      font-family: Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11px;
    `;

    // 시작 메뉴 HTML 내용
    this.startMenuEl.innerHTML = `
      <!-- 헤더 영역 -->
      <header class="start-menu-header" style="
        position: relative;
        align-self: flex-start;
        display: flex;
        align-items: center;
        color: #fff;
        height: 40px;
        padding: 7px 4px 6px;
        width: 376px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        background: linear-gradient(
            to bottom,
            #1868ce 0%,
            #0e60cb 12%,
            #0e60cb 20%,
            #1164cf 32%,
            #1667cf 33%,
            #1b6cd3 47%,
            #1e70d9 54%,
            #2476dc 60%,
            #297ae0 65%,
            #3482e3 77%,
            #3786e5 79%,
            #428ee9 90%,
            #4791eb 100%
        );
        overflow: hidden;
      ">
        <div style="
          content: '';
          display: block;
          position: absolute;
          top: 1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
              to right,
              transparent 0,
              rgba(255, 255, 255, 0.3) 1%,
              rgba(255, 255, 255, 0.5) 2%,
              rgba(255, 255, 255, 0.5) 95%,
              rgba(255, 255, 255, 0.3) 98%,
              rgba(255, 255, 255, 0.2) 99%,
              transparent 100%
          );
          box-shadow: inset 0 -1px 1px #0e60cb;
        "></div>
        <img class="header-img" src="../image/usericon.png" alt="avatar" style="
          width: 38px;
          height: 38px;
          margin-right: 5px;
          border-radius: 3px;
          border: 2px solid rgba(222, 222, 222, 0.8);
        ">
        <span class="header-text" style="
          font-size: 14px;
          font-weight: 700;
          text-shadow: 1px 1px rgba(0, 0, 0, 0.7);
        ">User</span>
      </header>
      
      <!-- 메뉴 내용 -->
      <section class="start-menu-content" style="
        display: flex;
        margin: 0 2px;
        position: relative;
        border-top: 1px solid #385de7;
        box-shadow: 0 1px #385de7;
        flex: 1;
      ">
        <hr class="orange-hr" style="
          position: absolute;
          left: 0;
          right: 0;
          top: -6px;
          display: block;
          height: 3px;
          background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0) 0%,
              #da884a 50%,
              rgba(0, 0, 0, 0) 100%
          );
          border: 0;
        ">
        <!-- 왼쪽 메뉴 -->
        <div class="menu-left" style="
          background-color: #fff;
          padding: 6px 5px 0;
          width: 180px;
          display: flex;
          flex-direction: column;
        ">
          <div class="menu-item" id="internet-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/earth.png" alt="Internet" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text menu-item-bold" style="
                font-weight: 700;
              ">Internet</div>
              <div class="menu-item-subtext" style="
                color: rgba(0, 0, 0, 0.4);
                line-height: 12px;
                margin-bottom: 1px;
              ">Internet Explorer</div>
            </div>
          </div>
          <div class="menu-item" id="email-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/messenger.png" alt="E-mail" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text menu-item-bold" style="
                font-weight: 700;
              ">E-mail</div>
              <div class="menu-item-subtext" style="
                color: rgba(0, 0, 0, 0.4);
                line-height: 12px;
                margin-bottom: 1px;
              ">Outlook Express</div>
            </div>
          </div>
          <div class="menu-separator" style="
            height: 2px;
            background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.1) 50%,
                rgba(0, 0, 0, 0) 100%
            );
            border-top: 3px solid transparent;
            border-bottom: 3px solid transparent;
            background-clip: content-box;
          "></div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/minesweeper.png" alt="Minesweeper" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Minesweeper</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/texteditor.png" alt="Notepad" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Notepad</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/mediaplayer.png" alt="Winamp" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Winamp</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/paint.png" alt="Paint" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Paint</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/mediaplayer.png" alt="Windows Media Player" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Windows Media Player</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <img class="menu-item-img" src="../image/messenger.png" alt="Windows Messenger" style="
              margin-right: 3px;
              width: 30px;
              height: 30px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Windows Messenger</div>
            </div>
          </div>
          <div style="flex: 1;"></div>
          <div class="menu-separator" style="
            height: 2px;
            background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0.1) 50%,
                rgba(0, 0, 0, 0) 100%
            );
            border-top: 3px solid transparent;
            border-bottom: 3px solid transparent;
            background-clip: content-box;
          "></div>
          <div class="menu-item" id="all-programs-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 34px;
          ">
            <!-- All Programs 항목: 글자 진하게 및 가운데 정렬 -->
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
            <div class="menu-item-text menu-item-bold" style="
              font-weight: 700;  
              text-align: center; 
              padding-left: 40px;
            ">AllPrograms</div>
            </div>
            <img class="menu-item-img" src="../image/allprogram.png" alt="All Programs" style="
              margin-left: 5px; 
              height: 18px; 
              width: 18px;
              margin-right: 3px;
            ">
            <div class="menu-arrow" style="
              border: 3.5px solid transparent;
              border-right: 0;
              border-left-color: #00136b;
              position: absolute;
              right: 5px;
              top: 50%;
              transform: translateY(-50%);
            "></div>
            <!-- 하위 메뉴 -->
            <div class="submenu" id="all-programs-submenu" style="
              position: absolute;
              left: 100%;
              top: auto;
              bottom: 0;
              width: 200px;
              background-color: #fff;
              border: 1px solid #000;
              z-index: 1000;
              display: none;
            ">
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/mediaplayer.png" alt="Accessories" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Accessories</div>
              </div>
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/mediaplayer.png" alt="Games" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Games</div>
              </div>
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/mediaplayer.png" alt="Startup" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Startup</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 오른쪽 메뉴 -->
        <div class="menu-right" style="
          background-color: #cbe3ff;
          border-left: solid rgba(58, 58, 255, 0.37) 1px;
          padding: 6px 5px 5px;
          width: 180px;
          color: #00136b;
        ">
          <!-- My Documents 항목의 글자 두께를 일반 텍스트로 변경 (왼쪽 메뉴와 일관성 유지) -->
          <div class="menu-item" id="documents-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/docfolder.png" alt="My Documents" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">My Documents</div>
            </div>
          </div>
          <div class="menu-item" id="recent-documents-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/recentfolder.png" alt="My Recent Documents" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">My Recent Documents</div>
            </div>
            <div class="menu-arrow" style="
              border: 3.5px solid transparent;
              border-right: 0;
              border-left-color: #00136b;
              position: absolute;
              right: 5px;
              top: 50%;
              transform: translateY(-50%);
            "></div>
            <!-- 하위 메뉴 -->
            <div class="submenu" id="recent-documents-submenu" style="
              position: absolute;
              left: 100%;
              top: auto;
              bottom: 0;
              width: 200px;
              background-color: #fff;
              border: 1px solid #000;
              z-index: 1000;
              display: none;
            ">
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/file.png" alt="Document1.txt" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Document1.txt</div>
              </div>
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/file.png" alt="Document2.txt" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Document2.txt</div>
              </div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/photofolder.png" alt="My Pictures" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">My Pictures</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/musicfolder.png" alt="My Music" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">My Music</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/mycomputer.png" alt="My Computer" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">My Computer</div>
            </div>
          </div>
          <div class="menu-separator" style="
            height: 2px;
            background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0) 0%,
                rgba(135, 179, 226, 0.71) 50%,
                rgba(0, 0, 0, 0) 100%
            );
            background-clip: content-box;
          "></div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/panel.png" alt="Control Panel" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Control Panel</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/protect.png" alt="Set Program Access and Defaults" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Set Program Access and Defaults</div>
            </div>
          </div>
          <div class="menu-item" id="connect-to-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/network.png" alt="Connect To" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Connect To</div>
            </div>
            <div class="menu-arrow" style="
              border: 3.5px solid transparent;
              border-right: 0;
              border-left-color: #00136b;
              position: absolute;
              right: 5px;
              top: 50%;
              transform: translateY(-50%);
            "></div>
            <!-- 하위 메뉴 -->
            <div class="submenu" id="connect-to-submenu" style="
              position: absolute;
              left: 100%;
              top: auto;
              bottom: 0;
              width: 200px;
              background-color: #fff;
              border: 1px solid #000;
              z-index: 1000;
              display: none;
            ">
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/network.png" alt="Network" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Network</div>
              </div>
              <div class="submenu-item" style="
                padding: 1px;
                display: flex;
                align-items: center;
                height: 24px;
                margin-bottom: 0px;
                color: #000;
                border-left: 3px solid #2f71cd;
              ">
                <img class="submenu-item-img" src="../image/network.png" alt="Internet" style="
                  width: 16px;
                  height: 16px;
                  margin-left: 4px;
                  margin-right: 10px;
                ">
                <div class="menu-item-text">Internet</div>
              </div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/printer.png" alt="Printers and Faxes" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Printers and Faxes</div>
            </div>
          </div>
          <div class="menu-separator" style="
            height: 2px;
            background: linear-gradient(
                to right,
                rgba(0, 0, 0, 0) 0%,
                rgba(135, 179, 226, 0.71) 50%,
                rgba(0, 0, 0, 0) 100%
            );
            background-clip: content-box;
          "></div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/help.png" alt="Help and Support" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Help and Support</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/search.png" alt="Search" style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Search</div>
            </div>
          </div>
          <div class="menu-item" style="
            padding: 1px;
            display: flex;
            align-items: center;
            margin-bottom: 4px;
            position: relative;
            height: 26px;
            line-height: 13px;
          ">
            <img class="menu-item-img" src="../image/cmd.png" alt="Run..." style="
              margin-right: 3px;
              width: 22px;
              height: 22px;
            ">
            <div class="menu-item-texts" style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              position: relative;
            ">
              <div class="menu-item-text">Run...</div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- 푸터 영역 -->
      <footer class="start-menu-footer" style="
        display: flex;
        align-self: flex-end;
        align-items: center;
        justify-content: flex-end;
        color: #fff;
        height: 38px;
        width: 100%;
        background: linear-gradient(
            to bottom,
            #4282d6 0%,
            #3b85e0 3%,
            #418ae3 5%,
            #418ae3 17%,
            #3c87e2 21%,
            #3786e4 26%,
            #3482e3 29%,
            #2e7ee1 39%,
            #2374df 49%,
            #2072db 57%,
            #196edb 62%,
            #176bd8 72%,
            #1468d5 75%,
            #1165d2 83%,
            #0f61cb 88%
        );
      ">
        <!-- Log Off 및 Turn Off Computer 버튼에 호버 및 클릭 효과 추가 -->
        <!-- 호버 시 이미지 밝아짐, 클릭 시 어두워짐 효과를 위해 filter 속성 사용 -->
        <div class="footer-item" style="
          padding: 3px;
          display: flex;
          margin-right: 10px;
          align-items: center;
          height: 30px;
        " onmouseenter="this.style.backgroundColor='rgba(60, 80, 210, 0.5)'; this.querySelector('.footer-item-img').style.filter='brightness(1.05)'" onmouseleave="this.style.backgroundColor=''; this.querySelector('.footer-item-img').style.filter=''" onmousedown="this.style.transform='translate(1px, 1px)'; this.querySelector('.footer-item-img').style.filter='brightness(0.85)'" onmouseup="this.style.transform=''; this.querySelector('.footer-item-img').style.filter='brightness(1.05)'">
          <img class="footer-item-img" src="../image/logoff.png" alt="" style="
            border-radius: 3px;
            margin-right: 2px;
            width: 22px;
            height: 22px;
          ">
          <span>Log Off</span>
        </div>
        <div class="footer-item" style="
          padding: 3px;
          display: flex;
          margin-right: 10px;
          align-items: center;
          height: 30px;
        " onmouseenter="this.style.backgroundColor='rgba(60, 80, 210, 0.5)'; this.querySelector('.footer-item-img').style.filter='brightness(1.05)'" onmouseleave="this.style.backgroundColor=''; this.querySelector('.footer-item-img').style.filter=''" onmousedown="this.style.transform='translate(1px, 1px)'; this.querySelector('.footer-item-img').style.filter='brightness(0.85)'" onmouseup="this.style.transform=''; this.querySelector('.footer-item-img').style.filter='brightness(1.05)'">
          <img class="footer-item-img" src="../image/turnoff.png" alt="" style="
            border-radius: 3px;
            margin-right: 2px;
            width: 22px;
            height: 22px;
          ">
          <span>Turn Off Computer</span>
        </div>
      </footer>
    `;

    // 시작 메뉴를 body에 추가
    document.body.appendChild(this.startMenuEl);
  }

  // 이벤트 리스너를 등록하는 메서드
  addEventListeners() {
    // 시작 메뉴 항목에 대한 호버 효과
    this.startMenuEl.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.color = 'white';
        item.style.backgroundColor = '#2f71cd';
        
        // 서브 텍스트 색상 변경
        const subtext = item.querySelector('.menu-item-subtext');
        if (subtext) {
          subtext.style.color = 'white';
        }
        
        // 화살표 색상 변경
        const arrow = item.querySelector('.menu-arrow');
        if (arrow) {
          arrow.style.borderLeftColor = '#fff';
        }
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.color = '';
        item.style.backgroundColor = '';
        
        // 서브 텍스트 색상 복원
        const subtext = item.querySelector('.menu-item-subtext');
        if (subtext) {
          subtext.style.color = 'rgba(0, 0, 0, 0.4)';
        }
        
        // 화살표 색상 복원
        const arrow = item.querySelector('.menu-arrow');
        if (arrow) {
          arrow.style.borderLeftColor = '#00136b';
        }
      });
    });
    
    // 하위 메뉴 항목에 대한 호버 효과
    this.startMenuEl.querySelectorAll('.submenu-item').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.color = 'white';
        item.style.backgroundColor = '#2f71cd';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.color = '#000';
        item.style.backgroundColor = '';
      });
    });
    
    // 하위 메뉴 표시를 위한 이벤트 리스너
    const allProgramsItem = document.getElementById('all-programs-item');
    if (allProgramsItem) {
      allProgramsItem.addEventListener('mouseenter', () => {
        document.getElementById('all-programs-submenu').style.display = 'block';
      });
      
      allProgramsItem.addEventListener('mouseleave', () => {
        document.getElementById('all-programs-submenu').style.display = 'none';
      });
    }
    
    const recentDocumentsItem = document.getElementById('recent-documents-item');
    if (recentDocumentsItem) {
      recentDocumentsItem.addEventListener('mouseenter', () => {
        document.getElementById('recent-documents-submenu').style.display = 'block';
      });
      
      recentDocumentsItem.addEventListener('mouseleave', () => {
        document.getElementById('recent-documents-submenu').style.display = 'none';
      });
    }
    
    const connectToItem = document.getElementById('connect-to-item');
    if (connectToItem) {
      connectToItem.addEventListener('mouseenter', () => {
        document.getElementById('connect-to-submenu').style.display = 'block';
      });
      
      connectToItem.addEventListener('mouseleave', () => {
        document.getElementById('connect-to-submenu').style.display = 'none';
      });
    }
  }

  // 시작 메뉴를 토글하는 메서드
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // 시작 메뉴를 여는 메서드
  open() {
    this.startMenuEl.style.display = 'flex';
    this.isOpen = true;
  }

  // 시작 메뉴를 닫는 메서드
  close() {
    this.startMenuEl.style.display = 'none';
    this.isOpen = false;
  }
}

// StartMenu 인스턴스 생성 및 내보내기
const startMenu = new StartMenu();
export default startMenu;