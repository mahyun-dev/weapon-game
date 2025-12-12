class SwordUpgradeGame {
    constructor() {
        this.gameData = this.loadGameData();

        // 시스템 초기화
        this.soundSystem = new SoundSystem(this);
        this.upgradeSystem = new UpgradeSystem(this);
        this.shopSystem = new ShopSystem(this);
        this.inventorySystem = new InventorySystem(this);
        this.forgeSystem = new ForgeSystem(this);
        this.titleSystem = new TitleSystem(this);
        this.achievementSystem = new AchievementSystem(this);

        this.initializeUI();
        this.setupEventListeners();
        this.updateDisplay();
        this.startAutoSystems();
        this.hideLoadingScreen();
    }

    

    // 게임 데이터 로드
    loadGameData() {
        const defaultData = {
            gold: 1000,
            swordLevel: 0,
            protectionItems: {},
            equipment: {},
            inventory: {},
            achievements: {},
            titles: {
                beginner_adventurer: TITLES.find(t => t.id === 'beginner_adventurer')
            },
            activeTitle: 'beginner_adventurer',
            stats: {
                totalClicks: 0,
                totalUpgrades: 0,
                successfulUpgrades: 0,
                failedUpgrades: 0,
                criticalUpgrades: 0,
                consecutiveSuccess: 0,
                consecutiveFailures: 0,
                maxConsecutiveSuccess: 0,
                maxConsecutiveFailures: 0,
                totalGoldEarned: 1000,
                playTime: 0,
                lastSave: Date.now(),
                totalForges: 0,
                reached20WithoutProtection: false,
                usedProtectionTo20: false,
                successAt30Percent: false
            },
            settings: {
                soundEnabled: true,
                notificationsEnabled: true,
                autoSaveEnabled: true
            },
            daily: {
                lastLogin: 0,
                freeMaterials: 5,
                quests: {}
            },
            ceilingSystem: {
                failureCount: 0,
                lastCeilingLevel: 0
            }
        };

        const savedData = localStorage.getItem('swordUpgradeGame');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                return { ...defaultData, ...parsed };
            } catch (e) {
                console.error('저장된 게임 데이터를 불러올 수 없습니다:', e);
            }
        }

        return defaultData;
    }

    // 게임 데이터 저장
    saveGameData() {
        if (this.gameData.settings.autoSaveEnabled) {
            this.gameData.stats.lastSave = Date.now();
            localStorage.setItem('swordUpgradeGame', JSON.stringify(this.gameData));
        }
    }

    // UI 초기화
    initializeUI() {
        this.updateSwordDisplay();
        this.updateShopDisplay();
        this.updateInventoryDisplay();
        this.updateAchievementsDisplay();
        this.updateTitleDisplay();
        this.checkDailyReset();
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 검 클릭
        const swordImage = document.getElementById('sword-image');
        if (swordImage) {
            swordImage.addEventListener('click', () => {
                this.clickSword();
            });
        }

        // 강화 버튼
        const upgradeBtn = document.getElementById('upgrade-btn');
        if (upgradeBtn) {
            upgradeBtn.addEventListener('click', () => {
                this.attemptUpgrade();
            });
        }

        // 판매 버튼
        const sellBtn = document.getElementById('sell-btn');
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                this.showSellConfirm();
            });
        }

        // 판매 확인
        const sellConfirmYes = document.getElementById('sell-confirm-yes');
        if (sellConfirmYes) {
            sellConfirmYes.addEventListener('click', () => {
                this.sellSword();
                this.hideModal('sell-confirm-modal');
            });
        }

        const sellConfirmNo = document.getElementById('sell-confirm-no');
        if (sellConfirmNo) {
            sellConfirmNo.addEventListener('click', () => {
                this.hideModal('sell-confirm-modal');
            });
        }

        // 모달 닫기
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal.id);
            });
        });

        // 모달 오버레이 클릭
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'modal-overlay') {
                    this.hideAllModals();
                }
            });
        }

        // 하단 메뉴
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('shop-modal');
            });
        }

        const inventoryBtn = document.getElementById('inventory-btn');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('inventory-modal');
                this.updateInventoryGrid();
            });
        }

        const equipmentBtn = document.getElementById('equipment-btn');
        if (equipmentBtn) {
            equipmentBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('equipment-modal');
                this.updateEquipmentDisplay();
            });
        }

        const forgeBtn = document.getElementById('forge-btn');
        if (forgeBtn) {
            forgeBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('forge-modal');
                this.updateForgeDisplay();
            });
        }

        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('achievements-modal');
            });
        }

        const titleBtn = document.getElementById('title-btn');
        if (titleBtn) {
            titleBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('title-modal');
                this.updateTitlesListDisplay();
            });
        }

        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.soundSystem.playSound('buttonClick');
                this.showModal('settings-modal');
            });
        }

        // 상점 탭
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchShopTab(e.target.dataset.tab);
            });
        });

        // 설정 버튼들
        const soundToggleBtn = document.getElementById('sound-toggle-btn');
        if (soundToggleBtn) {
            soundToggleBtn.addEventListener('click', () => {
                const enabled = this.toggleSound();
                const statusText = document.getElementById('sound-status');
                const btnText = soundToggleBtn;
                if (statusText) {
                    statusText.textContent = enabled ? '🔊 사운드: ON' : '🔇 사운드: OFF';
                }
                if (btnText) {
                    btnText.textContent = enabled ? '끄기' : '켜기';
                }
            });
            
            // 초기 상태 설정
            const statusText = document.getElementById('sound-status');
            if (statusText) {
                statusText.textContent = this.isSoundEnabled() ? '🔊 사운드: ON' : '🔇 사운드: OFF';
            }
            soundToggleBtn.textContent = this.isSoundEnabled() ? '끄기' : '켜기';
        }

        const resetDataBtn = document.getElementById('reset-data-btn');
        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', () => {
                this.resetGameData();
            });
        }

        const exportDataBtn = document.getElementById('export-data-btn');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportGameData();
            });
        }

        const importDataBtn = document.getElementById('import-data-btn');
        if (importDataBtn) {
            importDataBtn.addEventListener('click', () => {
                this.importGameData();
            });
        }

        // 업적 리스트 이벤트 위임
        const achievementsList = document.getElementById('achievements-list');
        if (achievementsList) {
            achievementsList.addEventListener('click', (e) => {
                const achievementItem = e.target.closest('.achievement-item');
                if (achievementItem) {
                    e.stopPropagation();
                    const achievementId = achievementItem.dataset.id;
                this.showAchievementDetail(achievementId);
            }
        });
    }

    // 업적 상세 모달 닫기 버튼
    const achievementDetailCloseBtn = document.querySelector('#achievement-detail-modal .close-btn');
    if (achievementDetailCloseBtn) {
        achievementDetailCloseBtn.addEventListener('click', () => {
            this.hideModal('achievement-detail-modal');
        });
    }
}    // 검 클릭
    clickSword() {
        const clickPower = this.calculateClickPower();
        this.gameData.gold += clickPower;
        this.gameData.stats.totalClicks++;
        this.gameData.stats.totalGoldEarned += clickPower;

        this.soundSystem.playSound('click');
        this.updateDisplay();
        this.createClickEffect(clickPower);
        this.checkAchievements();
    }

    // 클릭 파워 계산
    calculateClickPower() {
        const weapon = WEAPONS[this.gameData.swordLevel];
        let basePower = weapon ? weapon.clickGold : 1;

        // 장비 효과 적용
        Object.values(this.gameData.equipment).forEach(equipment => {
            if (equipment && equipment.effect === 'clickGoldMultiplier') {
                basePower *= (1 + equipment.value / 100);
            }
        });

        // 특수 아이템 효과 적용
        if (this.gameData.equipment.warpTicket) {
            basePower *= this.gameData.equipment.warpTicket.value;
        }

        // 활성 칭호 효과
        const activeTitleId = this.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.gameData.titles[activeTitleId];
        if (activeTitle && activeTitle.effect.type === 'clickGoldMultiplier') {
            basePower *= (1 + activeTitle.effect.value / 100);
        }

        return Math.floor(basePower);
    }

    // UI 업데이트
    updateDisplay() {
        document.getElementById('gold-amount').textContent = this.gameData.gold.toLocaleString();
        this.updateTitleDisplay();
    }

    // 검 표시 업데이트
    updateSwordDisplay() {
        const weapon = WEAPONS[this.gameData.swordLevel];
        if (!weapon) return;

        document.getElementById('sword-level').textContent = `+${this.gameData.swordLevel}`;
        document.getElementById('sword-name').textContent = weapon.name;
        document.getElementById('sword-image').src = weapon.visual.image;
        document.getElementById('click-power').textContent = this.calculateClickPower().toLocaleString();
        document.getElementById('sell-price').textContent = weapon.sellPrice.toLocaleString();
        document.getElementById('success-rate').textContent = `${this.upgradeSystem.calculateSuccessRate()}%`;

        // 배경 효과 적용
        this.applyBackgroundEffect(weapon.visual.background);

        // 버튼 상태 업데이트
        const upgradeBtn = document.getElementById('upgrade-btn');
        const nextWeapon = WEAPONS[this.gameData.swordLevel + 1];
        
        if (!nextWeapon) {
            // 최대 레벨 도달
            upgradeBtn.disabled = true;
            upgradeBtn.textContent = '최대 레벨';
        } else {
            const canUpgrade = this.gameData.gold >= weapon.upgradeCost;
            upgradeBtn.disabled = !canUpgrade;
            upgradeBtn.textContent = canUpgrade ? `강화 (₩${weapon.upgradeCost.toLocaleString()})` : '골드 부족';
        }
    }

    // 색상 이름에서 실제 색상 값으로 변환
    getColorFromName(colorName) {
        const colorMap = {
            gray: '#95a5a6',
            brown: '#8B4513',
            silver: '#C0C0C0',
            orange: '#e67e22',
            blue: '#3498db',
            red: '#e74c3c',
            gold: '#f39c12',
            purple: '#9b59b6',
            green: '#27ae60',
            yellow: '#f1c40f',
            black: '#2c3e50',
            white: '#ecf0f1',
            rainbow: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
            infinite: '#e91e63',
            absolute: '#673ab7',
            transcend: '#00bcd4',
            world_tree: '#4caf50',
            fate: '#ff5722',
            chaos: '#795548',
            cosmic: '#3f51b5',
            ether: '#9c27b0',
            primordial: '#607d8b',
            god: '#ffc107'
        };

        return colorMap[colorName] || '#95a5a6';
    }

    // 배경 효과 적용
    applyBackgroundEffect(background) {
        const mainGame = document.getElementById('main-game');
        mainGame.className = 'main-game-area'; // 기본 클래스

        if (background) {
            mainGame.classList.add(`bg-${background}`);
        }
    }

    // 총 방지권 개수 계산
    getTotalProtectionCount() {
        let total = 0;
        Object.values(this.gameData.protectionItems).forEach(count => {
            total += count;
        });
        return total;
    }

    // 일일 리셋 체크
    checkDailyReset() {
        const now = new Date();
        const lastLogin = new Date(this.gameData.daily.lastLogin);

        if (now.toDateString() !== lastLogin.toDateString()) {
            // 일일 리셋
            this.gameData.daily.freeMaterials = 5;
            this.gameData.daily.lastLogin = now.getTime();

            // 출석 보상
            this.grantDailyReward();
        }
    }

    // 일일 보상 지급
    grantDailyReward() {
        // 간단한 출석 보상
        this.gameData.gold += 50000;
        this.showNotification('출석 보상: ₩50,000 지급!', 'success');
    }

    // 자동 시스템 시작
    startAutoSystems() {
        // 기존 타이머 정리
        this.stopAutoSystems();

        // 자동 클릭 속도 계산
        let autoClickInterval = 1000; // 기본 1초
        if (this.gameData.inventory['time_distortion'] && this.gameData.inventory['time_distortion'] > 0) {
            autoClickInterval = 500; // 0.5초로 감소 (2배 빠르게)
        }
        
        // 자동 클릭
        this.autoClickTimer = setInterval(() => {
            // 장비 효과
            let autoClickCount = 0;
            if (this.gameData.equipment.autoClicker) {
                autoClickCount += this.gameData.equipment.autoClicker.value;
            }
            
            // 특수 아이템 효과
            if (this.gameData.stats.autoClickCount) {
                autoClickCount += this.gameData.stats.autoClickCount;
            }
            
            // 자동 클릭 실행
            for (let i = 0; i < autoClickCount; i++) {
                this.clickSword();
            }
        }, autoClickInterval);

        // 플레이 시간 카운트 및 업적 체크
        this.playTimeTimer = setInterval(() => {
            this.gameData.stats.playTime++;
            
            // 1분마다 업적 체크 (플레이 시간 관련)
            if (this.gameData.stats.playTime % 60 === 0) {
                this.checkAchievements();
            }
        }, 1000);

        // 주기적인 자동 저장 (30초마다)
        this.autoSaveTimer = setInterval(() => {
            this.saveGameData();
        }, 30000);
    }

    // 자동 시스템 중지
    stopAutoSystems() {
        if (this.autoClickTimer) {
            clearInterval(this.autoClickTimer);
            this.autoClickTimer = null;
        }
        if (this.playTimeTimer) {
            clearInterval(this.playTimeTimer);
            this.playTimeTimer = null;
        }
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // 자동 시스템 재시작
    restartAutoSystems() {
        this.startAutoSystems();
    }

    // 클릭 효과 생성
    createClickEffect(gold) {
        const effect = document.createElement('div');
        effect.className = 'gold-income-text';
        effect.textContent = `+₩${gold}`;

        const incomeDisplay = document.getElementById('gold-income-display');
        incomeDisplay.appendChild(effect);

        // 애니메이션 효과
        effect.style.animation = 'goldIncomeFade 1s ease-out forwards';

        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    // 크리티컬 효과 생성
    createCriticalEffect() {
        document.getElementById('sword-image').classList.add('critical-animation');
        setTimeout(() => {
            document.getElementById('sword-image').classList.remove('critical-animation');
        }, 1000);
    }

    // 알림 표시
    showNotification(message, type = 'success', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.getElementById('notification-container').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, duration);
    }

    // 모달 표시
    showModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
        
        // 모바일에서 모달이 열리면 스크롤 허용
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'auto';
        }
    }

    // 모달 숨기기
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        
        // 업적 상세 모달을 닫을 때는 업적 모달로 돌아가기
        if (modalId === 'achievement-detail-modal') {
            this.showModal('achievements-modal');
        }
        // 아이템 상세 모달을 닫을 때는 인벤토리 모달로 돌아가기
        else if (modalId === 'item-description-modal') {
            this.showModal('inventory-modal');
        }
        // 장비 선택 모달을 닫을 때는 장비 모달로 돌아가기
        else if (modalId === 'equipment-selection-modal') {
            this.showModal('equipment-modal');
        } else {
            document.getElementById('modal-overlay').classList.add('hidden');
            
            // 모바일에서 모든 모달이 닫히면 다시 스크롤 막기
            if (window.innerWidth <= 768) {
                document.body.style.overflow = 'hidden';
            }
        }
    }

    // 모든 모달 숨기기
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    // 로딩 화면 숨기기
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }

    // 설정 기능들
    resetGameData() {
        if (confirm('정말로 모든 게임 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            localStorage.removeItem('swordUpgradeGame');
            location.reload();
        }
    }

    exportGameData() {
        const data = JSON.stringify(this.gameData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sword-upgrade-save.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('게임 데이터가 내보내기되었습니다.', 'success');
    }

    importGameData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.gameData = data;
                        this.saveGameData();
                        this.updateDisplay();
                        this.showNotification('게임 데이터가 불러와졌습니다.', 'success');
                    } catch (error) {
                        this.showNotification('잘못된 파일 형식입니다.', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    // 대장간 시스템 위임 메서드들
    updateForgeDisplay() {
        return this.forgeSystem.updateForgeDisplay();
    }

    craftForgeRecipe(recipe) {
        return this.forgeSystem.craftForgeRecipe(recipe);
    }

    applyForgeEffect(recipe) {
        return this.forgeSystem.applyForgeEffect(recipe);
    }

    getItemName(itemId) {
        return this.forgeSystem.getItemName(itemId);
    }

    // 칭호 시스템 위임 메서드들
    updateTitleDisplay() {
        return this.titleSystem.updateTitleDisplay();
    }

    updateTitlesListDisplay() {
        return this.titleSystem.updateTitlesListDisplay();
    }

    equipTitle(titleId) {
        return this.titleSystem.equipTitle(titleId);
    }

    // 업적 시스템 위임 메서드들
    updateAchievementsDisplay() {
        return this.achievementSystem.updateAchievementsDisplay();
    }

    checkAchievements() {
        return this.achievementSystem.checkAchievements();
    }

    completeAchievement(achievementId) {
        return this.achievementSystem.completeAchievement(achievementId);
    }

    showAchievementDetail(achievementId) {
        return this.achievementSystem.showAchievementDetail(achievementId);
    }

    // 상점 시스템 위임 메서드들
    updateShopDisplay(tab = 'warp') {
        return this.shopSystem.updateShopDisplay(tab);
    }

    // 창고 시스템 위임 메서드들
    updateInventoryGrid() {
        return this.inventorySystem.updateInventoryGrid();
    }

    updateInventoryDisplay() {
        return this.inventorySystem.updateInventoryGrid();
    }

    updateEquipmentDisplay() {
        return this.inventorySystem.updateEquipmentDisplay();
    }

    // 사운드 시스템 위임 메서드들
    toggleSound() {
        return this.soundSystem.toggleSound();
    }

    isSoundEnabled() {
        return this.soundSystem.soundManager.enabled;
    }

    // 강화 시스템 위임 메서드들
    attemptUpgrade() {
        return this.upgradeSystem.attemptUpgrade();
    }

    showSellConfirm() {
        return this.upgradeSystem.showSellConfirm();
    }

    sellSword() {
        return this.upgradeSystem.sellSword();
    }

    // 상점 시스템 위임 메서드들
    switchShopTab(tab) {
        return this.shopSystem.switchShopTab(tab);
    }
}

// 모듈 익스포트 (다른 파일에서 import 가능하도록)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SwordUpgradeGame };
}