// 대장간 시스템 모듈
class ForgeSystem {
    constructor(game) {
        this.game = game;
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
        return GameUtils.getItemName(itemId);
    }

    // 대장간 조합 실행
    craftForgeRecipe(recipe) {
        // 재료 확인
        for (const material of recipe.materials) {
            const currentCount = this.game.gameData.inventory[material.item] || 0;
            if (currentCount < material.count) {
                this.game.showNotification(`${this.getItemName(material.item)}이(가) 부족합니다!`, 'error');
                return;
            }
        }

        // 재료 소비
        for (const material of recipe.materials) {
            this.game.gameData.inventory[material.item] -= material.count;
        }

        // 결과 아이템 추가
        if (!this.game.gameData.inventory[recipe.result.item]) {
            this.game.gameData.inventory[recipe.result.item] = 0;
        }
        this.game.gameData.inventory[recipe.result.item] += recipe.result.count;

        // 효과 적용 (필요시)
        if (recipe.effect) {
            this.applyForgeEffect(recipe);
        }

        // 조합 횟수 추적
        if (!this.game.gameData.stats.totalForges) {
            this.game.gameData.stats.totalForges = 0;
        }
        this.game.gameData.stats.totalForges++;

        // 저장 및 UI 업데이트
        this.game.saveGameData();
        this.game.updateInventoryDisplay();
        this.game.updateForgeDisplay();
        this.game.checkAchievements();

        this.game.showNotification(`${recipe.name} 조합이 완료되었습니다!`, 'success');
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
}

// 모듈 익스포트
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ForgeSystem };
}