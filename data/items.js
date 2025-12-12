// 아이템 데이터
var ITEMS = {
    // 특수 아이템 (상점/업적 보상)
    special: {
        golden_hammer: {
            id: 'golden_hammer',
            name: '황금 망치',
            description: '강화 성공률을 영구적으로 증가시킵니다',
            effect: {
                type: 'successRate',
                value: 5
            },
            rarity: 'epic'
        },
        luck_charm: {
            id: 'luck_charm',
            name: '행운의 부적',
            description: '강화 성공률을 증가시킵니다',
            effect: {
                type: 'successRate',
                value: 3
            },
            rarity: 'rare'
        },
        auto_clicker: {
            id: 'auto_clicker',
            name: '자동 클릭기',
            description: '초당 자동으로 클릭합니다',
            effect: {
                type: 'autoClick',
                value: 10
            },
            rarity: 'epic'
        },
        material_detector: {
            id: 'material_detector',
            name: '재료 탐지기',
            description: '재료 드롭률을 증가시킵니다',
            effect: {
                type: 'materialDropRate',
                value: 100
            },
            rarity: 'rare'
        },
        bulk_sell_ticket: {
            id: 'bulk_sell_ticket',
            name: '대량 판매권',
            description: '무기 판매 가격을 증가시킵니다',
            effect: {
                type: 'sellMultiplier',
                value: 20
            },
            rarity: 'uncommon'
        },
        time_distortion: {
            id: 'time_distortion',
            name: '시간 왜곡기',
            description: '자동 클릭 속도를 증가시킵니다',
            effect: {
                type: 'autoClickSpeed',
                value: 100
            },
            rarity: 'epic'
        },
        random_box: {
            id: 'random_box',
            name: '랜덤 장비 상자',
            description: '랜덤한 장비를 획득합니다',
            effect: {
                type: 'randomEquipment',
                value: 1
            },
            rarity: 'common'
        }
    },

    // 재료 아이템 (강화 성공 시 드롭)
    materials: {
        evil_soul: {
            id: 'evil_soul',
            name: '사악한 영혼',
            description: '+5 이상 강화 성공 시 드롭',
            dropRate: 5,
            minLevel: 5,
            rarity: 'uncommon'
        },
        axe_powder: {
            id: 'axe_powder',
            name: '도끼 가루',
            description: '+8 이상 강화 성공 시 드롭',
            dropRate: 3,
            minLevel: 8,
            rarity: 'uncommon'
        },
        transparent_material: {
            id: 'transparent_material',
            name: '투명 물질',
            description: '+10 이상 강화 성공 시 드롭',
            dropRate: 2,
            minLevel: 10,
            rarity: 'rare'
        },
        ancient_fragment: {
            id: 'ancient_fragment',
            name: '고대 파편',
            description: '+15 이상 강화 성공 시 드롭',
            dropRate: 1,
            minLevel: 15,
            rarity: 'rare'
        },
        mysterious_powder: {
            id: 'mysterious_powder',
            name: '신비한 가루',
            description: '+20 이상 강화 성공 시 드롭',
            dropRate: 0.5,
            minLevel: 20,
            rarity: 'epic'
        },
        legend_piece: {
            id: 'legend_piece',
            name: '전설 조각',
            description: '+25 이상 강화 성공 시 드롭',
            dropRate: 0.2,
            minLevel: 25,
            rarity: 'legendary'
        },
        luck_powder: {
            id: 'luck_powder',
            name: '행운의 가루',
            description: '모든 강화 시도 시 드롭 (일일 5개 무료)',
            dropRate: 10,
            minLevel: 0,
            rarity: 'common'
        },
        blessing_crystal: {
            id: 'blessing_crystal',
            name: '축복의 결정',
            description: '크리티컬 강화 성공 시 드롭',
            dropRate: 100,
            minLevel: 0,
            special: true,
            rarity: 'epic'
        }
    },

    // 방지권 (강화 실패 방지)
    protections: {
        broken_protection: {
            id: 'broken_protection',
            name: '깨진 방지권',
            description: '+10 이하 강화 실패 방지',
            maxLevel: 10,
            rarity: 'common'
        },
        old_protection: {
            id: 'old_protection',
            name: '낡은 방지권',
            description: '+15 이하 강화 실패 방지',
            maxLevel: 15,
            rarity: 'uncommon'
        },
        normal_protection: {
            id: 'normal_protection',
            name: '보통 방지권',
            description: '+20 이하 강화 실패 방지',
            maxLevel: 20,
            rarity: 'rare'
        },
        high_protection: {
            id: 'high_protection',
            name: '고급 방지권',
            description: '+25 이하 강화 실패 방지',
            maxLevel: 25,
            rarity: 'epic'
        },
        ultimate_protection: {
            id: 'ultimate_protection',
            name: '최상급 방지권',
            description: '+30 이하 강화 실패 방지',
            maxLevel: 30,
            rarity: 'legendary'
        }
    }
};

// 희귀도별 색상
const ITEM_RARITIES = {
    common: '#95a5a6',
    uncommon: '#27ae60',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#e67e22',
    mythical: '#e74c3c'
};

console.log('✅ ITEMS 데이터 로드됨');
