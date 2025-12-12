// 사운드 시스템 모듈
class SoundSystem {
    constructor(game) {
        this.game = game;
        this.initializeSoundSystem();
        this.setupSoundUnlock();
    }

    // 사운드 시스템 초기화
    initializeSoundSystem() {
        this.soundManager = {
            sounds: {},
            bgm: null,
            enabled: this.game.gameData.settings.soundEnabled !== false,
            volume: 0.5,
            bgmVolume: 0.3,
            initialized: false,
            currentPlaying: null // 현재 재생 중인 사운드 추적
        };

        // 사운드 파일 정의
        const soundFiles = {
            click: 'assets/sounds/sfx/click.mp3',
            upgradeStart: 'assets/sounds/sfx/upgrade-start.mp3',
            upgradeSuccess: 'assets/sounds/sfx/upgrade-success.mp3',
            upgradeFail: 'assets/sounds/sfx/upgrade-fail.mp3',
            critical: 'assets/sounds/sfx/critical.mp3',
            levelUp: 'assets/sounds/sfx/level-up.mp3',
            coin: 'assets/sounds/sfx/coin.mp3',
            purchase: 'assets/sounds/sfx/purchase.mp3',
            equip: 'assets/sounds/sfx/equip.mp3',
            achievement: 'assets/sounds/sfx/achievement.mp3',
            buttonClick: 'assets/sounds/sfx/button-click.mp3',
            notification: 'assets/sounds/sfx/notification.mp3'
        };

        // Audio 객체 생성
        try {
            Object.entries(soundFiles).forEach(([name, path]) => {
                const audio = new Audio(path);
                audio.volume = this.soundManager.volume;
                audio.preload = 'auto';
                audio.loop = false; // 반복 재생 방지
                
                // 재생 종료 이벤트
                audio.addEventListener('ended', () => {
                    if (this.soundManager.currentPlaying === name) {
                        this.soundManager.currentPlaying = null;
                    }
                });
                
                this.soundManager.sounds[name] = audio;
            });

            this.soundManager.bgm = new Audio('assets/sounds/bgm/main-theme.mp3');
            this.soundManager.bgm.loop = true;
            this.soundManager.bgm.volume = this.soundManager.bgmVolume;
            
            console.log('✅ 사운드 시스템 초기화 완료');
        } catch (error) {
            console.warn('⚠️ 사운드 초기화 실패:', error);
        }
    }

    // 사운드 자동재생 잠금 해제
    setupSoundUnlock() {
        const unlockSound = () => {
            if (!this.soundManager.initialized) {
                this.soundManager.initialized = true;
                console.log('🎵 사운드 시스템 활성화');
            }

            // BGM 시작 (사운드가 켜져있고, 아직 재생 중이 아닌 경우)
            if (this.soundManager.enabled &&
                this.soundManager.bgm &&
                this.soundManager.bgm.paused) {
                this.soundManager.bgm.play().catch((e) => {
                    console.log('BGM 자동재생 차단됨 (정상)');
                });
            }
        };

        // 여러 종류의 사용자 상호작용 감지
        document.addEventListener('click', unlockSound);
        document.addEventListener('touchstart', unlockSound);
        document.addEventListener('keydown', unlockSound);
    }

    // 효과음 재생
    playSound(soundName) {
        if (!this.soundManager.enabled || !this.soundManager.sounds[soundName]) return;
        
        try {
            const sound = this.soundManager.sounds[soundName];
            
            // 모든 효과음 중지 (BGM 제외)
            Object.entries(this.soundManager.sounds).forEach(([name, audio]) => {
                if (audio && !audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
            
            // 새 사운드 재생
            sound.currentTime = 0;
            sound.volume = this.soundManager.volume;
            sound.loop = false;
            this.soundManager.currentPlaying = soundName;
            
            sound.play().catch(() => {
                this.soundManager.currentPlaying = null;
            });
        } catch (error) {
            this.soundManager.currentPlaying = null;
        }
    }

    // 모든 효과음 중지
    stopAllSounds() {
        Object.values(this.soundManager.sounds).forEach(sound => {
            if (sound && !sound.paused) {
                sound.pause();
                sound.currentTime = 0;
            }
        });
        this.soundManager.currentPlaying = null;
    }

    // BGM 재생
    playBGM() {
        if (!this.soundManager.enabled || !this.soundManager.bgm) return;
        
        // 이미 재생 중이면 중복 재생 방지
        if (!this.soundManager.bgm.paused) return;
        
        this.soundManager.bgm.volume = this.soundManager.bgmVolume;
        this.soundManager.bgm.play().catch((e) => {
            console.log('BGM 재생 실패:', e.message);
        });
    }

    // BGM 중지
    stopBGM() {
        if (this.soundManager.bgm && !this.soundManager.bgm.paused) {
            this.soundManager.bgm.pause();
        }
    }

    // 사운드 토글
    toggleSound() {
        this.soundManager.enabled = !this.soundManager.enabled;
        this.game.gameData.settings.soundEnabled = this.soundManager.enabled;

        if (this.soundManager.enabled) {
            // 사운드 켤 때 BGM 시작
            this.soundManager.initialized = true; // 강제 활성화
            if (this.soundManager.bgm) {
                this.soundManager.bgm.volume = this.soundManager.bgmVolume;
                this.soundManager.bgm.play().catch((e) => {
                    console.warn('BGM 재생 실패:', e.message);
                });
            }
        } else {
            // 사운드 끌 때 BGM과 모든 효과음 중지
            this.stopBGM();
            this.stopAllSounds();
        }

        this.game.saveGameData();
        return this.soundManager.enabled;
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SoundSystem };
}