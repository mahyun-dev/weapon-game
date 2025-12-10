// 검 강화하기 게임 메인 스크립트

class SwordUpgradeGame {
    constructor() {
        this.gameData = this.loadGameData();
        this.initializeUI();
        this.setupEventListeners();
        this.updateDisplay();
        this.startAutoSystems();
        this.checkCheatMode(); // [CHEAT MODE] 치트 모드 체크 - 삭제 시 이 줄 삭제
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
                this.showModal('shop-modal');
            });
        }

        const inventoryBtn = document.getElementById('inventory-btn');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => {
                this.showModal('inventory-modal');
            });
        }

        const forgeBtn = document.getElementById('forge-btn');
        if (forgeBtn) {
            forgeBtn.addEventListener('click', () => {
                this.showModal('forge-modal');
                this.updateForgeDisplay();
            });
        }

        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.showModal('achievements-modal');
            });
        }

        const titleBtn = document.getElementById('title-btn');
        if (titleBtn) {
            titleBtn.addEventListener('click', () => {
                this.showModal('title-modal');
                this.updateTitlesListDisplay();
            });
        }

        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
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

        this.updateDisplay();
        this.createClickEffect(clickPower);
        this.checkAchievements();
    }

    // 클릭 파워 계산
    calculateClickPower() {
        const weapon = WEAPONS[this.gameData.swordLevel];
        let basePower = weapon ? weapon.clickGold : 1;

        // 워프권 효과
        if (this.gameData.equipment.warpTicket) {
            basePower *= this.gameData.equipment.warpTicket.value;
        }

        // 장비 효과
        if (this.gameData.equipment.golden_ring) {
            basePower *= (1 + this.gameData.equipment.golden_ring.value / 100);
        }

        // 활성 칭호 효과
        const activeTitleId = this.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.gameData.titles[activeTitleId];
        if (activeTitle && activeTitle.effect.type === 'clickGoldMultiplier') {
            basePower *= (1 + activeTitle.effect.value / 100);
        }

        return Math.floor(basePower);
    }

    // 강화 시도
    attemptUpgrade() {
        const currentWeapon = WEAPONS[this.gameData.swordLevel];
        if (!currentWeapon) return;
        
        // 최대 레벨 체크
        const nextWeapon = WEAPONS[this.gameData.swordLevel + 1];
        if (!nextWeapon) {
            this.showNotification('이미 최대 레벨입니다!', 'warning');
            return;
        }

        const cost = currentWeapon.upgradeCost;
        if (this.gameData.gold < cost) {
            this.showNotification('골드가 부족합니다!', 'error');
            return;
        }

        this.gameData.gold -= cost;
        this.gameData.stats.totalUpgrades++;

        const successRate = this.calculateSuccessRate();
        const isSuccess = Math.random() * 100 < successRate;

        if (isSuccess) {
            this.upgradeSuccess();
        } else {
            this.upgradeFailure();
        }

        this.updateDisplay();
        this.saveGameData();
    }

    // 성공률 계산
    calculateSuccessRate() {
        let baseRate = WEAPONS[this.gameData.swordLevel].successRate;

        // 황금 망치 효과
        if (this.gameData.equipment.golden_hammer) {
            baseRate += this.gameData.equipment.golden_hammer.value;
        }
        // 인벤토리에 있는 황금 망치 효과
        if (this.gameData.inventory['golden_hammer'] && this.gameData.inventory['golden_hammer'] > 0) {
            baseRate += 5; // 황금 망치 효과
        }

        // 행운의 부적 효과
        if (this.gameData.equipment.luck_charm) {
            baseRate += this.gameData.equipment.luck_charm.value;
        }
        // 인벤토리에 있는 행운의 부적 효과 (최대 3개)
        if (this.gameData.inventory['luck_charm']) {
            const charmCount = Math.min(this.gameData.inventory['luck_charm'], 3);
            baseRate += charmCount * 3; // 부적당 3%
        }

        // 대장장이의 팔찌 효과
        if (this.gameData.equipment.blacksmith_bracelet) {
            baseRate += this.gameData.equipment.blacksmith_bracelet.value;
        }

        // 활성 칭호 효과
        const activeTitleId = this.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.gameData.titles[activeTitleId];
        if (activeTitle && activeTitle.effect.type === 'successRate') {
            baseRate += activeTitle.effect.value;
        }

        // 천장 시스템 보정
        if (this.checkCeilingBonus()) {
            baseRate = 100;
        }

        return Math.min(baseRate, 100);
    }

    // 천장 시스템 체크
    checkCeilingBonus() {
        const level = this.gameData.swordLevel;
        const failures = this.gameData.ceilingSystem.failureCount;

        let requiredFailures = 0;
        if (level >= 10 && level <= 14) requiredFailures = 5;
        else if (level >= 15 && level <= 19) requiredFailures = 7;
        else if (level >= 20 && level <= 24) requiredFailures = 10;
        else if (level >= 25 && level <= 30) requiredFailures = 15;

        return failures >= requiredFailures && requiredFailures > 0;
    }

    // 강화 성공
    upgradeSuccess() {
        const currentLevel = this.gameData.swordLevel;
        const successRate = this.calculateSuccessRate();
        const isCritical = Math.random() * 100 < 5; // 5% 크리티컬 확률

        // 30% 이하 성공률에서 성공 시 업적 추적
        if (successRate <= 30 && !this.checkCeilingBonus()) {
            this.gameData.stats.successAt30Percent = true;
        }

        if (isCritical) {
            this.gameData.swordLevel += 2; // 크리티컬: +2
            this.gameData.stats.criticalUpgrades++;
            this.showNotification('크리티컬 강화 성공! +2 상승!', 'warning');
            this.createCriticalEffect();
        } else {
            this.gameData.swordLevel += 1;
            this.showNotification('강화 성공!', 'success');
        }

        this.gameData.stats.successfulUpgrades++;
        this.gameData.stats.consecutiveSuccess++;
        this.gameData.stats.consecutiveFailures = 0;

        if (this.gameData.stats.consecutiveSuccess > this.gameData.stats.maxConsecutiveSuccess) {
            this.gameData.stats.maxConsecutiveSuccess = this.gameData.stats.consecutiveSuccess;
        }

        // +20 달성 시 방지권 사용 여부 추적
        if (this.gameData.swordLevel === 20 && currentLevel === 19) {
            if (!this.gameData.stats.usedProtectionTo20) {
                this.gameData.stats.reached20WithoutProtection = true;
            }
        }

        // 천장 카운트 리셋
        this.gameData.ceilingSystem.failureCount = 0;

        // 재료 드롭
        this.dropMaterials();

        this.updateSwordDisplay();
        this.checkAchievements();
    }

    // 강화 실패
    upgradeFailure() {
        this.gameData.stats.failedUpgrades++;
        this.gameData.stats.consecutiveFailures++;
        this.gameData.stats.consecutiveSuccess = 0;

        if (this.gameData.stats.consecutiveFailures > this.gameData.stats.maxConsecutiveFailures) {
            this.gameData.stats.maxConsecutiveFailures = this.gameData.stats.consecutiveFailures;
        }

        // 천장 카운트 증가
        this.gameData.ceilingSystem.failureCount++;

        // 방지권 사용 여부
        const hasProtection = this.checkProtectionItem();
        let penalty = 0;

        if (hasProtection) {
            this.showNotification('방지권으로 보호되었습니다!', 'success');
        } else {
            const level = this.gameData.swordLevel;
            if (level >= 20) penalty = 2;
            else if (level >= 10) penalty = 1;

            this.gameData.swordLevel = Math.max(0, this.gameData.swordLevel - penalty);
            this.showNotification(`강화 실패... ${penalty > 0 ? `-${penalty} 하락` : ''}`, 'error');
        }

        this.updateSwordDisplay();
        this.checkAchievements();
    }

    // 방지권 체크
    checkProtectionItem() {
        const level = this.gameData.swordLevel;
        let protectionType = '';

        if (level <= 10) protectionType = 'broken_protection';
        else if (level <= 15) protectionType = 'old_protection';
        else if (level <= 20) protectionType = 'normal_protection';
        else if (level <= 25) protectionType = 'high_protection';
        else protectionType = 'ultimate_protection';

        if (this.gameData.protectionItems[protectionType] && this.gameData.protectionItems[protectionType] > 0) {
            this.gameData.protectionItems[protectionType]--;
            
            // +20 도달을 위한 방지권 사용 추적
            if (level >= 10 && level < 20) {
                this.gameData.stats.usedProtectionTo20 = true;
            }
            
            return true;
        }

        return false;
    }

    // 재료 드롭
    dropMaterials() {
        const level = this.gameData.swordLevel;

        // 각 재료별 드롭 확률 체크
        Object.entries(MATERIAL_DROPS).forEach(([materialId, material]) => {
            if (level >= material.minLevel && Math.random() * 100 < material.dropRate) {
                if (!this.gameData.inventory[materialId]) {
                    this.gameData.inventory[materialId] = 0;
                }
                this.gameData.inventory[materialId]++;
                this.showNotification(`${material.name} 획득!`, 'success');
            }
        });
    }

    // 검 판매
    sellSword() {
        const currentWeapon = WEAPONS[this.gameData.swordLevel];
        if (!currentWeapon) return;

        let sellPrice = currentWeapon.sellPrice;
        
        // 대량 판매권 효과
        if (this.gameData.inventory['bulk_sell_ticket'] && this.gameData.inventory['bulk_sell_ticket'] > 0) {
            sellPrice *= 1.5; // 50% 증가
        }
        
        this.gameData.gold += sellPrice;
        this.gameData.stats.totalGoldEarned += sellPrice;
        this.gameData.swordLevel = 0;
        
        // 천장 시스템 초기화
        this.gameData.ceilingSystem.failureCount = 0;
        this.gameData.ceilingSystem.lastCeilingLevel = 0;

        this.showNotification(`검을 판매했습니다! ₩${Math.floor(sellPrice).toLocaleString()}`, 'success');
        this.updateSwordDisplay();
        this.updateDisplay();
        this.saveGameData();
    }

    // 판매 확인 모달 표시
    showSellConfirm() {
        const currentWeapon = WEAPONS[this.gameData.swordLevel];
        if (!currentWeapon) return;

        const sellPrice = currentWeapon.sellPrice;
        document.getElementById('sell-confirm-text').innerHTML = `
            현재 검을 판매하시겠습니까?<br>
            검 이름: ${currentWeapon.name}<br>
            판매 가격: ₩${sellPrice.toLocaleString()}
        `;

        this.showModal('sell-confirm-modal');
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
        document.getElementById('success-rate').textContent = `${this.calculateSuccessRate()}%`;

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

    // 칭호 표시 업데이트
    updateTitleDisplay() {
        const activeTitleId = this.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.gameData.titles[activeTitleId] || TITLES.find(t => t.id === 'beginner_adventurer');
        
        if (activeTitle) {
            const titleElement = document.getElementById('active-title');
            if (titleElement) {
                titleElement.textContent = activeTitle.name;
                titleElement.style.color = TITLE_RARITIES[activeTitle.rarity] || '#95a5a6';
            }
        }
    }

    // 칭호 목록 표시
    updateTitlesListDisplay() {
        const titlesList = document.getElementById('titles-list');
        titlesList.innerHTML = '';

        TITLES.forEach(title => {
            const isOwned = this.gameData.titles[title.id];
            const isActive = this.gameData.activeTitle === title.id;
            
            const titleElement = document.createElement('div');
            titleElement.className = `title-item ${isOwned ? 'owned' : 'locked'} ${isActive ? 'active' : ''}`;
            titleElement.dataset.id = title.id;

            // 조건 텍스트
            let conditionText = '';
            if (title.condition.type === 'default') {
                conditionText = '기본 칭호';
            } else if (title.condition.type === 'weapon_level') {
                conditionText = `검 +${title.condition.value} 달성`;
            } else if (title.condition.type === 'total_gold') {
                conditionText = `누적 ₩${title.condition.value.toLocaleString()} 획득`;
            } else if (title.condition.type === 'critical_upgrades') {
                conditionText = `크리티컬 ${title.condition.value}회`;
            } else {
                conditionText = '특수 조건 달성';
            }

            // 효과 텍스트
            let effectText = '';
            if (title.effect.type === 'clickGoldMultiplier') {
                effectText = `클릭 골드 +${title.effect.value}%`;
            } else if (title.effect.type === 'successRate') {
                effectText = `성공률 +${title.effect.value}%`;
            } else if (title.effect.type === 'criticalChance') {
                effectText = `크리티컬 확률 +${title.effect.value}%`;
            } else if (title.effect.type === 'goldRefundOnFail') {
                effectText = `실패 시 골드 ${title.effect.value}% 환불`;
            } else if (title.effect.type === 'equipmentEffect') {
                effectText = `장비 효과 +${title.effect.value}%`;
            } else if (title.effect.type === 'materialDropRate') {
                effectText = `재료 드롭률 +${title.effect.value}%`;
            } else if (title.effect.type === 'autoClickSpeed') {
                effectText = `자동 클릭 속도 +${title.effect.value}%`;
            } else if (title.effect.type === 'allStats') {
                effectText = `모든 능력치 +${title.effect.value}%`;
            }

            titleElement.innerHTML = `
                <div class="title-header">
                    <div class="title-name" style="color: ${TITLE_RARITIES[title.rarity]}">${title.name}</div>
                    ${isActive ? '<div class="title-badge">착용중</div>' : ''}
                </div>
                <div class="title-condition">${conditionText}</div>
                <div class="title-effect">${effectText}</div>
                <div class="title-status">${isOwned ? (isActive ? '' : '<button class="equip-title-btn">착용</button>') : '미획득'}</div>
            `;

            // 착용 버튼 이벤트
            if (isOwned && !isActive) {
                const equipBtn = titleElement.querySelector('.equip-title-btn');
                if (equipBtn) {
                    equipBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.equipTitle(title.id);
                    });
                }
            }

            titlesList.appendChild(titleElement);
        });
    }

    // 칭호 착용
    equipTitle(titleId) {
        if (this.gameData.titles[titleId]) {
            this.gameData.activeTitle = titleId;
            this.saveGameData();
            this.updateTitleDisplay();
            this.updateTitlesListDisplay();
            this.updateSwordDisplay(); // 칭호 효과를 즉시 반영하기 위해 검 정보 업데이트
            this.updateDisplay();
            
            const title = TITLES.find(t => t.id === titleId);
            this.showNotification(`${title.name} 칭호를 착용했습니다!`, 'success');
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

    // 상점 표시 업데이트
    updateShopDisplay(tab = 'warp') {
        const shopItems = document.getElementById('shop-items');
        shopItems.innerHTML = '';

        let items = [];
        switch (tab) {
            case 'warp':
                items = SHOP_ITEMS.warpItems;
                break;
            case 'protection':
                items = SHOP_ITEMS.protectionItems;
                break;
            case 'special':
                items = SHOP_ITEMS.specialItems;
                break;
        }

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';

            let effectText = '';
            switch (item.effect) {
                case 'clickMultiplier':
                    effectText = `클릭당 골드 ${item.value}배 증가`;
                    break;
                case 'successRate':
                    effectText = `강화 성공률 +${item.value}%`;
                    break;
                case 'autoClick':
                    effectText = `초당 ${item.value}회 자동 클릭`;
                    break;
                default:
                    effectText = item.name;
            }

            itemElement.innerHTML = `
                <div class="shop-item-info">
                    <div class="shop-item-name">${item.name}</div>
                    <div class="shop-item-desc">${effectText}</div>
                </div>
                <div class="shop-item-price">₩${item.price.toLocaleString()}</div>
                <button class="shop-buy-btn" data-item="${item.id}">구매</button>
            `;

            // 구매 버튼 이벤트
            itemElement.querySelector('.shop-buy-btn').addEventListener('click', () => {
                this.buyShopItem(item);
            });

            shopItems.appendChild(itemElement);
        });
    }

    // 상점 아이템 구매
    buyShopItem(item) {
        if (this.gameData.gold < item.price) {
            this.showNotification('골드가 부족합니다!', 'error');
            return;
        }

        // 구매 제한 체크
        if (item.purchaseLimit) {
            const currentCount = this.gameData.inventory[item.id] || 0;
            if (currentCount >= item.purchaseLimit) {
                this.showNotification(`${item.name}은(는) 최대 ${item.purchaseLimit}개까지만 구매할 수 있습니다!`, 'error');
                return;
            }
        }

        this.gameData.gold -= item.price;

        // 아이템 효과 적용
        switch (item.effect) {
            case 'clickMultiplier':
                // 워프권은 장비로 장착
                this.gameData.equipment.warpTicket = item;
                this.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'successRate':
                // 성공률 증가 장비는 인벤토리에 추가
                if (!this.gameData.inventory[item.id]) {
                    this.gameData.inventory[item.id] = 0;
                }
                this.gameData.inventory[item.id]++;
                this.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'autoClick':
                this.gameData.equipment.autoClicker = item;
                this.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'randomEquipment':
                this.giveRandomEquipment();
                break;
            default:
                // 방지권 구매 처리
                if (item.id && item.id.includes('protection')) {
                    // 방지권 ID에서 실제 방지권 타입과 개수 추출
                    // 예: broken_protection_x1 -> broken_protection, 1개
                    //     normal_protection_x3 -> normal_protection, 3개
                    const match = item.id.match(/(.+)_x(\d+)/);
                    if (match) {
                        const protectionType = match[1];
                        const count = parseInt(match[2]);
                        
                        if (!this.gameData.protectionItems[protectionType]) {
                            this.gameData.protectionItems[protectionType] = 0;
                        }
                        this.gameData.protectionItems[protectionType] += count;
                        
                        this.showNotification(`${item.name} 구매 완료!`, 'success');
                    }
                } else if (item.id) {
                    // 기타 특수 아이템들은 인벤토리에 추가
                    if (!this.gameData.inventory[item.id]) {
                        this.gameData.inventory[item.id] = 0;
                    }
                    this.gameData.inventory[item.id]++;
                    this.showNotification(`${item.name} 구매 완료!`, 'success');
                } else {
                    this.showNotification(`${item.name} 구매 완료!`, 'success');
                }
                break;
        }

        this.updateDisplay();
        this.updateInventoryDisplay();
        this.saveGameData();
    }

    // 상점 탭 전환
    switchShopTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        this.updateShopDisplay(tab);
    }

    // 대장간 표시 업데이트
    updateForgeDisplay() {
        const forgeRecipes = document.getElementById('forge-recipes');
        forgeRecipes.innerHTML = '';

        FORGE_RECIPES.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.className = 'forge-recipe';

            // 필요한 재료 표시
            let materialsText = recipe.materials.map(material => {
                const itemName = this.getItemName(material.item);
                return `${itemName} x${material.count}`;
            }).join(', ');

            // 결과 아이템 표시
            const resultName = this.getItemName(recipe.result.item);

            recipeElement.innerHTML = `
                <div class="forge-recipe-info">
                    <div class="forge-recipe-name">${recipe.name}</div>
                    <div class="forge-recipe-materials">필요: ${materialsText}</div>
                    <div class="forge-recipe-result">결과: ${resultName} x${recipe.result.count}</div>
                </div>
                <button class="forge-craft-btn" data-recipe="${recipe.id}">조합</button>
            `;

            // 조합 버튼 이벤트
            recipeElement.querySelector('.forge-craft-btn').addEventListener('click', () => {
                this.craftForgeRecipe(recipe);
            });

            forgeRecipes.appendChild(recipeElement);
        });
    }

    // 아이템 ID로 이름 가져오기
    getItemName(itemId) {
        // EQUIPMENT에서 찾기
        const equipment = EQUIPMENT.find(item => item.id === itemId);
        if (equipment) return equipment.name;

        // items.js에서 찾기
        if (ITEMS.special[itemId]) return ITEMS.special[itemId].name;
        if (ITEMS.materials[itemId]) return ITEMS.materials[itemId].name;
        if (ITEMS.protections[itemId]) return ITEMS.protections[itemId].name;

        return itemId;
    }

    // 대장간 조합 실행
    craftForgeRecipe(recipe) {
        // 재료 확인
        for (const material of recipe.materials) {
            const currentCount = this.gameData.inventory[material.item] || 0;
            if (currentCount < material.count) {
                this.showNotification(`${this.getItemName(material.item)}이(가) 부족합니다!`, 'error');
                return;
            }
        }

        // 재료 소비
        for (const material of recipe.materials) {
            this.gameData.inventory[material.item] -= material.count;
        }

        // 결과 아이템 추가
        if (!this.gameData.inventory[recipe.result.item]) {
            this.gameData.inventory[recipe.result.item] = 0;
        }
        this.gameData.inventory[recipe.result.item] += recipe.result.count;

        // 효과 적용 (필요시)
        if (recipe.effect) {
            this.applyForgeEffect(recipe);
        }

        // 조합 횟수 추적
        if (!this.gameData.stats.totalForges) {
            this.gameData.stats.totalForges = 0;
        }
        this.gameData.stats.totalForges++;

        // 저장 및 UI 업데이트
        this.saveGameData();
        this.updateInventoryDisplay();
        this.updateForgeDisplay();
        this.checkAchievements();

        this.showNotification(`${recipe.name} 조합이 완료되었습니다!`, 'success');
    }

    // 대장간 효과 적용
    applyForgeEffect(recipe) {
        switch (recipe.effect) {
            case 'clickGoldIncrease':
                // 클릭 골드 증가 효과는 이미 적용됨
                break;
            case 'protection':
                // 보호권 효과는 이미 적용됨
                break;
        }
    }

    // 창고 표시 업데이트
    updateInventoryDisplay() {
        // 장비 슬롯
        const equipmentSlots = document.getElementById('equipment-slots');
        equipmentSlots.innerHTML = '';

        Object.entries(EQUIPMENT_SLOTS).forEach(([slotId, slotName]) => {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot';
            slotElement.innerHTML = `
                <div class="slot-name">${slotName}</div>
                <div class="slot-item">${this.gameData.equipment[slotId] ? this.gameData.equipment[slotId].name : '비어있음'}</div>
            `;
            
            // 장비 슬롯 클릭 이벤트
            slotElement.addEventListener('click', () => {
                this.handleEquipmentSlotClick(slotId);
            });
            
            equipmentSlots.appendChild(slotElement);
        });

        // 인벤토리 아이템
        const inventoryItems = document.getElementById('inventory-items');
        inventoryItems.innerHTML = '';

        // 방지권 아이템 먼저 표시
        Object.entries(this.gameData.protectionItems).forEach(([protectionId, count]) => {
            if (count > 0) {
                const item = ITEMS.protections[protectionId];
                const itemName = item ? item.name : protectionId;
                
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item protection-item';
                itemElement.innerHTML = `
                    <div class="item-name">${itemName}</div>
                    <div class="item-count">x${count}</div>
                `;
                if (item && item.description) {
                    itemElement.title = item.description;
                }
                inventoryItems.appendChild(itemElement);
            }
        });

        // 일반 아이템 및 재료 표시
        Object.entries(this.gameData.inventory).forEach(([itemId, count]) => {
            if (count > 0) {
                const itemName = this.getItemName(itemId);
                const equipment = EQUIPMENT.find(item => item.id === itemId);
                
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.innerHTML = `
                    <div class="item-name">${itemName}</div>
                    <div class="item-count">x${count}</div>
                `;
                
                // 장비 아이템이면 클릭해서 장착
                if (equipment) {
                    itemElement.addEventListener('click', () => {
                        this.equipItem(equipment);
                    });
                    itemElement.style.cursor = 'pointer';
                    itemElement.style.background = 'linear-gradient(135deg, #e8f5e8, #c8e6c9)';
                }
                
                inventoryItems.appendChild(itemElement);
            }
        });
    }

    // 아이템 장착
    equipItem(equipment) {
        const slotId = equipment.slot;
        
        // 이미 장착된 아이템이 있으면 확인
        if (this.gameData.equipment[slotId]) {
            const oldEquipment = this.gameData.equipment[slotId];
            if (!confirm(`${oldEquipment.name}을(를) 해제하고 ${equipment.name}을(를) 장착하시겠습니까?`)) {
                return;
            }
            
            // 기존 장비를 인벤토리로 반환
            if (!this.gameData.inventory[oldEquipment.id]) {
                this.gameData.inventory[oldEquipment.id] = 0;
            }
            this.gameData.inventory[oldEquipment.id]++;
        }
        
        // 장착
        this.gameData.equipment[slotId] = equipment;
        
        // 인벤토리에서 제거
        this.gameData.inventory[equipment.id]--;
        if (this.gameData.inventory[equipment.id] <= 0) {
            delete this.gameData.inventory[equipment.id];
        }
        
        this.saveGameData();
        this.updateInventoryDisplay();
        this.updateDisplay();
        this.showNotification(`${equipment.name}을(를) 장착했습니다!`, 'success');
    }

    // 랜덤 장비 지급
    giveRandomEquipment() {
        // 랜덤 장비 선택 (희귀도별 가중치)
        const availableEquipment = EQUIPMENT.filter(item => item.obtainable.includes('random_box'));
        if (availableEquipment.length === 0) {
            this.showNotification('사용 가능한 장비가 없습니다.', 'error');
            return;
        }

        // 희귀도별 가중치 설정
        const rarityWeights = {
            common: 40,
            uncommon: 30,
            rare: 20,
            epic: 8,
            legendary: 2
        };

        // 가중치를 적용한 랜덤 선택
        const weightedEquipment = [];
        availableEquipment.forEach(item => {
            const weight = rarityWeights[item.rarity] || 10;
            for (let i = 0; i < weight; i++) {
                weightedEquipment.push(item);
            }
        });

        const randomIndex = Math.floor(Math.random() * weightedEquipment.length);
        const selectedEquipment = weightedEquipment[randomIndex];

        // 인벤토리에 장비 추가
        if (!this.gameData.inventory[selectedEquipment.id]) {
            this.gameData.inventory[selectedEquipment.id] = 0;
        }
        this.gameData.inventory[selectedEquipment.id]++;

        // 희귀도에 따른 알림 색상
        const notificationType = selectedEquipment.rarity === 'epic' || selectedEquipment.rarity === 'legendary' ? 'warning' : 'success';
        this.updateInventoryDisplay();
        this.showNotification(`${selectedEquipment.name}을(를) 얻었습니다! [${selectedEquipment.rarity}]`, notificationType);
    }

    // 장비 슬롯 클릭 처리
    handleEquipmentSlotClick(slotId) {
        const equippedItem = this.gameData.equipment[slotId];
        
        if (equippedItem) {
            // 장착된 아이템이 있으면 해제 확인
            if (confirm(`${equippedItem.name}을(를) 해제하시겠습니까?`)) {
                // 인벤토리에 반환
                if (!this.gameData.inventory[equippedItem.id]) {
                    this.gameData.inventory[equippedItem.id] = 0;
                }
                this.gameData.inventory[equippedItem.id]++;
                
                delete this.gameData.equipment[slotId];
                this.saveGameData();
                this.updateInventoryDisplay();
                this.updateDisplay();
                this.showNotification(`${equippedItem.name}을(를) 해제했습니다.`, 'success');
            }
        } else {
            // 장착된 아이템이 없으면 사용할 수 있는 장비 표시
            this.showAvailableEquipment(slotId);
        }
    }

    // 사용할 수 있는 장비 표시
    showAvailableEquipment(slotId) {
        // 현재 인벤토리에 있는 장비 아이템 표시 (나중에 구현)
        // 지금은 알림만
        this.showNotification('장착할 수 있는 장비가 없습니다.', 'warning');
    }

    // 업적 표시 업데이트
    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';

        ACHIEVEMENTS.forEach(achievement => {
            const isCompleted = this.gameData.achievements[achievement.id];
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${isCompleted ? 'completed' : 'locked'}`;
            achievementElement.dataset.id = achievement.id;

            let conditionText = '';
            let rewardText = '';
            let progressText = '';
            let currentValue = 0;
            let progressPercent = 0;

            switch (achievement.condition.type) {
                case 'weapon_level':
                    conditionText = `검 +${achievement.condition.value} 달성`;
                    currentValue = this.gameData.swordLevel;
                    progressText = `현재 레벨: +${currentValue}`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_gold':
                    conditionText = `누적 ₩${achievement.condition.value.toLocaleString()} 획득`;
                    progressText = `현재 누적: ₩${currentValue.toLocaleString()}`;
                    currentValue = this.gameData.stats.totalGoldEarned;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_clicks':
                    currentValue = this.gameData.stats.totalClicks;
                    conditionText = `총 ${achievement.condition.value.toLocaleString()}회 클릭`;
                    progressText = `현재 클릭: ${currentValue.toLocaleString()}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'consecutive_success':
                    currentValue = this.gameData.stats.maxConsecutiveSuccess;
                    conditionText = `${achievement.condition.value}연속 성공`;
                    progressText = `최대 연속: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'consecutive_failures':
                    currentValue = this.gameData.stats.maxConsecutiveFailures;
                    conditionText = `${achievement.condition.value}연속 실패`;
                    progressText = `최대 연속: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'critical_upgrades':
                    currentValue = this.gameData.stats.criticalUpgrades;
                    conditionText = `크리티컬 ${achievement.condition.value}회`;
                    progressText = `현재: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'unique_materials':
                    currentValue = Object.keys(this.gameData.inventory).filter(key => 
                        MATERIAL_DROPS[key] && this.gameData.inventory[key] > 0
                    ).length;
                    conditionText = `${achievement.condition.value}종 재료 수집`;
                    progressText = `현재: ${currentValue}종`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_upgrades':
                    currentValue = this.gameData.stats.totalUpgrades;
                    conditionText = `총 ${achievement.condition.value.toLocaleString()}회 강화`;
                    progressText = `현재: ${currentValue.toLocaleString()}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'unique_equipment':
                    currentValue = Object.keys(this.gameData.equipment).filter(key => 
                        EQUIPMENT_SLOTS[key] && this.gameData.equipment[key]
                    ).length;
                    conditionText = `${achievement.condition.value}종 장비 수집`;
                    progressText = `현재: ${currentValue}종`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'forge_recipes':
                    currentValue = this.gameData.stats.totalForges || 0;
                    conditionText = `${achievement.condition.value}회 조합`;
                    progressText = `현재: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'weapon_level_20_without_protection':
                    currentValue = this.gameData.stats.reached20WithoutProtection ? 1 : 0;
                    conditionText = '+20 무방지권 달성';
                    progressText = currentValue ? '완료' : '미완료';
                    progressPercent = currentValue * 100;
                    break;
                case 'success_at_30_percent':
                    currentValue = this.gameData.stats.successAt30Percent ? 1 : 0;
                    conditionText = '30% 이하 성공률 달성';
                    progressText = currentValue ? '완료' : '미완료';
                    progressPercent = currentValue * 100;
                    break;
                default:
                    conditionText = achievement.name;
            }

            if (achievement.reward) {
                if (achievement.reward.gold) {
                    rewardText += `₩${achievement.reward.gold.toLocaleString()} `;
                }
                if (achievement.reward.material) {
                    rewardText += `${achievement.reward.material.name} x${achievement.reward.material.count}`;
                }
                if (achievement.reward.equipment) {
                    rewardText += `${achievement.reward.equipment.name}`;
                }
            }

            achievementElement.innerHTML = `
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-condition">${conditionText}</div>
                <div class="achievement-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="progress-text">${isCompleted ? '완료' : `${Math.floor(progressPercent)}%`}</div>
                </div>
                <div class="achievement-reward">${isCompleted ? '완료' : '미완료'}</div>
            `;

            achievementsList.appendChild(achievementElement);
        });
    }

    // 업적 체크
    checkAchievements() {
        ACHIEVEMENTS.forEach(achievement => {
            if (!this.gameData.achievements[achievement.id]) {
                let completed = false;

                switch (achievement.condition.type) {
                    case 'weapon_level':
                        completed = this.gameData.swordLevel >= achievement.condition.value;
                        break;
                    case 'total_gold':
                        completed = this.gameData.stats.totalGoldEarned >= achievement.condition.value;
                        break;
                    case 'total_clicks':
                        completed = this.gameData.stats.totalClicks >= achievement.condition.value;
                        break;
                    case 'consecutive_success':
                        completed = this.gameData.stats.consecutiveSuccess >= achievement.condition.value;
                        break;
                    case 'consecutive_failures':
                        completed = this.gameData.stats.consecutiveFailures >= achievement.condition.value;
                        break;
                    case 'critical_upgrades':
                        completed = this.gameData.stats.criticalUpgrades >= achievement.condition.value;
                        break;
                    case 'unique_materials':
                        const uniqueMaterialCount = Object.keys(this.gameData.inventory).filter(key => 
                            MATERIAL_DROPS[key] && this.gameData.inventory[key] > 0
                        ).length;
                        completed = uniqueMaterialCount >= achievement.condition.value;
                        break;
                    case 'weapon_level_20_without_protection':
                        // 이 업적은 특별한 추적이 필요하므로 별도 처리
                        completed = this.gameData.stats.reached20WithoutProtection || false;
                        break;
                    case 'total_upgrades':
                        completed = this.gameData.stats.totalUpgrades >= achievement.condition.value;
                        break;
                    case 'success_at_30_percent':
                        // 이 업적은 특별한 추적이 필요하므로 별도 처리
                        completed = this.gameData.stats.successAt30Percent || false;
                        break;
                    case 'unique_equipment':
                        const uniqueEquipmentCount = Object.keys(this.gameData.equipment).filter(key => 
                            EQUIPMENT_SLOTS[key] && this.gameData.equipment[key]
                        ).length;
                        completed = uniqueEquipmentCount >= achievement.condition.value;
                        break;
                    case 'forge_recipes':
                        completed = (this.gameData.stats.totalForges || 0) >= achievement.condition.value;
                        break;
                }

                if (completed) {
                    this.gameData.achievements[achievement.id] = true;
                    this.grantAchievementReward(achievement);
                    this.showNotification(`업적 달성: ${achievement.name}!`, 'success');
                }
            }
        });

        this.updateAchievementsDisplay();
    }

    // 업적 보상 지급
    grantAchievementReward(achievement) {
        if (achievement.reward.gold) {
            this.gameData.gold += achievement.reward.gold;
            this.gameData.stats.totalGoldEarned += achievement.reward.gold;
            this.showNotification(`골드 +₩${achievement.reward.gold.toLocaleString()}`, 'success');
        }

        if (achievement.reward.item) {
            // 인벤토리에 아이템 추가
            if (!this.gameData.inventory[achievement.reward.item]) {
                this.gameData.inventory[achievement.reward.item] = 0;
            }
            const count = achievement.reward.count || 1;
            this.gameData.inventory[achievement.reward.item] += count;
            this.showNotification(`${this.getItemName(achievement.reward.item)} x${count} 획득!`, 'success');
        }

        if (achievement.reward.equipment) {
            // 장비를 인벤토리에 추가
            if (!this.gameData.inventory[achievement.reward.equipment]) {
                this.gameData.inventory[achievement.reward.equipment] = 0;
            }
            this.gameData.inventory[achievement.reward.equipment]++;
            const equipment = EQUIPMENT.find(e => e.id === achievement.reward.equipment);
            if (equipment) {
                this.showNotification(`${equipment.name} 획득!`, 'success');
            }
        }

        if (achievement.reward.title) {
            this.gameData.titles[achievement.reward.title] = TITLES.find(t => t.id === achievement.reward.title);
            const title = TITLES.find(t => t.id === achievement.reward.title);
            if (title) {
                this.showNotification(`칭호 획득: ${title.name}`, 'warning');
            }
        }

        this.updateInventoryDisplay();
        this.updateDisplay();
        this.saveGameData();
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
        // 자동 클릭 속도 계산
        let autoClickInterval = 1000; // 기본 1초
        if (this.gameData.inventory['time_distortion'] && this.gameData.inventory['time_distortion'] > 0) {
            autoClickInterval = 500; // 0.5초로 감소 (2배 빠르게)
        }
        
        // 자동 클릭
        setInterval(() => {
            if (this.gameData.equipment.autoClicker) {
                for (let i = 0; i < this.gameData.equipment.autoClicker.value; i++) {
                    this.clickSword();
                }
            }
        }, autoClickInterval);

        // 플레이 시간 카운트 및 업적 체크
        setInterval(() => {
            this.gameData.stats.playTime++;
            
            // 1분마다 업적 체크 (플레이 시간 관련)
            if (this.gameData.stats.playTime % 60 === 0) {
                this.checkAchievements();
            }
        }, 1000);

        // 주기적인 자동 저장 (30초마다)
        setInterval(() => {
            this.saveGameData();
        }, 30000);
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
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.getElementById('notification-container').appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // 모달 표시
    showModal(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    }

    // 모달 숨기기
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        
        // 업적 상세 모달을 닫을 때는 업적 모달로 돌아가기
        if (modalId === 'achievement-detail-modal') {
            this.showModal('achievements-modal');
        } else {
            document.getElementById('modal-overlay').classList.add('hidden');
        }
    }

    // 업적 상세 표시
    showAchievementDetail(achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        const isCompleted = this.gameData.achievements[achievementId]?.completed || false;
        const progress = this.gameData.achievements[achievementId]?.progress || 0;

        // 업적 모달 숨기기
        this.hideModal('achievements-modal');

        // 제목 설정
        document.getElementById('achievement-detail-title').textContent = achievement.name;

        // 조건 텍스트 생성
        let conditionText = '';
        let rewardText = '';
        let currentValue = 0;

        switch (achievement.condition.type) {
            case 'weapon_level':
                conditionText = `검 +${achievement.condition.value} 달성`;
                currentValue = this.gameData.swordLevel;
                break;
            case 'total_gold':
                conditionText = `누적 ₩${achievement.condition.value.toLocaleString()} 획득`;
                currentValue = this.gameData.stats.totalGoldEarned;
                break;
            case 'total_clicks':
                conditionText = `총 ${achievement.condition.value.toLocaleString()}회 클릭`;
                currentValue = this.gameData.stats.totalClicks;
                break;
            case 'consecutive_success':
                conditionText = `${achievement.condition.value}연속 성공`;
                currentValue = this.gameData.stats.maxConsecutiveSuccess;
                break;
            case 'consecutive_failures':
                conditionText = `${achievement.condition.value}연속 실패`;
                currentValue = this.gameData.stats.maxConsecutiveFailures;
                break;
            case 'critical_upgrades':
                conditionText = `크리티컬 ${achievement.condition.value}회`;
                currentValue = this.gameData.stats.criticalUpgrades;
                break;
            case 'unique_materials':
                conditionText = `${achievement.condition.value}종 재료 수집`;
                currentValue = Object.keys(this.gameData.inventory).filter(key => 
                    MATERIAL_DROPS[key] && this.gameData.inventory[key] > 0
                ).length;
                break;
            case 'total_upgrades':
                conditionText = `총 ${achievement.condition.value.toLocaleString()}회 강화`;
                currentValue = this.gameData.stats.totalUpgrades;
                break;
            case 'unique_equipment':
                conditionText = `${achievement.condition.value}종 장비 수집`;
                currentValue = Object.keys(this.gameData.equipment).filter(key => 
                    EQUIPMENT_SLOTS[key] && this.gameData.equipment[key]
                ).length;
                break;
            case 'forge_recipes':
                conditionText = `${achievement.condition.value}회 조합`;
                currentValue = this.gameData.stats.totalForges || 0;
                break;
            case 'weapon_level_20_without_protection':
                conditionText = '+20 무방지권 달성';
                currentValue = this.gameData.stats.reached20WithoutProtection ? achievement.condition.value : 0;
                break;
            case 'success_at_30_percent':
                conditionText = '30% 이하 성공률 달성';
                currentValue = this.gameData.stats.successAt30Percent ? achievement.condition.value : 0;
                break;
            default:
                conditionText = achievement.name;
        }

        // 보상 텍스트 생성
        const rewards = [];
        if (achievement.reward) {
            if (achievement.reward.gold) {
                rewards.push(`₩${achievement.reward.gold.toLocaleString()}`);
            }
            if (achievement.reward.item) {
                const itemName = this.getItemName(achievement.reward.item);
                const count = achievement.reward.count || 1;
                rewards.push(`${itemName} x${count}`);
            }
            if (achievement.reward.equipment) {
                const equipment = EQUIPMENT.find(e => e.id === achievement.reward.equipment);
                if (equipment) {
                    rewards.push(equipment.name);
                }
            }
            if (achievement.reward.title) {
                const title = TITLES.find(t => t.id === achievement.reward.title);
                if (title) {
                    rewards.push(`칭호: ${title.name}`);
                }
            }
        }
        rewardText = rewards.length > 0 ? rewards.join(', ') : '없음';

        // 내용 설정
        const content = document.getElementById('achievement-detail-content');
        content.innerHTML = `
            <div class="achievement-detail-section">
                <h3>달성 조건</h3>
                <p>${conditionText}</p>
            </div>
            <div class="achievement-detail-section">
                <h3>진행 상황</h3>
                <p>${currentValue.toLocaleString()} / ${achievement.condition.value.toLocaleString()}</p>
                <div class="achievement-progress">
                    <div class="progress-fill" style="width: ${Math.min((currentValue / achievement.condition.value) * 100, 100)}%"></div>
                </div>
            </div>
            <div class="achievement-detail-section">
                <h3>보상</h3>
                <p>${rewardText || '없음'}</p>
            </div>
            <div class="achievement-detail-section">
                <h3>상태</h3>
                <p class="${isCompleted ? 'completed' : 'locked'}">${isCompleted ? '달성됨' : '미달성'}</p>
            </div>
        `;

        // 모달 표시
        this.showModal('achievement-detail-modal');
    }

    // 모든 모달 숨기기
    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.getElementById('modal-overlay').classList.add('hidden');
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

    // 로딩 화면 숨기기
    hideLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 1000);
    }

    // ============================================
    // [CHEAT MODE START] 치트 모드 관련 메서드 전체
    // 삭제 시 이 줄부터 파일 끝의 [CHEAT MODE END]까지 모두 삭제
    // ============================================

    // 치트 모드 확인 및 활성화
    checkCheatMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const cheatCode = urlParams.get('cheat');
        const adminMode = urlParams.get('admin');
        
        // 치트 코드: ?cheat=devmode - 간단한 치트 UI
        if (cheatCode === 'devmode') {
            this.enableCheatMode();
        }
        
        // 관리자 모드: ?admin=true - JSON 직접 수정
        if (adminMode === 'true') {
            this.enableAdminMode();
        }
    }

    enableCheatMode() {
        this.cheatModeEnabled = true;
        
        // 상단 바 색상 변경
        const topBar = document.getElementById('top-bar');
        if (topBar) {
            topBar.classList.add('cheat-active');
        }
        
        // 치트 버튼 표시
        const cheatBtn = document.getElementById('cheat-btn');
        if (cheatBtn) {
            cheatBtn.style.display = 'block';
            cheatBtn.addEventListener('click', () => this.openCheatModal());
        }
        
        // 치트 모달 이벤트 리스너 설정
        this.setupCheatEventListeners();
        
        this.showNotification('🔧 치트 모드가 활성화되었습니다!', 'success');
    }

    setupCheatEventListeners() {
        // 무기 옵션 생성
        const weaponSelect = document.getElementById('cheat-weapon-select');
        if (weaponSelect) {
            weaponSelect.innerHTML = WEAPONS.map((weapon, index) => 
                `<option value="${index}">${weapon.name}</option>`
            ).join('');
        }

        // 장비 옵션 생성
        const equipmentSelect = document.getElementById('cheat-equipment-select');
        if (equipmentSelect) {
            equipmentSelect.innerHTML = EQUIPMENT.map(eq => 
                `<option value="${eq.id}">${eq.name} (${eq.slot})</option>`
            ).join('');
        }

        // 아이템 옵션 생성 (items.js에서 동적으로)
        const itemSelect = document.getElementById('cheat-item-select');
        if (itemSelect) {
            let itemsHTML = '<option value="">아이템 선택</option>';
            
            // 특수 아이템
            if (ITEMS.special && Object.keys(ITEMS.special).length > 0) {
                itemsHTML += '<optgroup label="특수 아이템">';
                Object.entries(ITEMS.special).forEach(([id, item]) => {
                    itemsHTML += `<option value="${id}">${item.name}</option>`;
                });
                itemsHTML += '</optgroup>';
            }
            
            // 재료
            if (ITEMS.materials && Object.keys(ITEMS.materials).length > 0) {
                itemsHTML += '<optgroup label="재료">';
                Object.entries(ITEMS.materials).forEach(([id, item]) => {
                    itemsHTML += `<option value="${id}">${item.name}</option>`;
                });
                itemsHTML += '</optgroup>';
            }
            
            // 방지권
            if (ITEMS.protections && Object.keys(ITEMS.protections).length > 0) {
                itemsHTML += '<optgroup label="방지권">';
                Object.entries(ITEMS.protections).forEach(([id, item]) => {
                    itemsHTML += `<option value="${id}">${item.name}</option>`;
                });
                itemsHTML += '</optgroup>';
            }
            
            itemSelect.innerHTML = itemsHTML;
        }

        // 골드 설정
        const setGoldBtn = document.getElementById('cheat-set-gold-btn');
        if (setGoldBtn) {
            setGoldBtn.addEventListener('click', () => {
                const goldInput = document.getElementById('cheat-gold-input');
                const amount = parseInt(goldInput.value) || 0;
                this.gameData.gold = amount;
                this.updateDisplay();
                this.saveGameData();
                this.showNotification(`골드를 ${amount.toLocaleString()}원으로 설정했습니다.`, 'success');
            });
        }

        // 골드 추가
        const addGoldBtn = document.getElementById('cheat-add-gold-btn');
        if (addGoldBtn) {
            addGoldBtn.addEventListener('click', () => {
                const goldInput = document.getElementById('cheat-gold-input');
                const amount = parseInt(goldInput.value) || 0;
                this.gameData.gold += amount;
                this.updateDisplay();
                this.saveGameData();
                this.showNotification(`골드를 ${amount.toLocaleString()}원 추가했습니다.`, 'success');
            });
        }

        // 무기 변경
        const setWeaponBtn = document.getElementById('cheat-set-weapon-btn');
        if (setWeaponBtn) {
            setWeaponBtn.addEventListener('click', () => {
                const weaponSelect = document.getElementById('cheat-weapon-select');
                const weaponLevel = parseInt(weaponSelect.value);
                this.gameData.swordLevel = weaponLevel;
                this.updateSwordDisplay(); // 검 표시 즉시 업데이트
                this.updateDisplay();
                this.saveGameData();
                this.showNotification(`무기를 ${WEAPONS[weaponLevel].name}로 변경했습니다.`, 'success');
            });
        }

        // 레벨 설정
        const setLevelBtn = document.getElementById('cheat-set-level-btn');
        if (setLevelBtn) {
            setLevelBtn.addEventListener('click', () => {
                const levelInput = document.getElementById('cheat-level-input');
                const level = parseInt(levelInput.value) || 0;
                if (level >= 0 && level <= 30) {
                    this.gameData.swordLevel = level;
                    this.updateSwordDisplay(); // 검 표시 즉시 업데이트
                    this.updateDisplay();
                    this.saveGameData();
                    this.showNotification(`무기 레벨을 ${level}로 설정했습니다.`, 'success');
                } else {
                    this.showNotification('레벨은 0~30 사이여야 합니다.', 'error');
                }
            });
        }

        // 아이템 추가
        const addItemBtn = document.getElementById('cheat-add-item-btn');
        if (addItemBtn) {
            addItemBtn.addEventListener('click', () => {
                const itemSelect = document.getElementById('cheat-item-select');
                const countInput = document.getElementById('cheat-item-count');
                const itemId = itemSelect.value;
                const count = parseInt(countInput.value) || 1;
                
                if (itemId) {
                    // 방지권인 경우
                    if (itemId.includes('protection')) {
                        this.gameData.protectionItems[itemId] = (this.gameData.protectionItems[itemId] || 0) + count;
                    } else {
                        // 일반 아이템
                        this.gameData.inventory[itemId] = (this.gameData.inventory[itemId] || 0) + count;
                    }
                    
                    this.updateInventoryDisplay(); // 창고 표시 즉시 업데이트
                    this.updateDisplay();
                    this.saveGameData();
                    const itemName = this.getItemName(itemId);
                    this.showNotification(`${itemName} ${count}개를 추가했습니다.`, 'success');
                } else {
                    this.showNotification('아이템을 선택해주세요.', 'error');
                }
            });
        }

        // 장비 추가
        const addEquipmentBtn = document.getElementById('cheat-add-equipment-btn');
        if (addEquipmentBtn) {
            addEquipmentBtn.addEventListener('click', () => {
                const equipmentSelect = document.getElementById('cheat-equipment-select');
                const equipmentId = equipmentSelect.value;
                
                if (equipmentId) {
                    const equipment = EQUIPMENT.find(eq => eq.id === equipmentId);
                    if (equipment) {
                        this.gameData.inventory[equipmentId] = (this.gameData.inventory[equipmentId] || 0) + 1;
                        this.updateInventoryDisplay(); // 창고 표시 즉시 업데이트
                        this.updateDisplay();
                        this.saveGameData();
                        this.showNotification(`${equipment.name}을(를) 추가했습니다.`, 'success');
                    }
                } else {
                    this.showNotification('장비를 선택해주세요.', 'error');
                }
            });
        }

        // 모든 업적 달성
        const unlockAllAchievementsBtn = document.getElementById('cheat-unlock-all-achievements-btn');
        if (unlockAllAchievementsBtn) {
            unlockAllAchievementsBtn.addEventListener('click', () => {
                ACHIEVEMENTS.forEach(achievement => {
                    if (!this.gameData.achievements[achievement.id]) {
                        this.gameData.achievements[achievement.id] = {
                            unlocked: true,
                            unlockedAt: Date.now(),
                            claimed: false
                        };
                    }
                });
                this.updateAchievementsDisplay();
                this.updateDisplay();
                this.saveGameData();
                this.showNotification('모든 업적을 달성했습니다!', 'success');
            });
        }

        // 모든 칭호 획득
        const unlockAllTitlesBtn = document.getElementById('cheat-unlock-all-titles-btn');
        if (unlockAllTitlesBtn) {
            unlockAllTitlesBtn.addEventListener('click', () => {
                TITLES.forEach(title => {
                    if (!this.gameData.titles[title.id]) {
                        this.gameData.titles[title.id] = title;
                    }
                });
                this.updateDisplay();
                this.saveGameData();
                this.showNotification('모든 칭호를 획득했습니다!', 'success');
            });
        }

        // 게임 초기화
        const resetGameBtn = document.getElementById('cheat-reset-game-btn');
        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', () => {
                if (confirm('정말로 게임을 초기화하시겠습니까? 모든 데이터가 삭제됩니다!')) {
                    if (confirm('정말로 확실합니까? 이 작업은 되돌릴 수 없습니다!')) {
                        this.resetGame();
                        this.hideModal('cheat-modal');
                        this.showNotification('게임이 초기화되었습니다.', 'success');
                    }
                }
            });
        }
    }

    openCheatModal() {
        this.showModal('cheat-modal');
    }
    // [CHEAT MODE END] 치트 모드 관련 메서드 끝
    // ============================================

    // ============================================
    // [ADMIN MODE START] 관리자 모드 관련 메서드
    // ============================================
    enableAdminMode() {
        this.adminModeEnabled = true;

        // 상단 바 색상 변경
        const topBar = document.getElementById('top-bar');
        if (topBar) {
            topBar.classList.add('cheat-active');
        }

        // 관리자 버튼 표시
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) {
            adminBtn.style.display = 'block';
            adminBtn.addEventListener('click', () => this.openAdminModal());
        }

        // 관리자 모달 이벤트 리스너 설정
        this.setupAdminEventListeners();

        this.showNotification('⚙️ 관리자 모드가 활성화되었습니다!', 'success');
    }

    setupAdminEventListeners() {
        // 탭 전환
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const file = btn.dataset.file;
                this.switchAdminTab(file);
            });
        });

        // 각 파일별 추가 버튼들
        const addSpecialItemBtn = document.getElementById('admin-add-special-item');
        if (addSpecialItemBtn) {
            addSpecialItemBtn.addEventListener('click', () => this.adminAddSpecialItem());
        }

        const addMaterialItemBtn = document.getElementById('admin-add-material-item');
        if (addMaterialItemBtn) {
            addMaterialItemBtn.addEventListener('click', () => this.adminAddMaterialItem());
        }

        const addProtectionItemBtn = document.getElementById('admin-add-protection-item');
        if (addProtectionItemBtn) {
            addProtectionItemBtn.addEventListener('click', () => this.adminAddProtectionItem());
        }

        const addWeaponBtn = document.getElementById('admin-add-weapon');
        if (addWeaponBtn) {
            addWeaponBtn.addEventListener('click', () => this.adminAddWeapon());
        }

        const addEquipmentBtn = document.getElementById('admin-add-equipment');
        if (addEquipmentBtn) {
            addEquipmentBtn.addEventListener('click', () => this.adminAddEquipment());
        }

        const addShopItemBtn = document.getElementById('admin-add-shop-item');
        if (addShopItemBtn) {
            addShopItemBtn.addEventListener('click', () => this.adminAddShopItem());
        }

        const addAchievementBtn = document.getElementById('admin-add-achievement');
        if (addAchievementBtn) {
            addAchievementBtn.addEventListener('click', () => this.adminAddAchievement());
        }

        const addTitleBtn = document.getElementById('admin-add-title');
        if (addTitleBtn) {
            addTitleBtn.addEventListener('click', () => this.adminAddTitle());
        }

        const addRecipeBtn = document.getElementById('admin-add-recipe');
        if (addRecipeBtn) {
            addRecipeBtn.addEventListener('click', () => this.adminAddRecipe());
        }

        // JSON 다운로드/복사
        const exportJsonBtn = document.getElementById('admin-export-json');
        if (exportJsonBtn) {
            exportJsonBtn.addEventListener('click', () => this.adminExportJson());
        }

        const copyJsonBtn = document.getElementById('admin-copy-json');
        if (copyJsonBtn) {
            copyJsonBtn.addEventListener('click', () => this.adminCopyJson());
        }
    }

    openAdminModal() {
        this.showModal('admin-modal');
        this.switchAdminTab('items');
    }

    switchAdminTab(file) {
        // 탭 버튼 활성화
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-file="${file}"]`).classList.add('active');

        // 파일 내용 표시
        document.querySelectorAll('.admin-file-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`admin-file-${file}`).classList.remove('hidden');

        // 파일 정보 업데이트
        document.getElementById('admin-current-file').textContent = `${file}.js`;

        // 데이터 로드 및 표시
        this.loadAdminFileData(file);
    }

    loadAdminFileData(file) {
        switch (file) {
            case 'items':
                this.renderAdminItems();
                break;
            case 'weapons':
                this.renderAdminWeapons();
                break;
            case 'equipment':
                this.renderAdminEquipment();
                break;
            case 'shop':
                this.renderAdminShop();
                break;
            case 'achievements':
                this.renderAdminAchievements();
                break;
            case 'titles':
                this.renderAdminTitles();
                break;
            case 'forge':
                this.renderAdminForge();
                break;
        }
    }

    renderAdminItems() {
        const list = document.getElementById('admin-items-list');
        list.innerHTML = '';

        // 특수 아이템
        if (ITEMS.special) {
            Object.entries(ITEMS.special).forEach(([id, item]) => {
                const itemDiv = this.createAdminDataItem('special', id, item);
                list.appendChild(itemDiv);
            });
        }

        // 재료
        if (ITEMS.materials) {
            Object.entries(ITEMS.materials).forEach(([id, item]) => {
                const itemDiv = this.createAdminDataItem('material', id, item);
                list.appendChild(itemDiv);
            });
        }

        // 방지권
        if (ITEMS.protections) {
            Object.entries(ITEMS.protections).forEach(([id, item]) => {
                const itemDiv = this.createAdminDataItem('protection', id, item);
                list.appendChild(itemDiv);
            });
        }

        this.updateItemCount('items', list.children.length);
    }

    renderAdminWeapons() {
        const list = document.getElementById('admin-weapons-list');
        list.innerHTML = '';

        WEAPONS.forEach((weapon, index) => {
            const itemDiv = this.createAdminDataItem('weapon', index, weapon);
            list.appendChild(itemDiv);
        });

        this.updateItemCount('weapons', WEAPONS.length);
    }

    renderAdminEquipment() {
        const list = document.getElementById('admin-equipment-list');
        list.innerHTML = '';

        EQUIPMENT.forEach((equipment, index) => {
            const itemDiv = this.createAdminDataItem('equipment', index, equipment);
            list.appendChild(itemDiv);
        });

        this.updateItemCount('equipment', EQUIPMENT.length);
    }

    renderAdminShop() {
        const list = document.getElementById('admin-shop-list');
        list.innerHTML = '';

        // 각 카테고리별로 처리
        Object.entries(SHOP_ITEMS).forEach(([category, items]) => {
            if (Array.isArray(items)) {
                items.forEach((item, index) => {
                    // 아이템에 category 정보 추가
                    const itemWithCategory = { ...item, _category: category };
                    const itemDiv = this.createAdminDataItem('shop', `${category}_${index}`, itemWithCategory, category);
                    list.appendChild(itemDiv);
                });
            }
        });

        this.updateItemCount('shop', list.children.length);
    }

    renderAdminAchievements() {
        const list = document.getElementById('admin-achievements-list');
        list.innerHTML = '';

        ACHIEVEMENTS.forEach((achievement, index) => {
            const itemDiv = this.createAdminDataItem('achievement', index, achievement);
            list.appendChild(itemDiv);
        });

        this.updateItemCount('achievements', ACHIEVEMENTS.length);
    }

    renderAdminTitles() {
        const list = document.getElementById('admin-titles-list');
        list.innerHTML = '';

        TITLES.forEach((title, index) => {
            const itemDiv = this.createAdminDataItem('title', index, title);
            list.appendChild(itemDiv);
        });

        this.updateItemCount('titles', TITLES.length);
    }

    renderAdminForge() {
        const list = document.getElementById('admin-forge-list');
        list.innerHTML = '';

        FORGE_RECIPES.forEach((recipe, index) => {
            const itemDiv = this.createAdminDataItem('recipe', index, recipe);
            list.appendChild(itemDiv);
        });

        this.updateItemCount('forge', FORGE_RECIPES.length);
    }

    createAdminDataItem(type, id, data, category = null) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'admin-data-item';
        itemDiv.dataset.type = type;
        itemDiv.dataset.id = id;

        let title = '';
        let fields = '';

        switch (type) {
            case 'special':
            case 'material':
            case 'protection':
                title = `${data.name} (${id})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">ID</label>
                        <input type="text" value="${id}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name || ''}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">설명</label>
                        <textarea>${data.description || ''}</textarea>
                    </div>
                    ${type === 'special' ? `
                    <div class="admin-field">
                        <label class="admin-field-label">효과 타입</label>
                        <select>
                            <option value="successRate" ${data.effect?.type === 'successRate' ? 'selected' : ''}>성공률</option>
                            <option value="clickGoldMultiplier" ${data.effect?.type === 'clickGoldMultiplier' ? 'selected' : ''}>클릭 골드 배율</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">효과 값</label>
                        <input type="number" value="${data.effect?.value || 0}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">희귀도</label>
                        <select>
                            <option value="common" ${data.rarity === 'common' ? 'selected' : ''}>일반</option>
                            <option value="rare" ${data.rarity === 'rare' ? 'selected' : ''}>희귀</option>
                            <option value="epic" ${data.rarity === 'epic' ? 'selected' : ''}>영웅</option>
                            <option value="legendary" ${data.rarity === 'legendary' ? 'selected' : ''}>전설</option>
                        </select>
                    </div>
                    ` : ''}
                `;
                break;

            case 'weapon':
                title = `${data.name} (+${data.level})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">레벨</label>
                        <input type="number" value="${data.level}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">강화 비용</label>
                        <input type="number" value="${data.upgradeCost}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">판매 가격</label>
                        <input type="number" value="${data.sellPrice}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">성공률</label>
                        <input type="number" value="${data.successRate}" step="0.1">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">클릭 골드</label>
                        <input type="number" value="${data.clickGold}">
                    </div>
                `;
                break;

            case 'equipment':
                title = `${data.name} (${data.id})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">ID</label>
                        <input type="text" value="${data.id}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">슬롯</label>
                        <select>
                            <option value="ring" ${data.slot === 'ring' ? 'selected' : ''}>반지</option>
                            <option value="necklace" ${data.slot === 'necklace' ? 'selected' : ''}>목걸이</option>
                            <option value="bracelet" ${data.slot === 'bracelet' ? 'selected' : ''}>팔찌</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">효과 타입</label>
                        <select>
                            <option value="clickGoldMultiplier" ${data.effect === 'clickGoldMultiplier' ? 'selected' : ''}>클릭 골드 배율</option>
                            <option value="successRate" ${data.effect === 'successRate' ? 'selected' : ''}>성공률</option>
                            <option value="autoClickSpeed" ${data.effect === 'autoClickSpeed' ? 'selected' : ''}>자동 클릭 속도</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">효과 값</label>
                        <input type="number" value="${data.value}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">희귀도</label>
                        <select>
                            <option value="common" ${data.rarity === 'common' ? 'selected' : ''}>일반</option>
                            <option value="rare" ${data.rarity === 'rare' ? 'selected' : ''}>희귀</option>
                            <option value="epic" ${data.rarity === 'epic' ? 'selected' : ''}>영웅</option>
                            <option value="legendary" ${data.rarity === 'legendary' ? 'selected' : ''}>전설</option>
                        </select>
                    </div>
                `;
                break;

            case 'shop':
                title = `${data.name} (${data.id})`;
                let shopFields = '';

                // 카테고리에 따라 다른 필드들 생성
                if (category === 'warpItems') {
                    shopFields = `
                        <div class="admin-field">
                            <label class="admin-field-label">ID</label>
                            <input type="text" value="${data.id}" disabled>
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">이름</label>
                            <input type="text" value="${data.name || ''}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">효과</label>
                            <input type="text" value="${data.effect || ''}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">값</label>
                            <input type="number" value="${data.value || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">가격</label>
                            <input type="number" value="${data.price || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">무제한</label>
                            <select>
                                <option value="true" ${data.unlimited ? 'selected' : ''}>예</option>
                                <option value="false" ${!data.unlimited ? 'selected' : ''}>아니오</option>
                            </select>
                        </div>
                    `;
                } else if (category === 'protectionItems') {
                    shopFields = `
                        <div class="admin-field">
                            <label class="admin-field-label">ID</label>
                            <input type="text" value="${data.id}" disabled>
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">이름</label>
                            <input type="text" value="${data.name || ''}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">최대 레벨</label>
                            <input type="number" value="${data.maxLevel || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">가격</label>
                            <input type="number" value="${data.price || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">무제한</label>
                            <select>
                                <option value="true" ${data.unlimited ? 'selected' : ''}>예</option>
                                <option value="false" ${!data.unlimited ? 'selected' : ''}>아니오</option>
                            </select>
                        </div>
                    `;
                } else if (category === 'specialItems') {
                    shopFields = `
                        <div class="admin-field">
                            <label class="admin-field-label">ID</label>
                            <input type="text" value="${data.id}" disabled>
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">이름</label>
                            <input type="text" value="${data.name || ''}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">효과</label>
                            <input type="text" value="${data.effect || ''}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">값</label>
                            <input type="number" value="${data.value || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">가격</label>
                            <input type="number" value="${data.price || 0}">
                        </div>
                        <div class="admin-field">
                            <label class="admin-field-label">구매 제한</label>
                            <input type="number" value="${data.purchaseLimit || ''}" placeholder="무제한">
                        </div>
                    `;
                }

                fields = shopFields;
                break;

            case 'achievement':
                title = `${data.name} (${data.id})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">ID</label>
                        <input type="text" value="${data.id}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">조건 타입</label>
                        <select>
                            <option value="weapon_level" ${data.condition?.type === 'weapon_level' ? 'selected' : ''}>무기 레벨</option>
                            <option value="total_gold" ${data.condition?.type === 'total_gold' ? 'selected' : ''}>누적 골드</option>
                            <option value="total_clicks" ${data.condition?.type === 'total_clicks' ? 'selected' : ''}>총 클릭</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">조건 값</label>
                        <input type="number" value="${data.condition?.value || 0}">
                    </div>
                `;
                break;

            case 'title':
                title = `${data.name} (${data.id})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">ID</label>
                        <input type="text" value="${data.id}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">희귀도</label>
                        <select>
                            <option value="common" ${data.rarity === 'common' ? 'selected' : ''}>일반</option>
                            <option value="rare" ${data.rarity === 'rare' ? 'selected' : ''}>희귀</option>
                            <option value="epic" ${data.rarity === 'epic' ? 'selected' : ''}>영웅</option>
                            <option value="legendary" ${data.rarity === 'legendary' ? 'selected' : ''}>전설</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">효과 타입</label>
                        <select>
                            <option value="clickGoldMultiplier" ${data.effect?.type === 'clickGoldMultiplier' ? 'selected' : ''}>클릭 골드 배율</option>
                            <option value="successRate" ${data.effect?.type === 'successRate' ? 'selected' : ''}>성공률</option>
                        </select>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">효과 값</label>
                        <input type="number" value="${data.effect?.value || 0}">
                    </div>
                `;
                break;

            case 'recipe':
                title = `${data.name} (${data.id})`;
                fields = `
                    <div class="admin-field">
                        <label class="admin-field-label">ID</label>
                        <input type="text" value="${data.id}" disabled>
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">이름</label>
                        <input type="text" value="${data.name}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">결과 아이템</label>
                        <input type="text" value="${data.result?.item || ''}">
                    </div>
                    <div class="admin-field">
                        <label class="admin-field-label">결과 개수</label>
                        <input type="number" value="${data.result?.count || 1}">
                    </div>
                `;
                break;
        }

        itemDiv.innerHTML = `
            <div class="admin-data-item-header">
                <div class="admin-data-item-title">${title}</div>
                <div class="admin-data-item-actions">
                    <button class="admin-edit-btn" onclick="game.adminEditDataItem('${type}', '${id}')">수정</button>
                    <button class="admin-delete-btn" onclick="game.adminDeleteDataItem('${type}', '${id}')">삭제</button>
                </div>
            </div>
            <div class="admin-data-item-body">
                ${fields}
            </div>
        `;

        return itemDiv;
    }

    updateItemCount(file, count) {
        document.getElementById('admin-item-count').textContent = `${count} items`;
    }

    // 데이터 아이템 편집
    adminEditDataItem(type, id) {
        const itemDiv = document.querySelector(`[data-type="${type}"][data-id="${id}"]`);
        if (!itemDiv) return;

        const fields = itemDiv.querySelectorAll('.admin-field input, .admin-field select, .admin-field textarea');
        const data = {};

        fields.forEach(field => {
            const label = field.previousElementSibling.textContent.toLowerCase();
            if (field.tagName === 'TEXTAREA') {
                data[label] = field.value;
            } else if (field.type === 'number') {
                data[label] = parseFloat(field.value) || 0;
            } else {
                data[label] = field.value;
            }
        });

        // 데이터 업데이트 로직
        this.updateGameData(type, id, data);
        this.showNotification('데이터가 업데이트되었습니다.', 'success');
    }

    // 데이터 아이템 삭제
    adminDeleteDataItem(type, id) {
        if (!confirm('정말로 이 항목을 삭제하시겠습니까?')) return;

        this.deleteGameData(type, id);
        this.showNotification('항목이 삭제되었습니다.', 'success');

        // 현재 탭 새로고침
        const currentFile = document.querySelector('.admin-tab-btn.active').dataset.file;
        this.loadAdminFileData(currentFile);
    }

    // 게임 데이터 업데이트
    updateGameData(type, id, data) {
        switch (type) {
            case 'special':
                if (ITEMS.special[id]) {
                    ITEMS.special[id] = {
                        id: id,
                        name: data['이름'],
                        description: data['설명'],
                        effect: {
                            type: data['효과 타입'],
                            value: data['효과 값']
                        },
                        rarity: data['희귀도']
                    };
                }
                break;

            case 'material':
                if (ITEMS.materials[id]) {
                    ITEMS.materials[id] = {
                        id: id,
                        name: data['이름'],
                        description: data['설명']
                    };
                }
                break;

            case 'protection':
                if (ITEMS.protections[id]) {
                    ITEMS.protections[id] = {
                        id: id,
                        name: data['이름'],
                        description: data['설명']
                    };
                }
                break;

            case 'weapon':
                if (WEAPONS[id]) {
                    WEAPONS[id] = {
                        level: parseInt(data['레벨']),
                        name: data['이름'],
                        upgradeCost: data['강화 비용'],
                        sellPrice: data['판매 가격'],
                        successRate: data['성공률'],
                        clickGold: data['클릭 골드'],
                        specialEffect: null,
                        visual: WEAPONS[id].visual
                    };
                }
                break;

            case 'equipment':
                if (EQUIPMENT[id]) {
                    EQUIPMENT[id] = {
                        id: EQUIPMENT[id].id,
                        name: data['이름'],
                        slot: data['슬롯'],
                        effect: data['효과 타입'],
                        value: data['효과 값'],
                        rarity: data['희귀도'],
                        obtainable: EQUIPMENT[id].obtainable
                    };
                }
                break;

            case 'shop':
                // id는 category_index 형식
                const [category, indexStr] = id.split('_');
                const index = parseInt(indexStr);
                if (SHOP_ITEMS[category] && SHOP_ITEMS[category][index]) {
                    if (category === 'warpItems') {
                        SHOP_ITEMS[category][index] = {
                            id: data['아이디'],
                            name: data['이름'],
                            effect: data['효과'],
                            value: data['값'],
                            price: data['가격'],
                            unlimited: data['무제한'] === 'true'
                        };
                    } else if (category === 'protectionItems') {
                        SHOP_ITEMS[category][index] = {
                            id: data['아이디'],
                            name: data['이름'],
                            maxLevel: data['최대 레벨'],
                            price: data['가격'],
                            unlimited: data['무제한'] === 'true'
                        };
                    } else if (category === 'specialItems') {
                        SHOP_ITEMS[category][index] = {
                            id: data['아이디'],
                            name: data['이름'],
                            effect: data['효과'],
                            value: data['값'],
                            price: data['가격'],
                            purchaseLimit: data['구매 제한']
                        };
                    }
                }
                break;
        }
    }

    // 게임 데이터 삭제
    deleteGameData(type, id) {
        switch (type) {
            case 'special':
                delete ITEMS.special[id];
                break;
            case 'material':
                delete ITEMS.materials[id];
                break;
            case 'protection':
                delete ITEMS.protections[id];
                break;
            case 'weapon':
                WEAPONS.splice(id, 1);
                break;
            case 'equipment':
                EQUIPMENT.splice(id, 1);
                break;

            case 'shop':
                // id는 category_index 형식
                const [category, indexStr] = id.split('_');
                const index = parseInt(indexStr);
                if (SHOP_ITEMS[category] && SHOP_ITEMS[category][index]) {
                    SHOP_ITEMS[category].splice(index, 1);
                }
                break;
        }
    }

    // 아이템 추가 함수들
    adminAddSpecialItem() {
        const id = prompt('아이템 ID를 입력하세요:');
        if (!id) return;

        ITEMS.special[id] = {
            id: id,
            name: '새 특수 아이템',
            description: '설명을 입력하세요',
            effect: { type: 'successRate', value: 5 },
            rarity: 'common'
        };

        this.renderAdminItems();
        this.showNotification('특수 아이템이 추가되었습니다.', 'success');
    }

    adminAddMaterialItem() {
        const id = prompt('재료 ID를 입력하세요:');
        if (!id) return;

        ITEMS.materials[id] = {
            id: id,
            name: '새 재료',
            description: '설명을 입력하세요'
        };

        this.renderAdminItems();
        this.showNotification('재료가 추가되었습니다.', 'success');
    }

    adminAddProtectionItem() {
        const id = prompt('방지권 ID를 입력하세요:');
        if (!id) return;

        ITEMS.protections[id] = {
            id: id,
            name: '새 방지권',
            description: '설명을 입력하세요'
        };

        this.renderAdminItems();
        this.showNotification('방지권이 추가되었습니다.', 'success');
    }

    adminAddWeapon() {
        const level = WEAPONS.length;
        WEAPONS.push({
            level: level,
            name: '새 무기',
            upgradeCost: 1000,
            sellPrice: 500,
            successRate: 80,
            clickGold: level + 1,
            specialEffect: null,
            visual: {
                image: "assets/weapons/sword_0.png",
                color: "gray",
                particle: null,
                background: null
            }
        });

        this.renderAdminWeapons();
        this.showNotification('무기가 추가되었습니다.', 'success');
    }

    adminAddEquipment() {
        const id = prompt('장비 ID를 입력하세요:');
        if (!id) return;

        EQUIPMENT.push({
            id: id,
            name: '새 장비',
            slot: 'ring',
            effect: 'clickGoldMultiplier',
            value: 10,
            rarity: 'common',
            obtainable: ['random_box']
        });

        this.renderAdminEquipment();
        this.showNotification('장비가 추가되었습니다.', 'success');
    }

    adminAddShopItem() {
        const id = prompt('상점 아이템 ID를 입력하세요:');
        if (!id) return;

        const item = {
            id: id,
            name: '새 상점 아이템',
            price: 1000,
            effect: 'clickMultiplier',
            description: '설명을 입력하세요'
        };

        if (!SHOP_ITEMS.warpItems) SHOP_ITEMS.warpItems = [];
        SHOP_ITEMS.warpItems.push(item);

        this.renderAdminShop();
        this.showNotification('상점 아이템이 추가되었습니다.', 'success');
    }

    adminAddAchievement() {
        const id = prompt('업적 ID를 입력하세요:');
        if (!id) return;

        ACHIEVEMENTS.push({
            id: id,
            name: '새 업적',
            condition: { type: 'weapon_level', value: 10 },
            reward: { gold: 1000 }
        });

        this.renderAdminAchievements();
        this.showNotification('업적이 추가되었습니다.', 'success');
    }

    adminAddTitle() {
        const id = prompt('칭호 ID를 입력하세요:');
        if (!id) return;

        TITLES.push({
            id: id,
            name: '새 칭호',
            rarity: 'common',
            effect: { type: 'clickGoldMultiplier', value: 10 }
        });

        this.renderAdminTitles();
        this.showNotification('칭호가 추가되었습니다.', 'success');
    }

    adminAddRecipe() {
        const id = prompt('레시피 ID를 입력하세요:');
        if (!id) return;

        FORGE_RECIPES.push({
            id: id,
            name: '새 레시피',
            materials: [{ item: 'example_material', count: 1 }],
            result: { item: 'example_result', count: 1 }
        });

        this.renderAdminForge();
        this.showNotification('레시피가 추가되었습니다.', 'success');
    }

    // JSON 다운로드
    adminExportJson() {
        const currentFile = document.querySelector('.admin-tab-btn.active').dataset.file;
        let data, filename;

        switch (currentFile) {
            case 'items':
                data = ITEMS;
                filename = 'items.js';
                break;
            case 'weapons':
                data = WEAPONS;
                filename = 'weapons.js';
                break;
            case 'equipment':
                data = EQUIPMENT;
                filename = 'equipment.js';
                break;
            case 'shop':
                data = SHOP_ITEMS;
                filename = 'shop.js';
                break;
            case 'achievements':
                data = ACHIEVEMENTS;
                filename = 'achievements.js';
                break;
            case 'titles':
                data = TITLES;
                filename = 'titles.js';
                break;
            case 'forge':
                data = FORGE_RECIPES;
                filename = 'forge.js';
                break;
        }

        const jsonString = `// ${filename}\nconst ${currentFile.toUpperCase()} = ${JSON.stringify(data, null, 4)};`;
        const blob = new Blob([jsonString], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification(`${filename} 파일이 다운로드되었습니다.`, 'success');
    }

    // JSON 복사
    adminCopyJson() {
        const currentFile = document.querySelector('.admin-tab-btn.active').dataset.file;
        let data;

        switch (currentFile) {
            case 'items':
                data = ITEMS;
                break;
            case 'weapons':
                data = WEAPONS;
                break;
            case 'equipment':
                data = EQUIPMENT;
                break;
            case 'shop':
                data = SHOP_ITEMS;
                break;
            case 'achievements':
                data = ACHIEVEMENTS;
                break;
            case 'titles':
                data = TITLES;
                break;
            case 'forge':
                data = FORGE_RECIPES;
                break;
        }

        const jsonString = `// ${currentFile}.js\nconst ${currentFile.toUpperCase()} = ${JSON.stringify(data, null, 4)};`;

        navigator.clipboard.writeText(jsonString).then(() => {
            this.showNotification('JSON이 클립보드에 복사되었습니다.', 'success');
        }).catch(() => {
            this.showNotification('클립보드 복사에 실패했습니다.', 'error');
        });
    }
    // [ADMIN MODE END] 관리자 모드 관련 메서드 끝
    // ============================================
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new SwordUpgradeGame();
});