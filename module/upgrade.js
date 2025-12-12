// 강화 시스템 모듈
class UpgradeSystem {
    constructor(game) {
        this.game = game;
    }

    // 강화 시도
    attemptUpgrade() {
        const currentWeapon = WEAPONS[this.game.gameData.swordLevel];
        if (!currentWeapon) {
            // 유효하지 않은 레벨인 경우 최소 레벨로 리셋
            this.game.gameData.swordLevel = 0;
            this.game.updateSwordDisplay();
            this.game.showNotification('검 데이터 오류가 발생했습니다. 초기화되었습니다.', 'error');
            return;
        }
        
        // 최대 레벨 체크
        const nextWeapon = WEAPONS[this.game.gameData.swordLevel + 1];
        if (!nextWeapon) {
            this.game.showNotification('이미 최대 레벨입니다!', 'warning');
            return;
        }

        const cost = currentWeapon.upgradeCost;
        if (this.game.gameData.gold < cost) {
            this.game.showNotification('골드가 부족합니다!', 'error');
            return;
        }

        // 강화 진행 바 시작
        this.startUpgradeProgress(() => {
            this.game.gameData.gold -= cost;
            this.game.gameData.stats.totalUpgrades++;

            const successRate = this.calculateSuccessRate();
            const isSuccess = Math.random() * 100 < successRate;

            // 성공/실패 결과 저장
            this.lastUpgradeResult = {
                success: isSuccess,
                previousLevel: this.game.gameData.swordLevel
            };

            if (isSuccess) {
                this.upgradeSuccess();
            } else {
                this.upgradeFailure();
            }

            this.game.updateDisplay();
            this.game.saveGameData();
        });
    }

    // 강화 진행 바 시작
    startUpgradeProgress(callback) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const upgradeBtn = document.getElementById('upgrade-btn');
        const sellBtn = document.getElementById('sell-btn');
        
        if (!progressFill || !progressText) return;

        // 버튼 비활성화
        if (upgradeBtn) upgradeBtn.disabled = true;
        if (sellBtn) sellBtn.disabled = true;

        // 진행 바 초기화
        progressFill.style.width = '0%';
        progressFill.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
        progressText.textContent = '강화 중...';
        progressText.style.color = '#3498db';

        // 강화 시작 사운드
        this.game.soundSystem.playSound('upgradeStart');

        // 애니메이션 시작
        let progress = 0;
        const duration = 1500; // 1.5초
        const intervalTime = 20;
        const increment = (100 / duration) * intervalTime;

        const interval = setInterval(() => {
            progress += increment;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 강화 실행
                progressFill.style.width = '100%';
                
                // 짧은 딜레이 후 결과 표시
                setTimeout(() => {
                    callback();
                    
                    // 결과에 따라 색상 변경
                    setTimeout(() => {
                        this.showUpgradeResult();
                    }, 100);
                    
                    // 버튼 다시 활성화
                    if (upgradeBtn) upgradeBtn.disabled = false;
                    if (sellBtn) sellBtn.disabled = false;
                }, 200);
            } else {
                progressFill.style.width = progress + '%';
            }
        }, intervalTime);
    }

    // 강화 결과 표시
    showUpgradeResult() {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const currentWeapon = WEAPONS[this.game.gameData.swordLevel];
        
        if (!progressFill || !progressText || !currentWeapon) return;

        // 마지막 강화 결과 확인
        if (this.lastUpgradeResult && this.lastUpgradeResult.success) {
            // 강화 성공
            progressFill.style.background = 'linear-gradient(90deg, #27ae60, #229954)';
            progressText.textContent = `강화 성공! ${currentWeapon.name} +${this.game.gameData.swordLevel}`;
            progressText.style.color = '#27ae60';
        } else {
            // 강화 실패
            progressFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
            progressText.textContent = `강화 실패... ${currentWeapon.name} +${this.game.gameData.swordLevel}`;
            progressText.style.color = '#e74c3c';
        }

        // 2초 후 초기화
        setTimeout(() => {
            progressFill.style.width = '0%';
            progressFill.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
            progressText.textContent = '준비 중...';
            progressText.style.color = '#7f8c8d';
        }, 2000);
    }

    // 성공률 계산
    calculateSuccessRate() {
        let baseRate = WEAPONS[this.game.gameData.swordLevel].successRate;

        // 장비 효과 적용
        Object.values(this.game.gameData.equipment).forEach(equipment => {
            if (equipment && equipment.effect === 'successRate') {
                baseRate += equipment.value;
            }
        });

        // 특수 아이템 효과 적용
        if (this.game.gameData.equipment.golden_hammer) {
            baseRate += this.game.gameData.equipment.golden_hammer.value;
        }
        // 인벤토리에 있는 황금 망치 효과
        if (this.game.gameData.inventory['golden_hammer'] && this.game.gameData.inventory['golden_hammer'] > 0) {
            baseRate += 5; // 황금 망치 효과
        }

        // 행운의 부적 효과
        if (this.game.gameData.equipment.luck_charm) {
            baseRate += this.game.gameData.equipment.luck_charm.value;
        }
        // 인벤토리에 있는 행운의 부적 효과 (최대 3개)
        if (this.game.gameData.inventory['luck_charm']) {
            const charmCount = Math.min(this.game.gameData.inventory['luck_charm'], 3);
            baseRate += charmCount * 3; // 부적당 3%
        }

        // 영구 성공률 보너스 (특수 아이템 사용 효과)
        if (this.game.gameData.stats.permanentSuccessRateBonus) {
            baseRate += this.game.gameData.stats.permanentSuccessRateBonus;
        }

        // 활성 칭호 효과
        const activeTitleId = this.game.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.game.gameData.titles[activeTitleId];
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
        const level = this.game.gameData.swordLevel;
        const failures = this.game.gameData.ceilingSystem.failureCount;

        let requiredFailures = 0;
        if (level >= 10 && level <= 14) requiredFailures = 5;
        else if (level >= 15 && level <= 19) requiredFailures = 7;
        else if (level >= 20 && level <= 24) requiredFailures = 10;
        else if (level >= 25 && level <= 30) requiredFailures = 15;

        return failures >= requiredFailures && requiredFailures > 0;
    }

    // 강화 성공
    upgradeSuccess() {
        const currentLevel = this.game.gameData.swordLevel;
        const successRate = this.calculateSuccessRate();
        const isCritical = Math.random() * 100 < 5; // 5% 크리티컬 확률

        // 30% 이하 성공률에서 성공 시 업적 추적
        if (successRate <= 30 && !this.checkCeilingBonus()) {
            this.game.gameData.stats.successAt30Percent = true;
        }

        if (isCritical) {
            // 크리티컬 강화: 최대 레벨까지만 상승
            const maxLevel = WEAPONS[WEAPONS.length - 1].level;
            const newLevel = Math.min(currentLevel + 2, maxLevel);
            this.game.gameData.swordLevel = newLevel;
            this.game.gameData.stats.criticalUpgrades++;
            this.game.soundSystem.playSound('critical');
            this.game.showNotification(`크리티컬 강화 성공! +${newLevel - currentLevel} 상승!`, 'warning');
            this.game.createCriticalEffect();
        } else {
            this.game.gameData.swordLevel += 1;
            this.game.soundSystem.playSound('upgradeSuccess');
            this.game.showNotification('강화 성공!', 'success');
        }

        this.game.gameData.stats.successfulUpgrades++;
        this.game.gameData.stats.consecutiveSuccess++;
        this.game.gameData.stats.consecutiveFailures = 0;

        if (this.game.gameData.stats.consecutiveSuccess > this.game.gameData.stats.maxConsecutiveSuccess) {
            this.game.gameData.stats.maxConsecutiveSuccess = this.game.gameData.stats.consecutiveSuccess;
        }

        // +20 달성 시 방지권 사용 여부 추적
        if (this.game.gameData.swordLevel === 20 && currentLevel === 19) {
            if (!this.game.gameData.stats.usedProtectionTo20) {
                this.game.gameData.stats.reached20WithoutProtection = true;
            }
        }

        // 천장 카운트 리셋
        this.game.gameData.ceilingSystem.failureCount = 0;

        // 재료 드롭
        this.dropMaterials();

        this.game.updateSwordDisplay();
        this.game.checkAchievements();
    }

    // 강화 실패
    upgradeFailure() {
        this.game.gameData.stats.failedUpgrades++;
        this.game.gameData.stats.consecutiveFailures++;
        this.game.gameData.stats.consecutiveSuccess = 0;

        if (this.game.gameData.stats.consecutiveFailures > this.game.gameData.stats.maxConsecutiveFailures) {
            this.game.gameData.stats.maxConsecutiveFailures = this.game.gameData.stats.consecutiveFailures;
        }

        // 천장 카운트 증가
        this.game.gameData.ceilingSystem.failureCount++;

        // 방지권 사용 여부
        const hasProtection = this.checkProtectionItem();
        let penalty = 0;

        if (hasProtection) {
            this.game.soundSystem.playSound('notification');
            this.game.showNotification('방지권으로 보호되었습니다!', 'success');
        } else {
            this.game.soundSystem.playSound('upgradeFail');
            const level = this.game.gameData.swordLevel;
            if (level >= 20) penalty = 2;
            else if (level >= 10) penalty = 1;
            else if (level >= 10) penalty = 1;

            this.game.gameData.swordLevel = Math.max(0, this.game.gameData.swordLevel - penalty);
            this.game.showNotification(`강화 실패... ${penalty > 0 ? `-${penalty} 하락` : ''}`, 'error');
        }

        this.game.updateSwordDisplay();
        this.game.inventorySystem.updateInventoryGrid();
        this.game.checkAchievements();
    }

    // 방지권 체크
    checkProtectionItem() {
        const level = this.game.gameData.swordLevel;
        let protectionType = '';

        if (level <= 10) protectionType = 'broken_protection';
        else if (level <= 15) protectionType = 'old_protection';
        else if (level <= 20) protectionType = 'normal_protection';
        else if (level <= 25) protectionType = 'high_protection';
        else protectionType = 'ultimate_protection';

        if (this.game.gameData.protectionItems[protectionType] && this.game.gameData.protectionItems[protectionType] > 0) {
            this.game.gameData.protectionItems[protectionType]--;
            
            // +20 도달을 위한 방지권 사용 추적
            if (level >= 10 && level < 20) {
                this.game.gameData.stats.usedProtectionTo20 = true;
            }
            
            return true;
        }

        return false;
    }

    // 재료 드롭
    dropMaterials() {
        const level = this.game.gameData.swordLevel;

        // 각 재료별 드롭 확률 체크
        Object.entries(MATERIAL_DROPS).forEach(([materialId, material]) => {
            if (level >= material.minLevel) {
                // 기본 드롭률에 보너스 적용
                let dropRate = material.dropRate;
                if (this.game.gameData.stats.materialDropRateBonus) {
                    dropRate += this.game.gameData.stats.materialDropRateBonus;
                }
                
                if (Math.random() * 100 < dropRate) {
                    if (!this.game.gameData.inventory[materialId]) {
                        this.game.gameData.inventory[materialId] = 0;
                    }
                    this.game.gameData.inventory[materialId]++;
                    this.game.showNotification(`${material.name} 획득!`, 'success');
                }
            }
        });
    }

    // 검 판매
    sellSword() {
        const currentWeapon = WEAPONS[this.game.gameData.swordLevel];
        if (!currentWeapon) {
            // 유효하지 않은 레벨인 경우 최소 레벨로 리셋
            this.game.gameData.swordLevel = 0;
            this.game.updateSwordDisplay();
            this.game.showNotification('검 데이터 오류가 발생했습니다. 초기화되었습니다.', 'error');
            return;
        }

        let sellPrice = currentWeapon.sellPrice;
        
        // 판매 가격 배율 적용
        let multiplier = 1.0;
        if (this.game.gameData.stats.sellMultiplierBonus) {
            multiplier += this.game.gameData.stats.sellMultiplierBonus / 100;
        }
        
        // 대량 판매권 효과 (기존 방식 유지)
        if (this.game.gameData.inventory['bulk_sell_ticket'] && this.game.gameData.inventory['bulk_sell_ticket'] > 0) {
            multiplier *= 1.5; // 50% 증가
        }
        
        sellPrice *= multiplier;
        
        this.game.gameData.gold += sellPrice;
        this.game.gameData.stats.totalGoldEarned += sellPrice;
        this.game.gameData.swordLevel = 0;
        
        // 천장 시스템 초기화
        this.game.gameData.ceilingSystem.failureCount = 0;
        this.game.gameData.ceilingSystem.lastCeilingLevel = 0;

        this.game.showNotification(`검을 판매했습니다! ₩${Math.floor(sellPrice).toLocaleString()}`, 'success');
        this.game.updateSwordDisplay();
        this.game.updateDisplay();
        this.game.saveGameData();
    }

    // 판매 확인 모달 표시
    showSellConfirm() {
        const currentWeapon = WEAPONS[this.game.gameData.swordLevel];
        if (!currentWeapon) return;

        const sellPrice = currentWeapon.sellPrice;
        document.getElementById('sell-confirm-text').innerHTML = `
            현재 검을 판매하시겠습니까?<br>
            검 이름: ${currentWeapon.name}<br>
            판매 가격: ₩${sellPrice.toLocaleString()}
        `;

        this.game.showModal('sell-confirm-modal');
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UpgradeSystem };
}