// 검 강화하기 - 공통 유틸리티 함수들
class GameUtils {
    // 아이템 ID로 이름 가져오기
    static getItemName(itemId) {
        // EQUIPMENT에서 찾기
        const equipment = EQUIPMENT.find(item => item.id === itemId);
        if (equipment) return equipment.name;

        // items.js에서 찾기
        if (ITEMS.special[itemId]) return ITEMS.special[itemId].name;
        if (ITEMS.materials[itemId]) return ITEMS.materials[itemId].name;
        if (ITEMS.protections[itemId]) return ITEMS.protections[itemId].name;

        return itemId;
    }

    // 장비 설명 텍스트 생성
    static getEquipmentDescription(equipment) {
        let effectText = '';
        switch (equipment.effect) {
            case 'clickGoldMultiplier':
                effectText = `클릭 골드 +${equipment.value}%`;
                break;
            case 'successRate':
                effectText = `성공률 +${equipment.value}%`;
                break;
            case 'criticalChance':
                effectText = `크리티컬 확률 +${equipment.value}%`;
                break;
            case 'autoClickSpeed':
                effectText = `자동 클릭 속도 +${equipment.value}%`;
                break;
            case 'goldMultiplier':
                effectText = `골드 획득량 +${equipment.value}%`;
                break;
            case 'clickDamage':
                effectText = `클릭 데미지 +${equipment.value}`;
                break;
            case 'criticalDamage':
                effectText = `크리티컬 데미지 +${equipment.value}%`;
                break;
            case 'allStats':
                effectText = `모든 능력치 +${equipment.value}%`;
                break;
            case 'specialEffectChance':
                effectText = `특수 효과 확률 +${equipment.value}%`;
                break;
            case 'autoGold':
                effectText = `자동 골드 +${equipment.value}`;
                break;
            default:
                effectText = equipment.effect;
        }
        return `${equipment.name} (${effectText})`;
    }

    // 칭호 희귀도별 색상 반환
    static getTitleRarityColor(rarity) {
        const TITLE_RARITIES = {
            common: '#95a5a6',
            uncommon: '#27ae60',
            rare: '#3498db',
            epic: '#9b59b6',
            legendary: '#e74c3c'
        };
        return TITLE_RARITIES[rarity] || '#95a5a6';
    }

    // 숫자 포맷팅 (천 단위 콤마)
    static formatNumber(num) {
        return num.toLocaleString();
    }

    // 골드 표시 포맷팅
    static formatGold(amount) {
        return `₩${this.formatNumber(amount)}`;
    }

    // 확률 계산 헬퍼
    static calculateProbability(successRate) {
        return Math.random() * 100 < successRate;
    }

    // 배열에서 랜덤 요소 선택
    static getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // 객체 깊은 복사
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    // 로컬 스토리지 안전 저장
    static safeLocalStorageSet(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('LocalStorage 저장 실패:', e);
            return false;
        }
    }

    // 로컬 스토리지 안전 로드
    static safeLocalStorageGet(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error('LocalStorage 로드 실패:', e);
            return defaultValue;
        }
    }

    // DOM 요소 안전 선택
    static safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (e) {
            console.error('DOM 선택 실패:', selector, e);
            return null;
        }
    }

    // 이벤트 리스너 안전 추가
    static safeAddEventListener(element, event, handler) {
        if (element && typeof handler === 'function') {
            element.addEventListener(event, handler);
        }
    }
}