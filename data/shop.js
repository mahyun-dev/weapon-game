// 상점 데이터
var SHOP_ITEMS = {
    warpItems: [
        {
            id: "warp_x1",
            name: "워프권 x1",
            effect: "clickMultiplier",
            value: 9,
            price: 1000000,
            unlimited: true
        },
        {
            id: "warp_x3",
            name: "워프권 x3",
            effect: "clickMultiplier",
            value: 32,
            price: 2500000,
            unlimited: true
        },
        {
            id: "warp_x10",
            name: "워프권 x10",
            effect: "clickMultiplier",
            value: 132,
            price: 7000000,
            unlimited: true
        },
        {
            id: "warp_x25",
            name: "워프권 x25",
            effect: "clickMultiplier",
            value: 413,
            price: 15000000,
            unlimited: true
        },
        {
            id: "warp_x50",
            name: "워프권 x50",
            effect: "clickMultiplier",
            value: 1089,
            price: 28000000,
            unlimited: true
        },
        {
            id: "warp_x100",
            name: "워프권 x100",
            effect: "clickMultiplier",
            value: 2956,
            price: 50000000,
            unlimited: true
        }
    ],
    protectionItems: [
        {
            id: "broken_protection_x1",
            name: "깨진 방지권 x1",
            maxLevel: 10,
            price: 1000000,
            unlimited: true
        },
        {
            id: "broken_protection_x3",
            name: "깨진 방지권 x3",
            maxLevel: 10,
            price: 2500000,
            unlimited: true
        },
        {
            id: "old_protection_x1",
            name: "낡은 방지권 x1",
            maxLevel: 15,
            price: 5000000,
            unlimited: true
        },
        {
            id: "old_protection_x3",
            name: "낡은 방지권 x3",
            maxLevel: 15,
            price: 13000000,
            unlimited: true
        },
        {
            id: "normal_protection_x1",
            name: "보통 방지권 x1",
            maxLevel: 20,
            price: 15000000,
            unlimited: true
        },
        {
            id: "normal_protection_x3",
            name: "보통 방지권 x3",
            maxLevel: 20,
            price: 40000000,
            unlimited: true
        },
        {
            id: "high_protection_x1",
            name: "고급 방지권 x1",
            maxLevel: 25,
            price: 50000000,
            unlimited: true
        },
        {
            id: "ultimate_protection_x1",
            name: "최상급 방지권 x1",
            maxLevel: 30,
            price: 100000000,
            unlimited: true
        }
    ],
    specialItems: [
        {
            id: "golden_hammer",
            name: "황금 망치",
            effect: "successRate",
            value: 5,
            permanent: true,
            price: 25000000,
            purchaseLimit: 1
        },
        {
            id: "luck_charm",
            name: "행운의 부적",
            effect: "successRate",
            value: 3,
            permanent: true,
            price: 15000000,
            purchaseLimit: 3
        },
        {
            id: "auto_clicker",
            name: "자동 클릭기",
            effect: "autoClick",
            value: 10,
            permanent: true,
            price: 30000000,
            purchaseLimit: 1
        },
        {
            id: "bulk_sell_ticket",
            name: "대량 판매권",
            effect: "sellMultiplier",
            value: 20,
            permanent: true,
            price: 20000000,
            purchaseLimit: 1
        },
        {
            id: "random_box",
            name: "랜덤 장비 상자",
            effect: "randomEquipment",
            value: 1,
            permanent: false,
            price: 5000000,
            purchaseLimit: 10
        },
        {
            id: "time_distortion",
            name: "시간 왜곡기",
            effect: "autoClickSpeed",
            value: 100,
            permanent: true,
            price: 50000000,
            purchaseLimit: 1
        },
        {
            id: "material_detector",
            name: "재료 탐지기",
            effect: "materialDropRate",
            value: 100,
            permanent: true,
            price: 35000000,
            purchaseLimit: 1
        }
    ],
    dailyDiscounts: [
        {
            id: "daily_warp_x3",
            name: "오늘의 워프권 x3",
            originalPrice: 2500000,
            discountPrice: 1500000,
            dailyLimit: 1
        },
        {
            id: "daily_protection_set",
            name: "오늘의 방지권 세트",
            originalPrice: 5000000,
            discountPrice: 3000000,
            dailyLimit: 1
        },
        {
            id: "lucky_box",
            name: "행운의 상자",
            originalPrice: 10000000,
            discountPrice: 6000000,
            dailyLimit: 1
        },
        {
            id: "random_material_pack",
            name: "랜덤 재료 팩",
            originalPrice: 3000000,
            discountPrice: 1800000,
            dailyLimit: 2
        }
    ]
};

console.log('✅ SHOP_ITEMS 데이터 로드됨');