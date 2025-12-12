# 게임 사운드 가이드

이 폴더(assets/sounds/)에는 게임 효과음과 배경음악이 들어갑니다.

## 필요한 사운드 파일

### 효과음 (SFX)
```
assets/sounds/sfx/
├── click.mp3           # 검 클릭 소리
├── upgrade-start.mp3   # 강화 시작 소리
├── upgrade-success.mp3 # 강화 성공 소리
├── upgrade-fail.mp3    # 강화 실패 소리
├── critical.mp3        # 크리티컬 강화 소리
├── level-up.mp3        # 레벨업 소리
├── coin.mp3            # 골드 획득 소리
├── purchase.mp3        # 구매 소리
├── equip.mp3           # 장비 장착 소리
├── achievement.mp3     # 업적 달성 소리
├── button-click.mp3    # 버튼 클릭 소리
└── notification.mp3    # 알림 소리
```

### 배경음악 (BGM)
```
assets/sounds/bgm/
└── main-theme.mp3      # 메인 테마 음악
```

## 사운드 파일 형식

- **권장 형식**: MP3 (호환성 최고)
- **대안 형식**: OGG, WAV
- **파일 크기**: 효과음 10-50KB, BGM 1-3MB
- **비트레이트**: 효과음 64-128kbps, BGM 128-192kbps

## 무료 사운드 리소스

### 효과음
- https://freesound.org/ (무료, 다양한 라이센스)
- https://mixkit.co/free-sound-effects/ (무료, 상업적 사용 가능)
- https://www.zapsplat.com/ (무료, 회원가입 필요)
- https://pixabay.com/sound-effects/ (무료, 저작권 없음)

### 배경음악
- https://incompetech.com/ (무료, CC 라이센스)
- https://www.bensound.com/ (무료, 크레딧 필요)
- https://pixabay.com/music/ (무료, 저작권 없음)

## 추천 사운드 스타일

### 강화 성공
- 밝고 경쾌한 벨 소리
- 상승하는 톤
- 예: "success chime", "level up"

### 강화 실패
- 낮고 무거운 소리
- 하강하는 톤
- 예: "fail buzz", "error sound"

### 크리티컬
- 폭발적이고 화려한 소리
- 여러 레이어의 효과음
- 예: "epic hit", "critical strike"

### 배경음악
- 판타지 RPG 스타일
- 루프 가능한 음악
- 템포: 80-120 BPM

## 사운드 구현 예시

게임에 사운드를 추가하려면 `script.js`에 다음과 같이 구현:

```javascript
// 사운드 관리자 클래스
class SoundManager {
    constructor() {
        this.sounds = {
            click: new Audio('assets/sounds/sfx/click.mp3'),
            upgradeStart: new Audio('assets/sounds/sfx/upgrade-start.mp3'),
            upgradeSuccess: new Audio('assets/sounds/sfx/upgrade-success.mp3'),
            upgradeFail: new Audio('assets/sounds/sfx/upgrade-fail.mp3'),
            critical: new Audio('assets/sounds/sfx/critical.mp3'),
            coin: new Audio('assets/sounds/sfx/coin.mp3'),
            achievement: new Audio('assets/sounds/sfx/achievement.mp3'),
            buttonClick: new Audio('assets/sounds/sfx/button-click.mp3')
        };
        
        this.bgm = new Audio('assets/sounds/bgm/main-theme.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.3;
        
        this.muted = false;
        this.volume = 0.5;
    }
    
    play(soundName) {
        if (this.muted) return;
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].volume = this.volume;
            this.sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    playBGM() {
        if (this.muted) return;
        this.bgm.play().catch(e => console.log('BGM play failed:', e));
    }
    
    stopBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }
    
    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBGM();
        } else {
            this.playBGM();
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
        this.bgm.volume = this.volume * 0.3;
    }
}

// 사용 예시
const soundManager = new SoundManager();

// 검 클릭 시
soundManager.play('click');

// 강화 시작
soundManager.play('upgradeStart');

// 강화 성공
soundManager.play('upgradeSuccess');

// 강화 실패
soundManager.play('upgradeFail');

// 크리티컬
soundManager.play('critical');
```

## 설정 메뉴 추가

사용자가 사운드를 제어할 수 있도록 설정 추가:
- 🔊 사운드 ON/OFF
- 🎵 배경음악 ON/OFF
- 🎚️ 볼륨 슬라이더
- 🎼 효과음 볼륨 별도 조절

## 주의사항

1. **자동 재생 정책**: 브라우저는 사용자 상호작용 없이 자동으로 소리를 재생하는 것을 차단합니다.
2. **첫 번째 클릭 후 재생**: 게임 시작 시 사용자가 첫 클릭을 한 후에 배경음악을 시작하세요.
3. **파일 크기**: 사운드 파일이 너무 크면 로딩 시간이 길어집니다. 압축하세요.
4. **저작권**: 무료 리소스를 사용할 때도 라이센스를 확인하세요.

## 라이센스 표기

무료 사운드를 사용하는 경우, 크레딧 표기가 필요할 수 있습니다.
게임 설정 메뉴나 크레딧 페이지에 다음과 같이 표기:

```
사운드 크레딧:
- 효과음: Freesound.org
- 배경음악: Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0
```
