// 장비 데이터
const EQUIPMENT = [
    {
        id: "golden_ring",
        name: "황금 손길의 반지",
        slot: "ring",
        effect: "clickGoldMultiplier",
        value: 30,
        rarity: "common",
        obtainable: ["random_box", "forge"]
    },
    {
        id: "time_accelerator",
        name: "시간 가속기",
        slot: "necklace",
        effect: "autoClickSpeed",
        value: 50,
        rarity: "rare",
        obtainable: ["random_box", "event"]
    },
    {
        id: "luck_necklace",
        name: "행운의 목걸이",
        slot: "necklace",
        effect: "criticalChance",
        value: 3,
        rarity: "rare",
        obtainable: ["random_box", "achievement"]
    },
    {
        id: "greed_crown",
        name: "탐욕의 왕관",
        slot: "head",
        effect: "goldMultiplier",
        value: 25,
        rarity: "epic",
        obtainable: ["random_box"]
    },
    {
        id: "blacksmith_bracelet",
        name: "대장장이의 팔찌",
        slot: "bracelet",
        effect: "successRate",
        value: 5,
        rarity: "rare",
        obtainable: ["random_box", "achievement"]
    },
    {
        id: "warrior_gloves",
        name: "전사의 장갑",
        slot: "gloves",
        effect: "clickDamage",
        value: 100,
        rarity: "uncommon",
        obtainable: ["random_box"]
    },
    {
        id: "destroyer_mantle",
        name: "파괴자의 망토",
        slot: "back",
        effect: "criticalDamage",
        value: 50,
        rarity: "epic",
        obtainable: ["random_box"]
    },
    {
        id: "ordinary_charm",
        name: "평범한 부적",
        slot: "charm",
        effect: "allStats",
        value: 10,
        rarity: "common",
        obtainable: ["random_box", "daily"]
    },
    {
        id: "auto_miner",
        name: "자동 채굴기",
        slot: "tool",
        effect: "autoGold",
        value: 100,
        rarity: "rare",
        obtainable: ["shop", "achievement"]
    },
    {
        id: "blessing_shoes",
        name: "축복의 신발",
        slot: "feet",
        effect: "specialEffectChance",
        value: 15,
        rarity: "uncommon",
        obtainable: ["random_box"]
    }
];

// 장비 슬롯 정의
const EQUIPMENT_SLOTS = {
    head: "머리",
    necklace: "목걸이",
    ring: "반지",
    bracelet: "팔찌",
    gloves: "장갑",
    back: "등",
    charm: "부적",
    tool: "도구",
    feet: "발"
};

// 랜덤 상자 데이터
const RANDOM_BOXES = {
    normal: {
        name: "일반 상자",
        price: 10000000,
        items: [
            {equipment: "golden_ring", weight: 20},
            {equipment: "ordinary_charm", weight: 20},
            {equipment: "warrior_gloves", weight: 15},
            {equipment: "blessing_shoes", weight: 15},
            {equipment: "time_accelerator", weight: 10},
            {equipment: "luck_necklace", weight: 8},
            {equipment: "blacksmith_bracelet", weight: 6},
            {equipment: "auto_miner", weight: 4},
            {equipment: "greed_crown", weight: 1},
            {equipment: "destroyer_mantle", weight: 1}
        ]
    },
    golden: {
        name: "황금 상자",
        price: 50000000,
        items: [
            {equipment: "greed_crown", weight: 30},
            {equipment: "destroyer_mantle", weight: 25},
            {equipment: "time_accelerator", weight: 15},
            {equipment: "luck_necklace", weight: 10},
            {equipment: "blacksmith_bracelet", weight: 8},
            {equipment: "auto_miner", weight: 7},
            {equipment: "golden_ring", weight: 3},
            {equipment: "ordinary_charm", weight: 2}
        ]
    },
    legendary: {
        name: "전설 상자",
        price: 200000000,
        items: [
            {equipment: "greed_crown", weight: 40},
            {equipment: "destroyer_mantle", weight: 35},
            {equipment: "time_accelerator", weight: 10},
            {equipment: "luck_necklace", weight: 8},
            {equipment: "blacksmith_bracelet", weight: 5},
            {equipment: "auto_miner", weight: 2}
        ]
    }
};