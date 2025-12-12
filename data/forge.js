// 조합소 조합 데이터
var FORGE_RECIPES = [
    {
        id: "legendary_combination",
        name: "크리티컬 결정 조합",
        materials: [
            {item: "blessing_crystal", count: 15}
        ],
        result: {
            item: "luck_necklace",
            count: 1
        },
        effect: "criticalChance",
        value: 10
    },
    {
        id: "evil_soul_crystal",
        name: "사악한 영혼 결정",
        materials: [
            {item: "evil_soul", count: 6}
        ],
        result: {
            item: "golden_ring",
            count: 1
        },
        effect: "clickGoldIncrease",
        value: 30
    },
    {
        id: "ring_enhancement",
        name: "반지 강화",
        materials: [
            {item: "axe_powder", count: 6}
        ],
        result: {
            item: "broken_protection",
            count: 10
        },
        effect: "protection"
    },
    {
        id: "material_synthesis",
        name: "강화 물질 조합",
        materials: [
            {item: "transparent_material", count: 3}
        ],
        result: {
            item: "broken_protection",
            count: 9
        },
        effect: "protection"
    },
    {
        id: "ancient_power",
        name: "고대의 힘",
        materials: [
            {item: "ancient_fragment", count: 10}
        ],
        result: {
            item: "old_protection",
            count: 5
        },
        effect: "protection"
    },
    {
        id: "mysterious_synthesis",
        name: "신비한 합성",
        materials: [
            {item: "mysterious_powder", count: 8}
        ],
        result: {
            item: "normal_protection",
            count: 3
        },
        effect: "protection"
    },
    {
        id: "legendary_combination",
        name: "전설의 조합",
        materials: [
            {item: "legend_piece", count: 15}
        ],
        result: {
            item: "high_protection",
            count: 1
        },
        effect: "protection"
    }
];

// MATERIAL_DROPS는 items.js의 ITEMS.materials를 사용하도록 호환성 유지
var MATERIAL_DROPS = ITEMS.materials;

console.log('✅ FORGE_RECIPES 데이터 로드됨');