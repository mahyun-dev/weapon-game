// 창고/장비 시스템 모듈
class InventorySystem {
    constructor(game) {
        this.game = game;
    }

    // 등급을 한글로 변환
    getRarityInKorean(rarity) {
        const rarityMap = {
            'common': '일반',
            'uncommon': '고급',
            'rare': '희귀',
            'epic': '영웅',
            'legendary': '전설',
            'mythical': '신화'
        };
        return rarityMap[rarity] || rarity;
    }

    // 장비 아이콘 가져오기
    getEquipmentIcon(slot) {
        switch (slot) {
            case 'head': return '👑';
            case 'necklace': return '📿';
            case 'bracelet': return '💍';
            case 'ring': return '💍';
            default: return '⚔️';
        }
    }

    // 창고 그리드 표시 업데이트
    updateInventoryGrid() {
        const inventoryGrid = document.getElementById('inventory-grid');
        inventoryGrid.innerHTML = '';

        // 모든 인벤토리 아이템 표시 (방지권, 재료, 특수 아이템) - 장비 제외
        const allItems = { ...this.game.gameData.inventory, ...this.game.gameData.protectionItems };

        Object.entries(allItems).forEach(([itemId, count]) => {
            if (count > 0) {
                // 장비 아이템 제외
                const isEquipment = EQUIPMENT.find(item => item.id === itemId);
                if (!isEquipment) {
                    const itemName = GameUtils.getItemName(itemId);
                    const itemElement = document.createElement('div');
                    itemElement.className = 'inventory-grid-item';
                    itemElement.innerHTML = `
                        <div class="inventory-item-image">📦</div>
                        <div class="inventory-item-name">${itemName}</div>
                        <div class="inventory-item-count">x${count}</div>
                    `;

                    // 클릭 이벤트 - 아이템 설명 표시
                    itemElement.addEventListener('click', () => {
                        this.showItemDescription(itemId, itemName);
                    });

                    inventoryGrid.appendChild(itemElement);
                }
            }
        });
    }

    // 장비 표시 업데이트
    updateEquipmentDisplay() {
        // 장비 슬롯
        const equipmentSlots = document.getElementById('equipment-slots');
        equipmentSlots.innerHTML = '';

        Object.entries(EQUIPMENT_SLOTS).forEach(([slotId, slotName]) => {
            const slotElement = document.createElement('div');
            slotElement.className = 'equipment-slot-item';
            
            const equippedItem = this.game.gameData.equipment[slotId];
            let itemImage = '⬜'; // 기본 빈 슬롯
            let itemName = slotName;
            
            if (equippedItem) {
                // 장착된 아이템이 있으면 해당 슬롯 타입에 맞는 이모지 표시
                switch(slotId) {
                    case 'head': itemImage = '👑'; break;
                    case 'necklace': itemImage = '📿'; break;
                    case 'bracelet': itemImage = '💍'; break;
                    case 'ring': itemImage = '💍'; break;
                    default: itemImage = '⚔️';
                }
                itemName = equippedItem.name;
            }
            
            slotElement.innerHTML = `
                <div class="slot-image">${itemImage}</div>
                <div class="slot-name">${itemName}</div>
            `;
            
            // 장비 슬롯 클릭 이벤트
            slotElement.addEventListener('click', () => {
                this.handleEquipmentSlotClick(slotId);
            });
            
            // 장비 슬롯 더블클릭 이벤트 - 장착 해제
            slotElement.addEventListener('dblclick', () => {
                const equippedItem = this.game.gameData.equipment[slotId];
                if (equippedItem) {
                    if (!this.game.gameData.inventory[equippedItem.id]) {
                        this.game.gameData.inventory[equippedItem.id] = 0;
                    }
                    this.game.gameData.inventory[equippedItem.id]++;
                    
                    delete this.game.gameData.equipment[slotId];
                    this.game.saveGameData();
                    this.updateInventoryGrid();
                    this.updateEquipmentDisplay();
                    this.game.updateDisplay();
                    this.game.updateSwordDisplay();
                    this.game.showNotification(`${equippedItem.name}을(를) 해제했습니다.`, 'success');
                }
            });
            
            equipmentSlots.appendChild(slotElement);
        });

    }

    // 특수 아이템 사용
    useSpecialItem(itemId, specialItem) {
        // 이미 사용 중인지 확인
        if (this.game.gameData.equipment[itemId]) {
            this.game.showNotification(`${specialItem.name}은(는) 이미 사용 중입니다.`, 'warning');
            return;
        }

        // 아이템 사용 확인
        if (!confirm(`${specialItem.name}을(를) 사용하시겠습니까?\n효과: ${specialItem.description}`)) {
            return;
        }

        // 효과 적용
        this.game.gameData.equipment[itemId] = specialItem;

        // 인벤토리에서 제거
        this.game.gameData.inventory[itemId]--;
        if (this.game.gameData.inventory[itemId] <= 0) {
            delete this.game.gameData.inventory[itemId];
        }

        // UI 업데이트
        this.updateInventoryGrid();
        this.updateDisplay();
        this.game.updateSwordDisplay();
        this.game.saveGameData();

        this.game.showNotification(`${specialItem.name}을(를) 사용했습니다!`, 'success');
    }

    // 장비 아이템 설명 생성
    getEquipmentDescription(equipment) {
        let description = '';

        switch (equipment.effect) {
            case 'clickGoldMultiplier':
                description = `클릭 골드 +${equipment.value}%`;
                break;
            case 'autoClickSpeed':
                description = `자동 클릭 속도 +${equipment.value}%`;
                break;
            case 'criticalChance':
                description = `크리티컬 확률 +${equipment.value}%`;
                break;
            case 'successRate':
                description = `강화 성공률 +${equipment.value}%`;
                break;
            case 'clickDamage':
                description = `클릭 데미지 +${equipment.value}`;
                break;
            case 'criticalDamage':
                description = `크리티컬 데미지 +${equipment.value}%`;
                break;
            case 'allStats':
                description = `모든 능력치 +${equipment.value}%`;
                break;
            case 'autoGold':
                description = `자동 골드 +${equipment.value}원/초`;
                break;
            case 'specialEffectChance':
                description = `특수 효과 확률 +${equipment.value}%`;
                break;
            case 'goldMultiplier':
                description = `골드 획득 배율 +${equipment.value}%`;
                break;
            case 'materialDropRate':
                description = `재료 드롭률 +${equipment.value}%`;
                break;
            case 'sellMultiplier':
                description = `판매가 배율 +${equipment.value}%`;
                break;
            default:
                description = `${equipment.effect}: +${equipment.value}`;
        }

        return description;
    }

    // 아이템 설명 표시 (모달로)
    showItemDescription(itemId, itemName) {
        let description = '';
        let rarity = '';
        let itemType = '';

        // 장비 아이템
        const equipment = EQUIPMENT.find(item => item.id === itemId);
        if (equipment) {
            description = this.getEquipmentDescription(equipment);
            rarity = this.getRarityInKorean(equipment.rarity);
            itemType = '장비 아이템';
        }
        // 특수 아이템
        else if (ITEMS.special[itemId]) {
            description = ITEMS.special[itemId].description;
            rarity = this.getRarityInKorean(ITEMS.special[itemId].rarity);
            itemType = '특별 아이템';
        }
        // 재료 아이템
        else if (ITEMS.materials[itemId]) {
            description = ITEMS.materials[itemId].description;
            rarity = this.getRarityInKorean(ITEMS.materials[itemId].rarity);
            itemType = '재료 아이템';
        }
        // 방지권 아이템
        else if (ITEMS.protections[itemId]) {
            description = ITEMS.protections[itemId].description;
            rarity = this.getRarityInKorean(ITEMS.protections[itemId].rarity);
            itemType = '방지권 아이템';
        }

        if (description) {
            // 모달로 표시
            this.showItemDescriptionModal(itemName, description, itemType, rarity, itemId);
        }
    }

    // 아이템 설명 모달 표시
    showItemDescriptionModal(itemName, description, itemType, rarity, itemId) {
        // 인벤토리 모달 숨기기
        this.game.hideModal('inventory-modal');

        // 제목 설정
        document.getElementById('item-description-title').textContent = itemName;

        // 아이템 타입에 따른 버튼 생성
        let actionButton = '';
        if (itemType === '장비 아이템') {
            // 장비 아이템인 경우 장착 버튼
            const equipment = EQUIPMENT.find(e => e.id === itemId);
            if (equipment) {
                const isEquipped = this.game.gameData.equipment[equipment.slot]?.id === itemId;
                actionButton = `<button class="action-btn ${isEquipped ? 'equipped' : ''}" id="equip-btn">
                    ${isEquipped ? '장착중' : '장착하기'}
                </button>`;
            }
        } else if (itemType === '특별 아이템' || itemType === '방지권 아이템') {
            // 특별 아이템이나 방지권인 경우 사용 버튼
            actionButton = `<button class="action-btn" id="use-btn">사용하기</button>`;
        }

        // 내용 설정
        const content = document.getElementById('item-description-content');
        content.innerHTML = `
            <div class="item-description-section">
                <div class="item-type">타입: ${itemType}</div>
                ${rarity ? `<div class="item-rarity rarity-${rarity.toLowerCase()}">등급: ${rarity}</div>` : ''}
                <div class="item-description">${description}</div>
                ${actionButton ? `<div class="item-actions">${actionButton}</div>` : ''}
            </div>
        `;

        // 이벤트 리스너 설정
        const closeBtn = document.querySelector('#item-description-modal .close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.game.hideModal('item-description-modal');
            });
        }

        if (actionButton) {
            if (itemType === '장비 아이템') {
                const equipBtn = document.getElementById('equip-btn');
                if (equipBtn && !equipBtn.classList.contains('equipped')) {
                    equipBtn.addEventListener('click', () => {
                        const equipment = EQUIPMENT.find(e => e.id === itemId);
                        if (equipment) {
                            this.equipItem(equipment);
                            this.game.hideModal('item-description-modal');
                        }
                    });
                }
            } else if (itemType === '특별 아이템' || itemType === '방지권 아이템') {
                const useBtn = document.getElementById('use-btn');
                if (useBtn) {
                    useBtn.addEventListener('click', () => {
                        this.useItem(itemId);
                        this.game.hideModal('item-description-modal');
                    });
                }
            }
        }

        // 모달 표시
        this.game.showModal('item-description-modal');
    }

    // 아이템 장착
    equipItem(equipment) {
        const slotId = equipment.slot;
        if (this.game.gameData.equipment[slotId]) {
            const oldEquipment = this.game.gameData.equipment[slotId];
            if (!confirm(`${oldEquipment.name}을(를) 해제하고 ${equipment.name}을(를) 장착하시겠습니까?`)) {
                return;
            }
            
            // 기존 장비를 인벤토리로 반환
            if (!this.game.gameData.inventory[oldEquipment.id]) {
                this.game.gameData.inventory[oldEquipment.id] = 0;
            }
            this.game.gameData.inventory[oldEquipment.id]++;
        }
        
        // 장착
        this.game.gameData.equipment[slotId] = equipment;
        
        // 인벤토리에서 제거
        this.game.gameData.inventory[equipment.id]--;
        if (this.game.gameData.inventory[equipment.id] <= 0) {
            delete this.game.gameData.inventory[equipment.id];
        }
        
        this.game.saveGameData();
        this.updateInventoryGrid();
        this.updateEquipmentDisplay();
        this.game.updateDisplay();
        this.game.updateSwordDisplay();
        this.game.soundSystem.playSound('equip');
        this.game.showNotification(`${equipment.name}을(를) 장착했습니다!`, 'success');
    }

    // 특정 슬롯에 아이템 장착 (교체용)
    equipItemToSlot(equipment, slotId) {
        // 이미 장착된 아이템이 있으면 인벤토리로 반환
        const currentEquipped = this.game.gameData.equipment[slotId];
        if (currentEquipped) {
            if (!this.game.gameData.inventory[currentEquipped.id]) {
                this.game.gameData.inventory[currentEquipped.id] = 0;
            }
            this.game.gameData.inventory[currentEquipped.id]++;
        }
        
        // 새 아이템 장착
        this.game.gameData.equipment[slotId] = equipment;
        
        // 인벤토리에서 제거
        this.game.gameData.inventory[equipment.id]--;
        if (this.game.gameData.inventory[equipment.id] <= 0) {
            delete this.game.gameData.inventory[equipment.id];
        }
        
        this.game.saveGameData();
        this.updateInventoryGrid();
        this.updateEquipmentDisplay();
        this.game.updateDisplay();
        this.game.updateSwordDisplay();
        this.game.soundSystem.playSound('equip');
        this.game.showNotification(`${equipment.name}을(를) 장착했습니다!`, 'success');
    }

    // 아이템 사용
    useItem(itemId) {
        // 아이템 확인
        let item = null;
        let itemType = '';

        // 특수 아이템 확인
        if (ITEMS.special[itemId]) {
            item = ITEMS.special[itemId];
            itemType = 'special';
        }
        // 소모품 확인
        else if (ITEMS.consumables && ITEMS.consumables[itemId]) {
            item = ITEMS.consumables[itemId];
            itemType = 'consumable';
        }
        // 방지권 확인
        else if (ITEMS.protections && ITEMS.protections[itemId]) {
            item = ITEMS.protections[itemId];
            itemType = 'protection';
        }

        if (!item) {
            this.game.showNotification('사용할 수 없는 아이템입니다.', 'error');
            return;
        }

        // 아이템이 있는지 확인
        if (!this.game.gameData.inventory[itemId] || this.game.gameData.inventory[itemId] <= 0) {
            this.game.showNotification('아이템이 부족합니다.', 'error');
            return;
        }

        // 효과 적용
        if (item.effect) {
            switch (item.effect.type) {
                case 'successRate':
                    this.game.gameData.stats.permanentSuccessRateBonus = (this.game.gameData.stats.permanentSuccessRateBonus || 0) + item.effect.value;
                    this.game.showNotification(`강화 성공률이 ${item.effect.value}% 증가했습니다!`, 'success');
                    break;
                case 'autoClick':
                    this.game.gameData.stats.autoClickCount = (this.game.gameData.stats.autoClickCount || 0) + item.effect.value;
                    this.game.showNotification(`자동 클릭이 ${item.effect.value}회 추가되었습니다!`, 'success');
                    this.game.restartAutoSystems();
                    break;
                case 'materialDropRate':
                    this.game.gameData.stats.materialDropRateBonus = (this.game.gameData.stats.materialDropRateBonus || 0) + item.effect.value;
                    this.game.showNotification(`재료 드롭률이 ${item.effect.value}% 증가했습니다!`, 'success');
                    break;
                case 'sellMultiplier':
                    this.game.gameData.stats.sellMultiplierBonus = (this.game.gameData.stats.sellMultiplierBonus || 0) + item.effect.value;
                    this.game.showNotification(`판매 가격이 ${item.effect.value}% 증가했습니다!`, 'success');
                    break;
                case 'protection':
                    // 현재 레벨에 맞는 방지권 추가
                    const level = this.game.gameData.swordLevel;
                    let protectionType = '';
                    
                    if (level <= 10) protectionType = 'broken_protection';
                    else if (level <= 15) protectionType = 'old_protection';
                    else if (level <= 20) protectionType = 'normal_protection';
                    else if (level <= 25) protectionType = 'high_protection';
                    else protectionType = 'ultimate_protection';
                    
                    if (!this.game.gameData.protectionItems[protectionType]) {
                        this.game.gameData.protectionItems[protectionType] = 0;
                    }
                    this.game.gameData.protectionItems[protectionType] += item.effect.value;
                    this.game.showNotification(`방지권 ${item.effect.value}장을 획득했습니다!`, 'success');
                    break;
                default:
                    this.game.showNotification(`${item.name}을(를) 사용했습니다!`, 'success');
            }
        } else {
            this.game.showNotification(`${item.name}을(를) 사용했습니다!`, 'success');
        }

        // 인벤토리에서 제거
        this.game.gameData.inventory[itemId]--;
        if (this.game.gameData.inventory[itemId] <= 0) {
            delete this.game.gameData.inventory[itemId];
        }

        this.game.saveGameData();
        this.updateInventoryGrid();
        this.game.updateDisplay();
        this.game.updateSwordDisplay();
    }

    // 랜덤 장비 지급
    giveRandomEquipment() {
        // 랜덤 장비 선택 (희귀도별 가중치)
        const availableEquipment = EQUIPMENT.filter(item => item.obtainable.includes('random_box'));
        if (availableEquipment.length === 0) {
            this.game.showNotification('사용 가능한 장비가 없습니다.', 'error');
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
        if (!this.game.gameData.inventory[selectedEquipment.id]) {
            this.game.gameData.inventory[selectedEquipment.id] = 0;
        }
        this.game.gameData.inventory[selectedEquipment.id]++;

        // 희귀도에 따른 알림 색상
        const notificationType = selectedEquipment.rarity === 'epic' || selectedEquipment.rarity === 'legendary' ? 'warning' : 'success';
        this.updateInventoryGrid();
        this.game.showNotification(`${selectedEquipment.name}을(를) 얻었습니다! [${this.getRarityInKorean(selectedEquipment.rarity)}]`, notificationType);
    }

    // 장비 슬롯 클릭 처리
    handleEquipmentSlotClick(slotId) {
        // 장착된 아이템이 있든 없든 장비 선택 모달 표시
        this.showEquipmentSelectionModal(slotId);
    }

    // 장비 선택 모달 표시
    showEquipmentSelectionModal(slotId) {
        const slotName = EQUIPMENT_SLOTS[slotId];
        const modal = document.getElementById('equipment-selection-modal');
        const title = document.getElementById('equipment-selection-title');
        const list = document.getElementById('equipment-selection-list');
        const equippedItem = this.game.gameData.equipment[slotId];
        
        // 모달 제목 설정
        title.textContent = `${slotName} 장비 선택`;
        
        // 장비 리스트 초기화
        list.innerHTML = '';
        
        // 해당 슬롯 타입의 장비만 필터링 (인벤토리 + 장착된 장비)
        const allEquipment = new Map();
        
        // 인벤토리의 장비 추가
        Object.entries(this.game.gameData.inventory).forEach(([itemId, count]) => {
            if (count > 0) {
                const equipment = EQUIPMENT.find(item => item.id === itemId);
                if (equipment && equipment.slot === slotId) {
                    allEquipment.set(itemId, { equipment, count, isEquipped: false });
                }
            }
        });
        
        // 현재 장착된 장비 추가 (해당 슬롯의)
        if (equippedItem && equippedItem.slot === slotId) {
            allEquipment.set(equippedItem.id, { 
                equipment: equippedItem, 
                count: 1, // 장착 중이므로 1개로 표시
                isEquipped: true 
            });
        }
        
        const availableEquipment = Array.from(allEquipment.values());
        
        if (availableEquipment.length === 0) {
            list.innerHTML = '<div class="no-equipment">장착할 수 있는 장비가 없습니다.</div>';
        } else {
            availableEquipment.forEach(({ equipment, count, isEquipped }) => {
                // 장비 타입에 따른 이모지 결정
                let itemImage = '⚔️';
                switch(equipment.slot) {
                    case 'head': itemImage = '👑'; break;
                    case 'necklace': itemImage = '📿'; break;
                    case 'bracelet': itemImage = '💍'; break;
                    case 'ring': itemImage = '💍'; break;
                }
                
                const itemElement = document.createElement('div');
                itemElement.className = `equipment-selection-item ${isEquipped ? 'equipped' : ''}`;
                itemElement.innerHTML = `
                    <div class="equipment-selection-image">${itemImage}</div>
                    <div class="equipment-selection-info">
                        <div class="equipment-selection-name">${equipment.name}</div>
                        <div class="equipment-selection-rarity rarity-${equipment.rarity.toLowerCase()}">${this.getRarityInKorean(equipment.rarity)}</div>
                        <div class="equipment-selection-effect">${this.getEquipmentDescription(equipment)}</div>
                        <div class="equipment-selection-count">${isEquipped ? '장착 중' : `보유: x${count}`}</div>
                    </div>
                `;
                
                // 클릭 이벤트
                itemElement.addEventListener('click', () => {
                    if (isEquipped) {
                        // 장착된 장비 클릭 - 해제
                        if (!this.game.gameData.inventory[equippedItem.id]) {
                            this.game.gameData.inventory[equippedItem.id] = 0;
                        }
                        this.game.gameData.inventory[equippedItem.id]++;
                        
                        delete this.game.gameData.equipment[slotId];
                        this.game.saveGameData();
                        this.updateInventoryGrid();
                        this.updateEquipmentDisplay();
                        this.game.updateDisplay();
                        this.game.updateSwordDisplay();
                        this.game.showNotification(`${equippedItem.name}을(를) 해제했습니다.`, 'success');
                        modal.classList.add('hidden');
                        this.game.showModal('equipment-modal');
                    } else {
                        // 다른 장비 클릭 - 교체
                        this.equipItemToSlot(equipment, slotId);
                        modal.classList.add('hidden');
                        this.game.showModal('equipment-modal');
                    }
                });
                
                list.appendChild(itemElement);
            });
        }
        
        // 모달 표시
        this.game.showModal('equipment-selection-modal');
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventorySystem };
}