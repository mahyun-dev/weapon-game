// 업적 데이터
const ACHIEVEMENTS = [
    {
        id: "first_upgrade",
        name: "첫 강화",
        condition: {
            type: "weapon_level",
            value: 1
        },
        reward: {
            gold: 10000
        },
        hidden: false
    },
    {
        id: "novice_enhancer",
        name: "초보 강화사",
        condition: {
            type: "weapon_level",
            value: 5
        },
        reward: {
            gold: 100000
        },
        hidden: false
    },
    {
        id: "skilled_enhancer",
        name: "숙련 강화사",
        condition: {
            type: "weapon_level",
            value: 10
        },
        reward: {
            gold: 1000000
        },
        hidden: false
    },
    {
        id: "professional_enhancer",
        name: "전문 강화사",
        condition: {
            type: "weapon_level",
            value: 15
        },
        reward: {
            gold: 5000000
        },
        hidden: false
    },
    {
        id: "master_enhancer",
        name: "마스터 강화사",
        condition: {
            type: "weapon_level",
            value: 20
        },
        reward: {
            gold: 25000000
        },
        hidden: false
    },
    {
        id: "legendary_enhancer",
        name: "전설의 강화사",
        condition: {
            type: "weapon_level",
            value: 25
        },
        reward: {
            gold: 100000000
        },
        hidden: false
    },
    {
        id: "god_enhancer",
        name: "신의 강화사",
        condition: {
            type: "weapon_level",
            value: 30
        },
        reward: {
            gold: 500000000,
            title: "god_of_enhancement"
        },
        hidden: false
    },
    {
        id: "billionaire",
        name: "억만장자",
        condition: {
            type: "total_gold",
            value: 1000000000
        },
        reward: {
            item: "golden_hammer"
        },
        hidden: false
    },
    {
        id: "click_master",
        name: "클릭 마스터",
        condition: {
            type: "total_clicks",
            value: 100000
        },
        reward: {
            item: "auto_clicker"
        },
        hidden: false
    },
    {
        id: "fate_challenger",
        name: "운명의 도전자",
        condition: {
            type: "consecutive_success",
            value: 10
        },
        reward: {
            item: "luck_charm"
        },
        hidden: false
    },
    {
        id: "unyielding_spirit",
        name: "불굴의 의지",
        condition: {
            type: "consecutive_failures",
            value: 20
        },
        reward: {
            gold: 50000000,
            item: "normal_protection",
            count: 5
        },
        hidden: true
    },
    {
        id: "critical_master",
        name: "크리티컬 마스터",
        condition: {
            type: "critical_upgrades",
            value: 10
        },
        reward: {
            equipment: "luck_necklace"
        },
        hidden: false
    },
    {
        id: "material_collector",
        name: "재료 수집가",
        condition: {
            type: "unique_materials",
            value: 7
        },
        reward: {
            item: "material_detector"
        },
        hidden: false
    },
    {
        id: "perfectionist",
        name: "완벽주의자",
        condition: {
            type: "weapon_level_20_without_protection",
            value: 1
        },
        reward: {
            gold: 100000000
        },
        hidden: true
    },
    {
        id: "gambler_king",
        name: "도박왕",
        condition: {
            type: "total_upgrades",
            value: 1000
        },
        reward: {
            item: "warp_x10"
        },
        hidden: false
    },
    {
        id: "lucky_one",
        name: "행운아",
        condition: {
            type: "success_at_30_percent",
            value: 1
        },
        reward: {
            item: "luck_charm"
        },
        hidden: true
    },
    {
        id: "collector",
        name: "수집광",
        condition: {
            type: "unique_equipment",
            value: 10
        },
        reward: {
            item: "legendary_box"
        },
        hidden: false
    },
    {
        id: "blacksmith",
        name: "대장장이",
        condition: {
            type: "forge_recipes",
            value: 100
        },
        reward: {
            item: "bulk_sell_ticket"
        },
        hidden: false
    }
];