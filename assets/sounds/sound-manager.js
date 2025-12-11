// 사운드 관리 시스템
// 이 파일을 script.js에 추가하거나 별도로 로드하세요

class SoundManager {
    constructor() {
        // 효과음 정의
        this.sounds = {};
        this.bgm = null;
        this.enabled = true;
        this.volume = 0.5;
        this.bgmVolume = 0.3;
        
        // LocalStorage에서 설정 불러오기
        this.loadSettings();
    }

    // 사운드 초기화
    init() {
        try {
            this.sounds = {
                click: this.createAudio('assets/sounds/sfx/click.mp3'),
                upgradeStart: this.createAudio('assets/sounds/sfx/upgrade-start.mp3'),
                upgradeSuccess: this.createAudio('assets/sounds/sfx/upgrade-success.mp3'),
                upgradeFail: this.createAudio('assets/sounds/sfx/upgrade-fail.mp3'),
                critical: this.createAudio('assets/sounds/sfx/critical.mp3'),
                levelUp: this.createAudio('assets/sounds/sfx/level-up.mp3'),
                coin: this.createAudio('assets/sounds/sfx/coin.mp3'),
                purchase: this.createAudio('assets/sounds/sfx/purchase.mp3'),
                equip: this.createAudio('assets/sounds/sfx/equip.mp3'),
                achievement: this.createAudio('assets/sounds/sfx/achievement.mp3'),
                buttonClick: this.createAudio('assets/sounds/sfx/button-click.mp3'),
                notification: this.createAudio('assets/sounds/sfx/notification.mp3')
            };

            this.bgm = this.createAudio('assets/sounds/bgm/main-theme.mp3');
            this.bgm.loop = true;
            this.bgm.volume = this.bgmVolume;

            console.log('✅ 사운드 시스템 초기화 완료');
        } catch (error) {
            console.warn('⚠️ 사운드 파일을 찾을 수 없습니다:', error);
        }
    }

    // Audio 객체 생성
    createAudio(src) {
        const audio = new Audio();
        audio.src = src;
        audio.volume = this.volume;
        audio.preload = 'auto';
        
        // 로드 에러 처리
        audio.addEventListener('error', () => {
            console.warn(`사운드 로드 실패: ${src}`);
        });
        
        return audio;
    }

    // 효과음 재생
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName];
            sound.currentTime = 0;
            sound.volume = this.volume;
            sound.play().catch(err => {
                // 자동 재생 정책으로 인한 에러는 무시
                if (err.name !== 'NotAllowedError') {
                    console.warn('사운드 재생 실패:', soundName, err);
                }
            });
        } catch (error) {
            console.warn('사운드 재생 중 오류:', error);
        }
    }

    // 배경음악 재생
    playBGM() {
        if (!this.enabled || !this.bgm) return;
        
        try {
            this.bgm.volume = this.bgmVolume;
            this.bgm.play().catch(err => {
                console.log('BGM 자동 재생이 차단되었습니다. 사용자 상호작용 후 재생됩니다.');
            });
        } catch (error) {
            console.warn('BGM 재생 중 오류:', error);
        }
    }

    // 배경음악 중지
    stopBGM() {
        if (!this.bgm) return;
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }

    // 배경음악 일시정지
    pauseBGM() {
        if (!this.bgm) return;
        this.bgm.pause();
    }

    // 배경음악 재개
    resumeBGM() {
        if (!this.enabled || !this.bgm) return;
        this.bgm.play().catch(err => console.log('BGM 재개 실패'));
    }

    // 사운드 ON/OFF
    toggle() {
        this.enabled = !this.enabled;
        
        if (!this.enabled) {
            this.stopBGM();
        } else {
            this.playBGM();
        }
        
        this.saveSettings();
        return this.enabled;
    }

    // 볼륨 설정 (0.0 ~ 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // 모든 효과음 볼륨 업데이트
        Object.values(this.sounds).forEach(sound => {
            if (sound) sound.volume = this.volume;
        });
        
        this.saveSettings();
    }

    // 배경음악 볼륨 설정
    setBGMVolume(volume) {
        this.bgmVolume = Math.max(0, Math.min(1, volume));
        if (this.bgm) {
            this.bgm.volume = this.bgmVolume;
        }
        this.saveSettings();
    }

    // 설정 저장
    saveSettings() {
        localStorage.setItem('soundSettings', JSON.stringify({
            enabled: this.enabled,
            volume: this.volume,
            bgmVolume: this.bgmVolume
        }));
    }

    // 설정 불러오기
    loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('soundSettings'));
            if (settings) {
                this.enabled = settings.enabled !== undefined ? settings.enabled : true;
                this.volume = settings.volume !== undefined ? settings.volume : 0.5;
                this.bgmVolume = settings.bgmVolume !== undefined ? settings.bgmVolume : 0.3;
            }
        } catch (error) {
            console.warn('사운드 설정 불러오기 실패');
        }
    }

    // 모든 사운드 중지
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
        this.stopBGM();
    }
}

// 전역 사운드 매니저 인스턴스
// script.js에서 다음과 같이 사용:
// const soundManager = new SoundManager();
// soundManager.init();

// 사용자 첫 상호작용 시 BGM 시작
// document.addEventListener('click', () => {
//     soundManager.playBGM();
// }, { once: true });
