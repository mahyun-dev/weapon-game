// 검 강화하기 - 모듈 로더
class ModuleLoader {
    static loadModules() {
        // 데이터 파일들 로드 확인
        const requiredDataFiles = [
            'WEAPONS', 'SHOP_ITEMS', 'ITEMS', 'EQUIPMENT',
            'FORGE_RECIPES', 'ACHIEVEMENTS', 'TITLES', 'EQUIPMENT_SLOTS'
        ];

        const missingFiles = requiredDataFiles.filter(dataName => {
            const isLoaded = typeof window[dataName] !== 'undefined';
            console.log(`${dataName}: ${isLoaded ? '✅ 로드됨' : '❌ 로드되지 않음'}`);
            if (!isLoaded) {
                console.error(`❌ ${dataName}이 window 객체에 등록되지 않았습니다.`);
            }
            return !isLoaded;
        });

        if (missingFiles.length > 0) {
            console.error('❌ 필수 데이터 파일들이 로드되지 않았습니다:', missingFiles);
            return false;
        }

        console.log('✅ 모든 데이터 파일이 정상적으로 로드되었습니다.');
        return true;
    }

    static initializeGame() {
        // DOM이 준비될 때까지 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.startGame();
            });
        } else {
            this.startGame();
        }
    }

    static startGame() {
        try {
            console.log('🚀 게임 시작 시도...');
            
            // 모듈 로드 확인
            if (!this.loadModules()) {
                throw new Error('모듈 로드 실패');
            }

            // PWA Manifest 동적 로드 (HTTP/HTTPS에서만)
            this.loadManifest();

            console.log('✅ 모든 검증 통과, 게임 인스턴스 생성...');
            // 게임 시작
            console.log('🎮 검 강화하기 게임을 시작합니다...');
            new SwordUpgradeGame();

        } catch (error) {
            console.error('❌ 게임 초기화 실패:', error);
            this.showError('게임을 시작할 수 없습니다. 페이지를 새로고침해주세요.');
        }
    }

    static loadManifest() {
        // 로컬 파일에서는 manifest를 로드하지 않음 (CORS 문제 방지)
        if (location.protocol === 'file:') {
            console.log('ℹ️ 로컬 파일 환경에서는 PWA manifest를 로드하지 않습니다.');
            return;
        }

        // 기존 manifest link가 있는지 확인
        const existingManifest = document.querySelector('link[rel="manifest"]');
        if (existingManifest) {
            console.log('✅ Manifest link가 이미 존재합니다.');
            return;
        }

        // 동적으로 manifest link 추가
        const manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        manifestLink.href = 'manifest.json';
        document.head.appendChild(manifestLink);
        console.log('✅ PWA manifest가 로드되었습니다.');
    }

    static showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #e74c3c;
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            z-index: 10000;
            font-family: 'Noto Sans KR', sans-serif;
        `;
        errorDiv.innerHTML = `
            <h3>오류 발생</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #e74c3c;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">새로고침</button>
        `;
        document.body.appendChild(errorDiv);
    }
}

// 게임 시작은 index.html에서 호출
// ModuleLoader.initializeGame();