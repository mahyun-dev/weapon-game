// 칭호 시스템 모듈
class TitleSystem {
    constructor(game) {
        this.game = game;
    }

    // 칭호 표시 업데이트
    updateTitleDisplay() {
        const activeTitleId = this.game.gameData.activeTitle || 'beginner_adventurer';
        const activeTitle = this.game.gameData.titles[activeTitleId] || TITLES.find(t => t.id === 'beginner_adventurer');
        
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
            const isOwned = this.game.gameData.titles[title.id];
            const isActive = this.game.gameData.activeTitle === title.id;
            
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
        if (this.game.gameData.titles[titleId]) {
            this.game.gameData.activeTitle = titleId;
            this.game.saveGameData();
            this.game.updateTitleDisplay();
            this.game.updateTitlesListDisplay();
            this.game.updateSwordDisplay(); // 칭호 효과를 즉시 반영하기 위해 검 정보 업데이트
            this.game.updateDisplay();
            
            const title = TITLES.find(t => t.id === titleId);
            this.game.showNotification(`${title.name} 칭호를 착용했습니다!`, 'success');
        }
    }
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TitleSystem };
}