// 칭호 데이터
const TITLES = [
    {
        id: "beginner_adventurer",
        name: "초보 모험가",
        condition: {
            type: "default"
        },
        effect: {
            type: "clickGoldMultiplier",
            value: 1
        },
        rarity: "common"
    },
    {
        id: "god_of_enhancement",
        name: "강화의 신",
        condition: {
            type: "weapon_level",
            value: 30
        },
        effect: {
            type: "successRate",
            value: 3
        },
        rarity: "legendary"
    },
    {
        id: "billionaire",
        name: "억만장자",
        condition: {
            type: "total_gold",
            value: 1000000000
        },
        effect: {
            type: "clickGoldMultiplier",
            value: 10
        },
        rarity: "epic"
    },
    {
        id: "lucky_person",
        name: "행운아",
        condition: {
            type: "critical_upgrades",
            value: 50
        },
        effect: {
            type: "criticalChance",
            value: 5
        },
        rarity: "rare"
    },
    {
        id: "unyielding_warrior",
        name: "불굴의 전사",
        condition: {
            type: "consecutive_failures_100",
            value: 1
        },
        effect: {
            type: "goldRefundOnFail",
            value: 50
        },
        rarity: "epic"
    },
    {
        id: "perfectionist",
        name: "완벽주의자",
        condition: {
            type: "consecutive_success",
            value: 50
        },
        effect: {
            type: "successRate",
            value: 2
        },
        rarity: "rare"
    },
    {
        id: "collector",
        name: "수집가",
        condition: {
            type: "unique_equipment",
            value: 10
        },
        effect: {
            type: "equipmentEffect",
            value: 15
        },
        rarity: "uncommon"
    },
    {
        id: "legendary_blacksmith",
        name: "전설의 대장장이",
        condition: {
            type: "forge_recipes",
            value: 500
        },
        effect: {
            type: "materialDropRate",
            value: 50
        },
        rarity: "legendary"
    },
    {
        id: "time_transcender",
        name: "시간을 초월한 자",
        condition: {
            type: "play_time",
            value: 100
        },
        effect: {
            type: "autoClickSpeed",
            value: 50
        },
        rarity: "mythical"
    },
    {
        id: "dimension_destroyer",
        name: "차원 파괴자",
        condition: {
            type: "weapon_level_30_count",
            value: 10
        },
        effect: {
            type: "allStats",
            value: 20
        },
        rarity: "mythical"
    }
];

// 칭호 희귀도 색상
const TITLE_RARITIES = {
    common: "#95a5a6",
    uncommon: "#27ae60",
    rare: "#3498db",
    epic: "#9b59b6",
    legendary: "#e67e22",
    mythical: "#e74c3c"
};