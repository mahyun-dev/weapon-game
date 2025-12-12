// 상점 시스템 모듈
class ShopSystem {
    constructor(game) {
        this.game = game;
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

    // 상점 탭 전환
    switchShopTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        this.updateShopDisplay(tab);
    }

// 상점 아이템 구매
    buyShopItem(item) {
        if (this.game.gameData.gold < item.price) {
            this.game.showNotification('골드가 부족합니다!', 'error');
            return;
        }

        // 구매 제한 체크
        if (item.purchaseLimit) {
            const currentCount = this.game.gameData.inventory[item.id] || 0;
            if (currentCount >= item.purchaseLimit) {
                this.game.showNotification(`${item.name}은(는) 최대 ${item.purchaseLimit}개까지만 구매할 수 있습니다!`, 'error');
                return;
            }
        }

        this.game.gameData.gold -= item.price;
        this.game.soundSystem.playSound('purchase');

        // 아이템 효과 적용
        switch (item.effect) {
            case 'clickMultiplier':
                // 워프권은 장비로 장착
                this.game.gameData.equipment.warpTicket = item;
                this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'successRate':
                // 성공률 증가 장비는 인벤토리에 추가
                if (!this.game.gameData.inventory[item.id]) {
                    this.game.gameData.inventory[item.id] = 0;
                }
                this.game.gameData.inventory[item.id]++;
                this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'autoClick':
                this.game.gameData.equipment.autoClicker = item;
                this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                break;
            case 'randomEquipment':
                this.game.inventorySystem.giveRandomEquipment();
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
                        
                        if (!this.game.gameData.protectionItems[protectionType]) {
                            this.game.gameData.protectionItems[protectionType] = 0;
                        }
                        this.game.gameData.protectionItems[protectionType] += count;
                        
                        this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                    }
                } else if (item.id) {
                    // 기타 특수 아이템들은 인벤토리에 추가
                    if (!this.game.gameData.inventory[item.id]) {
                        this.game.gameData.inventory[item.id] = 0;
                    }
                    this.game.gameData.inventory[item.id]++;
                    this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                } else {
                    this.game.showNotification(`${item.name} 구매 완료!`, 'success');
                }
                break;
        }

        this.game.updateDisplay();
        this.game.updateInventoryDisplay();
        this.game.saveGameData();
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShopSystem };
}