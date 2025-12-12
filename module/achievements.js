// 업적 시스템 모듈
class AchievementSystem {
    constructor(game) {
        this.game = game;
    }

    // 업적 표시 업데이트
    updateAchievementsDisplay() {
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = '';

        ACHIEVEMENTS.forEach(achievement => {
            const isCompleted = this.game.gameData.achievements[achievement.id];
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
                    currentValue = this.game.gameData.swordLevel;
                    progressText = `현재 레벨: +${currentValue}`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_gold':
                    conditionText = `누적 ₩${achievement.condition.value.toLocaleString()} 획득`;
                    progressText = `현재 누적: ₩${currentValue.toLocaleString()}`;
                    currentValue = this.game.gameData.stats.totalGoldEarned;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_clicks':
                    currentValue = this.game.gameData.stats.totalClicks;
                    conditionText = `총 ${achievement.condition.value.toLocaleString()}회 클릭`;
                    progressText = `현재 클릭: ${currentValue.toLocaleString()}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'consecutive_success':
                    currentValue = this.game.gameData.stats.maxConsecutiveSuccess;
                    conditionText = `${achievement.condition.value}연속 성공`;
                    progressText = `최대 연속: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'consecutive_failures':
                    currentValue = this.game.gameData.stats.maxConsecutiveFailures;
                    conditionText = `${achievement.condition.value}연속 실패`;
                    progressText = `최대 연속: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'critical_upgrades':
                    currentValue = this.game.gameData.stats.criticalUpgrades;
                    conditionText = `크리티컬 ${achievement.condition.value}회`;
                    progressText = `현재: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'unique_materials':
                    currentValue = Object.keys(this.game.gameData.inventory).filter(key => 
                        MATERIAL_DROPS[key] && this.game.gameData.inventory[key] > 0
                    ).length;
                    conditionText = `${achievement.condition.value}종 재료 수집`;
                    progressText = `현재: ${currentValue}종`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'total_upgrades':
                    currentValue = this.game.gameData.stats.totalUpgrades;
                    conditionText = `총 ${achievement.condition.value.toLocaleString()}회 강화`;
                    progressText = `현재: ${currentValue.toLocaleString()}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'unique_equipment':
                    currentValue = Object.keys(this.game.gameData.equipment).filter(key => 
                        EQUIPMENT_SLOTS[key] && this.game.gameData.equipment[key]
                    ).length;
                    conditionText = `${achievement.condition.value}종 장비 수집`;
                    progressText = `현재: ${currentValue}종`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'forge_recipes':
                    currentValue = this.game.gameData.stats.totalForges || 0;
                    conditionText = `${achievement.condition.value}회 조합`;
                    progressText = `현재: ${currentValue}회`;
                    progressPercent = Math.min((currentValue / achievement.condition.value) * 100, 100);
                    break;
                case 'weapon_level_20_without_protection':
                    currentValue = this.game.gameData.stats.reached20WithoutProtection ? 1 : 0;
                    conditionText = '+20 무방지권 달성';
                    progressText = currentValue ? '완료' : '미완료';
                    progressPercent = currentValue * 100;
                    break;
                case 'success_at_30_percent':
                    currentValue = this.game.gameData.stats.successAt30Percent ? 1 : 0;
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
            if (!this.game.gameData.achievements[achievement.id]) {
                let completed = false;

                switch (achievement.condition.type) {
                    case 'weapon_level':
                        completed = this.game.gameData.swordLevel >= achievement.condition.value;
                        break;
                    case 'total_gold':
                        completed = this.game.gameData.stats.totalGoldEarned >= achievement.condition.value;
                        break;
                    case 'total_clicks':
                        completed = this.game.gameData.stats.totalClicks >= achievement.condition.value;
                        break;
                    case 'consecutive_success':
                        completed = this.game.gameData.stats.consecutiveSuccess >= achievement.condition.value;
                        break;
                    case 'consecutive_failures':
                        completed = this.game.gameData.stats.consecutiveFailures >= achievement.condition.value;
                        break;
                    case 'critical_upgrades':
                        completed = this.game.gameData.stats.criticalUpgrades >= achievement.condition.value;
                        break;
                    case 'unique_materials':
                        const uniqueMaterialCount = Object.keys(this.game.gameData.inventory).filter(key => 
                            MATERIAL_DROPS[key] && this.game.gameData.inventory[key] > 0
                        ).length;
                        completed = uniqueMaterialCount >= achievement.condition.value;
                        break;
                    case 'weapon_level_20_without_protection':
                        // 이 업적은 특별한 추적이 필요하므로 별도 처리
                        completed = this.game.gameData.stats.reached20WithoutProtection || false;
                        break;
                    case 'total_upgrades':
                        completed = this.game.gameData.stats.totalUpgrades >= achievement.condition.value;
                        break;
                    case 'success_at_30_percent':
                        // 이 업적은 특별한 추적이 필요하므로 별도 처리
                        completed = this.game.gameData.stats.successAt30Percent || false;
                        break;
                    case 'unique_equipment':
                        const uniqueEquipmentCount = Object.keys(this.game.gameData.equipment).filter(key => 
                            EQUIPMENT_SLOTS[key] && this.game.gameData.equipment[key]
                        ).length;
                        completed = uniqueEquipmentCount >= achievement.condition.value;
                        break;
                    case 'forge_recipes':
                        completed = (this.game.gameData.stats.totalForges || 0) >= achievement.condition.value;
                        break;
                }

                if (completed) {
                    this.game.gameData.achievements[achievement.id] = true;
                    this.game.soundSystem.playSound('achievement');
                    this.grantAchievementReward(achievement);
                    this.game.showNotification(`업적 달성: ${achievement.name}!`, 'success');
                }
            }
        });

        this.updateAchievementsDisplay();
    }

    // 업적 보상 지급
    grantAchievementReward(achievement) {
        if (achievement.reward.gold) {
            this.game.gameData.gold += achievement.reward.gold;
            this.game.gameData.stats.totalGoldEarned += achievement.reward.gold;
            this.game.showNotification(`골드 +₩${achievement.reward.gold.toLocaleString()}`, 'success');
        }

        if (achievement.reward.item) {
            // 인벤토리에 아이템 추가
            if (!this.game.gameData.inventory[achievement.reward.item]) {
                this.game.gameData.inventory[achievement.reward.item] = 0;
            }
            const count = achievement.reward.count || 1;
            this.game.gameData.inventory[achievement.reward.item] += count;
            this.game.showNotification(`${GameUtils.getItemName(achievement.reward.item)} x${count} 획득!`, 'success');
        }

        if (achievement.reward.equipment) {
            // 장비를 인벤토리에 추가
            if (!this.game.gameData.inventory[achievement.reward.equipment]) {
                this.game.gameData.inventory[achievement.reward.equipment] = 0;
            }
            this.game.gameData.inventory[achievement.reward.equipment]++;
            const equipment = EQUIPMENT.find(e => e.id === achievement.reward.equipment);
            if (equipment) {
                this.game.showNotification(`${equipment.name} 획득!`, 'success');
            }
        }

        if (achievement.reward.title) {
            this.game.gameData.titles[achievement.reward.title] = TITLES.find(t => t.id === achievement.reward.title);
            const title = TITLES.find(t => t.id === achievement.reward.title);
            if (title) {
                this.game.showNotification(`칭호 획득: ${title.name}`, 'warning');
            }
        }

        this.game.updateInventoryDisplay();
        this.game.updateDisplay();
        this.game.saveGameData();
    }

    // 업적 상세 표시
    showAchievementDetail(achievementId) {
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return;

        const isCompleted = this.game.gameData.achievements[achievementId]?.completed || false;
        const progress = this.game.gameData.achievements[achievementId]?.progress || 0;

        // 업적 모달 숨기기
        this.game.hideModal('achievements-modal');

        // 제목 설정
        document.getElementById('achievement-detail-title').textContent = achievement.name;

        // 조건 텍스트 생성
        let conditionText = '';
        let rewardText = '';
        let currentValue = 0;

        switch (achievement.condition.type) {
            case 'weapon_level':
                conditionText = `검 +${achievement.condition.value} 달성`;
                currentValue = this.game.gameData.swordLevel;
                break;
            case 'total_gold':
                conditionText = `누적 ₩${achievement.condition.value.toLocaleString()} 획득`;
                currentValue = this.game.gameData.stats.totalGoldEarned;
                break;
            case 'total_clicks':
                conditionText = `총 ${achievement.condition.value.toLocaleString()}회 클릭`;
                currentValue = this.game.gameData.stats.totalClicks;
                break;
            case 'consecutive_success':
                conditionText = `${achievement.condition.value}연속 성공`;
                currentValue = this.game.gameData.stats.maxConsecutiveSuccess;
                break;
            case 'consecutive_failures':
                conditionText = `${achievement.condition.value}연속 실패`;
                currentValue = this.game.gameData.stats.maxConsecutiveFailures;
                break;
            case 'critical_upgrades':
                conditionText = `크리티컬 ${achievement.condition.value}회`;
                currentValue = this.game.gameData.stats.criticalUpgrades;
                break;
            case 'unique_materials':
                conditionText = `${achievement.condition.value}종 재료 수집`;
                currentValue = Object.keys(this.game.gameData.inventory).filter(key => 
                    MATERIAL_DROPS[key] && this.game.gameData.inventory[key] > 0
                ).length;
                break;
            case 'total_upgrades':
                conditionText = `총 ${achievement.condition.value.toLocaleString()}회 강화`;
                currentValue = this.game.gameData.stats.totalUpgrades;
                break;
            case 'unique_equipment':
                conditionText = `${achievement.condition.value}종 장비 수집`;
                currentValue = Object.keys(this.game.gameData.equipment).filter(key => 
                    EQUIPMENT_SLOTS[key] && this.game.gameData.equipment[key]
                ).length;
                break;
            case 'forge_recipes':
                conditionText = `${achievement.condition.value}회 조합`;
                currentValue = this.game.gameData.stats.totalForges || 0;
                break;
            case 'weapon_level_20_without_protection':
                conditionText = '+20 무방지권 달성';
                currentValue = this.game.gameData.stats.reached20WithoutProtection ? achievement.condition.value : 0;
                break;
            case 'success_at_30_percent':
                conditionText = '30% 이하 성공률 달성';
                currentValue = this.game.gameData.stats.successAt30Percent ? achievement.condition.value : 0;
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
                const itemName = GameUtils.getItemName(achievement.reward.item);
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
        this.game.showModal('achievement-detail-modal');
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AchievementSystem };
}