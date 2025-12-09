// 대장간 조합 데이터
const FORGE_RECIPES = [
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

// 재료 획득 데이터
const MATERIAL_DROPS = {
    evil_soul: {
        name: "사악한 영혼",
        dropRate: 5,
        minLevel: 5,
        description: "+5 이상 강화 성공 시 드롭"
    },
    axe_powder: {
        name: "도끼 가루",
        dropRate: 3,
        minLevel: 8,
        description: "+8 이상 강화 성공 시 드롭"
    },
    transparent_material: {
        name: "투명 물질",
        dropRate: 2,
        minLevel: 10,
        description: "+10 이상 강화 성공 시 드롭"
    },
    ancient_fragment: {
        name: "고대 파편",
        dropRate: 1,
        minLevel: 15,
        description: "+15 이상 강화 성공 시 드롭"
    },
    mysterious_powder: {
        name: "신비한 가루",
        dropRate: 0.5,
        minLevel: 20,
        description: "+20 이상 강화 성공 시 드롭"
    },
    legend_piece: {
        name: "전설 조각",
        dropRate: 0.2,
        minLevel: 25,
        description: "+25 이상 강화 성공 시 드롭"
    },
    luck_powder: {
        name: "행운의 가루",
        dropRate: 10,
        minLevel: 0,
        description: "모든 강화 시도 시 드롭 (일일 5개 무료)"
    },
    blessing_crystal: {
        name: "축복의 결정",
        dropRate: 100,
        minLevel: 0,
        description: "크리티컬 강화 성공 시 드롭",
        special: true
    }
};