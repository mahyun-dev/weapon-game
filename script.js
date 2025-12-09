// 검 강화하기 게임 메인 스크립트

class SwordUpgradeGame {
    constructor() {
        this.gameData = this.loadGameData();
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
            titles: {},
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
                lastSave: Date.now()
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
        setInterval(() => {
            this.saveGameData();
        }, 30000); // 30초마다 저장
    }

    // 검 클릭
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
        let basePower = 1;

        // 워프권 효과
        if (this.gameData.equipment.warpTicket) {
            basePower *= this.gameData.equipment.warpTicket.value;
        }

        // 장비 효과
        if (this.gameData.equipment.golden_ring) {
            basePower *= (1 + this.gameData.equipment.golden_ring.value / 100);
        }

        // 칭호 효과
        if (this.gameData.titles.beginner_adventurer) {
            basePower *= (1 + this.gameData.titles.beginner_adventurer.effect.value / 100);
        }

        return Math.floor(basePower);
    }

    // 강화 시도
    attemptUpgrade() {
        const currentWeapon = WEAPONS[this.gameData.swordLevel];
        if (!currentWeapon) return;

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

        // 행운의 부적 효과
        if (this.gameData.equipment.luck_charm) {
            baseRate += this.gameData.equipment.luck_charm.value;
        }

        // 대장장이의 팔찌 효과
        if (this.gameData.equipment.blacksmith_bracelet) {
            baseRate += this.gameData.equipment.blacksmith_bracelet.value;
        }

        // 칭호 효과
        if (this.gameData.titles.god_of_enhancement) {
            baseRate += this.gameData.titles.god_of_enhancement.effect.value;
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
        const isCritical = Math.random() * 100 < 5; // 5% 크리티컬 확률

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

        const sellPrice = currentWeapon.sellPrice;
        this.gameData.gold += sellPrice;
        this.gameData.stats.totalGoldEarned += sellPrice;
        this.gameData.swordLevel = 0;

        this.showNotification(`검을 판매했습니다! ₩${sellPrice.toLocaleString()}`, 'success');
        this.updateSwordDisplay();
        this.updateDisplay();
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
        document.getElementById('protection-display').textContent = this.getTotalProtectionCount();
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
        const canUpgrade = this.gameData.gold >= weapon.upgradeCost;
        upgradeBtn.disabled = !canUpgrade;
        upgradeBtn.textContent = canUpgrade ? `강화 (₩${weapon.upgradeCost.toLocaleString()})` : '골드 부족';
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

        this.gameData.gold -= item.price;

        // 아이템 효과 적용
        switch (item.effect) {
            case 'clickMultiplier':
                this.gameData.equipment.warpTicket = item;
                break;
            case 'successRate':
                this.gameData.equipment[item.id] = item;
                break;
            case 'autoClick':
                this.gameData.equipment.autoClicker = item;
                break;
            case 'randomEquipment':
                this.giveRandomEquipment();
                break;
        }

        this.showNotification(`${item.name} 구매 완료!`, 'success');
        this.updateDisplay();
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

        // 재료 아이템 이름 매핑
        const materialNames = {
            'evil_soul': '사악한 영혼',
            'axe_powder': '도끼 가루',
            'transparent_material': '투명 물질',
            'ancient_fragment': '고대 파편',
            'mysterious_powder': '신비한 가루',
            'legend_piece': '전설 조각',
            'luck_powder': '행운의 가루',
            'blessing_crystal': '축복의 결정',
            'broken_protection': '부서진 보호권',
            'old_protection': '오래된 보호권',
            'normal_protection': '일반 보호권',
            'high_protection': '고급 보호권'
        };

        return materialNames[itemId] || itemId;
    }

    // 대장간 조합 실행
    craftForgeRecipe(recipe) {
        // 재료 확인
        for (const material of recipe.materials) {
            const currentCount = this.gameData.inventory[material.item] || 0;
            if (currentCount < material.count) {
                alert(`${this.getItemName(material.item)}이(가) 부족합니다!`);
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

        // 저장 및 UI 업데이트
        this.saveGameData();
        this.updateInventoryDisplay();
        this.updateForgeDisplay();

        alert(`${recipe.name} 조합이 완료되었습니다!`);
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

        Object.entries(this.gameData.inventory).forEach(([itemId, count]) => {
            if (count > 0) {
                const material = MATERIAL_DROPS[itemId];
                const equipment = EQUIPMENT.find(item => item.id === itemId);
                const itemName = material ? material.name : (equipment ? equipment.name : itemId);
                
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
            if (!confirm(`${this.gameData.equipment[slotId].name}을(를) 해제하고 ${equipment.name}을(를) 장착하시겠습니까?`)) {
                return;
            }
        }
        
        // 장착
        this.gameData.equipment[slotId] = equipment;
        
        // 인벤토리에서 제거
        this.gameData.inventory[equipment.id]--;
        if (this.gameData.inventory[equipment.id] <= 0) {
            delete this.gameData.inventory[equipment.id];
        }
        
        this.updateInventoryDisplay();
        this.updateDisplay();
        this.showNotification(`${equipment.name}을(를) 장착했습니다!`, 'success');
    }

    // 랜덤 장비 지급
    giveRandomEquipment() {
        // 랜덤 장비 선택
        const availableEquipment = EQUIPMENT.filter(item => item.obtainable.includes('random_box'));
        if (availableEquipment.length === 0) {
            this.showNotification('사용 가능한 장비가 없습니다.', 'error');
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableEquipment.length);
        const selectedEquipment = availableEquipment[randomIndex];

        // 인벤토리에 장비 추가
        if (!this.gameData.inventory[selectedEquipment.id]) {
            this.gameData.inventory[selectedEquipment.id] = 0;
        }
        this.gameData.inventory[selectedEquipment.id]++;

        this.updateInventoryDisplay();
        this.showNotification(`${selectedEquipment.name}을(를) 얻었습니다!`, 'success');
    }

    // 장비 슬롯 클릭 처리
    handleEquipmentSlotClick(slotId) {
        const equippedItem = this.gameData.equipment[slotId];
        
        if (equippedItem) {
            // 장착된 아이템이 있으면 해제 확인
            if (confirm(`${equippedItem.name}을(를) 해제하시겠습니까?`)) {
                delete this.gameData.equipment[slotId];
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
                    progressText = `현재 레벨: +${currentValue}`;
                    currentValue = this.gameData.swordLevel;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_gold':
                    conditionText = `누적 ₩${achievement.condition.value.toLocaleString()} 획득`;
                    progressText = `현재 누적: ₩${currentValue.toLocaleString()}`;
                    currentValue = this.gameData.stats.totalGoldEarned;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_clicks':
                    conditionText = `총 ${achievement.condition.value.toLocaleString()}회 클릭`;
                    progressText = `현재 클릭: ${currentValue.toLocaleString()}회`;
                    currentValue = this.gameData.stats.totalClicks;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
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
        }

        if (achievement.reward.item) {
            // 아이템 지급 로직
        }

        if (achievement.reward.title) {
            this.gameData.titles[achievement.reward.title] = TITLES.find(t => t.id === achievement.reward.title);
        }
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
        // 자동 클릭
        setInterval(() => {
            if (this.gameData.equipment.autoClicker) {
                for (let i = 0; i < this.gameData.equipment.autoClicker.value; i++) {
                    this.clickSword();
                }
            }
        }, 1000);

        // 플레이 시간 카운트
        setInterval(() => {
            this.gameData.stats.playTime++;
        }, 1000);
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
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    // 업적 상세 표시
    showAchievementDetail(achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        const isCompleted = this.gameData.achievements[achievementId]?.completed || false;
        const progress = this.gameData.achievements[achievementId]?.progress || 0;

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
            default:
                conditionText = achievement.name;
        }

        // 보상 텍스트 생성
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
            if (achievement.reward.item) {
                rewardText += `${achievement.reward.item}`;
            }
            if (achievement.reward.title) {
                rewardText += `칭호: ${achievement.reward.title}`;
            }
        }

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
            localStorage.removeItem('swordUpgradeGameData');
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
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new SwordUpgradeGame();
});