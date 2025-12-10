// 무기 데이터
const WEAPONS = [
    {
        level: 0,
        name: "녹슨 검",
        upgradeCost: 300,
        sellPrice: 0,
        successRate: 100,
        clickGold: 1,
        specialEffect: null,
        visual: {
            image: "assets/weapons/sword_0.png",
            color: "gray",
            particle: null,
            background: null
        }
    },
    {
        level: 1,
        name: "나무 검",
        upgradeCost: 300,
        sellPrice: 150,
        successRate: 100,
        clickGold: 2,
        specialEffect: null,
        visual: {
            image: "assets/weapons/sword_1.png",
            color: "brown",
            particle: null,
            background: null
        }
    },
    {
        level: 2,
        name: "철검",
        upgradeCost: 500,
        sellPrice: 400,
        successRate: 100,
        clickGold: 3,
        specialEffect: null,
        visual: {
            image: "assets/weapons/sword_2.png",
            color: "silver",
            particle: null,
            background: null
        }
    },
    {
        level: 3,
        name: "단검",
        upgradeCost: 500,
        sellPrice: 600,
        successRate: 95,
        clickGold: 5,
        specialEffect: null,
        visual: {
            image: "assets/weapons/sword_3.png",
            color: "gray",
            particle: null,
            background: null
        }
    },
    {
        level: 4,
        name: "불타는 검",
        upgradeCost: 1000,
        sellPrice: 800,
        successRate: 95,
        clickGold: 7,
        specialEffect: "화염 효과",
        visual: {
            image: "assets/weapons/sword_4.png",
            color: "orange",
            particle: "fire",
            background: null
        }
    },
    {
        level: 5,
        name: "서리의 검",
        upgradeCost: 1500,
        sellPrice: 1200,
        successRate: 90,
        clickGold: 10,
        specialEffect: "빙결 효과",
        visual: {
            image: "assets/weapons/sword_5.png",
            color: "blue",
            particle: "ice",
            background: null
        }
    },
    {
        level: 6,
        name: "전사의 대검",
        upgradeCost: 2500,
        sellPrice: 2000,
        successRate: 90,
        clickGold: 15,
        specialEffect: null,
        visual: {
            image: "assets/weapons/sword_6.png",
            color: "gray",
            particle: null,
            background: null
        }
    },
    {
        level: 7,
        name: "용의 송곳니",
        upgradeCost: 5000,
        sellPrice: 4000,
        successRate: 85,
        clickGold: 20,
        specialEffect: "드래곤 오라",
        visual: {
            image: "assets/weapons/sword_7.png",
            color: "red",
            particle: "dragon",
            background: null
        }
    },
    {
        level: 8,
        name: "빛나는 성검",
        upgradeCost: 10000,
        sellPrice: 8500,
        successRate: 85,
        clickGold: 30,
        specialEffect: "신성한 빛",
        visual: {
            image: "assets/weapons/sword_8.png",
            color: "gold",
            particle: "holy",
            background: null
        }
    },
    {
        level: 9,
        name: "어둠의 마검",
        upgradeCost: 15000,
        sellPrice: 13000,
        successRate: 80,
        clickGold: 40,
        specialEffect: "암흑 오라",
        visual: {
            image: "assets/weapons/sword_9.png",
            color: "purple",
            particle: "dark",
            background: null
        }
    },
    {
        level: 10,
        name: "정령의 검",
        upgradeCost: 20000,
        sellPrice: 17000,
        successRate: 80,
        clickGold: 50,
        specialEffect: "정령 가호",
        visual: {
            image: "assets/weapons/sword_10.png",
            color: "green",
            particle: "spirit",
            background: null
        }
    },
    {
        level: 11,
        name: "피묻은 검",
        upgradeCost: 30000,
        sellPrice: 26000,
        successRate: 75,
        clickGold: 75,
        specialEffect: "흡혈 효과",
        visual: {
            image: "assets/weapons/sword_11.png",
            color: "red",
            particle: "blood",
            background: null
        }
    },
    {
        level: 12,
        name: "천둥의 검",
        upgradeCost: 50000,
        sellPrice: 43000,
        successRate: 75,
        clickGold: 100,
        specialEffect: "번개 효과",
        visual: {
            image: "assets/weapons/sword_12.png",
            color: "yellow",
            particle: "lightning",
            background: null
        }
    },
    {
        level: 13,
        name: "영혼 절단자",
        upgradeCost: 75000,
        sellPrice: 65000,
        successRate: 70,
        clickGold: 130,
        specialEffect: "영혼 공격",
        visual: {
            image: "assets/weapons/sword_13.png",
            color: "purple",
            particle: "soul",
            background: null
        }
    },
    {
        level: 14,
        name: "대지를 가르는 검",
        upgradeCost: 100000,
        sellPrice: 88000,
        successRate: 70,
        clickGold: 160,
        specialEffect: "지진 효과",
        visual: {
            image: "assets/weapons/sword_14.png",
            color: "brown",
            particle: "earth",
            background: null
        }
    },
    {
        level: 15,
        name: "시간의 검",
        upgradeCost: 150000,
        sellPrice: 135000,
        successRate: 65,
        clickGold: 200,
        specialEffect: "시간 왜곡",
        visual: {
            image: "assets/weapons/sword_15.png",
            color: "silver",
            particle: "time",
            background: null
        }
    },
    {
        level: 16,
        name: "공간 파괴자",
        upgradeCost: 250000,
        sellPrice: 225000,
        successRate: 65,
        clickGold: 300,
        specialEffect: "공간 균열",
        visual: {
            image: "assets/weapons/sword_16.png",
            color: "black",
            particle: "space",
            background: null
        }
    },
    {
        level: 17,
        name: "별빛 검",
        upgradeCost: 400000,
        sellPrice: 365000,
        successRate: 60,
        clickGold: 400,
        specialEffect: "별빛 폭발",
        visual: {
            image: "assets/weapons/sword_17.png",
            color: "white",
            particle: "star",
            background: null
        }
    },
    {
        level: 18,
        name: "은하수의 검",
        upgradeCost: 650000,
        sellPrice: 600000,
        successRate: 60,
        clickGold: 550,
        specialEffect: "우주 오라",
        visual: {
            image: "assets/weapons/sword_18.png",
            color: "blue",
            particle: "galaxy",
            background: null
        }
    },
    {
        level: 19,
        name: "신화의 검",
        upgradeCost: 1000000,
        sellPrice: 930000,
        successRate: 55,
        clickGold: 650,
        specialEffect: "신화 각성",
        visual: {
            image: "assets/weapons/sword_19.png",
            color: "rainbow",
            particle: "myth",
            background: null
        }
    },
    {
        level: 20,
        name: "창세의 검",
        upgradeCost: 1500000,
        sellPrice: 1400000,
        successRate: 55,
        clickGold: 800,
        specialEffect: "창조의 힘",
        visual: {
            image: "assets/weapons/sword_20.png",
            color: "gold",
            particle: "creation",
            background: null
        }
    },
    {
        level: 21,
        name: "무한의 검",
        upgradeCost: 2500000,
        sellPrice: 2350000,
        successRate: 50,
        clickGold: 1200,
        specialEffect: "무한 에너지",
        visual: {
            image: "assets/weapons/sword_21.png",
            color: "infinite",
            particle: "infinite",
            background: null
        }
    },
    {
        level: 22,
        name: "절대자의 검",
        upgradeCost: 4000000,
        sellPrice: 3800000,
        successRate: 50,
        clickGold: 1600,
        specialEffect: "절대 지배",
        visual: {
            image: "assets/weapons/sword_22.png",
            color: "absolute",
            particle: "absolute",
            background: null
        }
    },
    {
        level: 23,
        name: "초월자의 검",
        upgradeCost: 6500000,
        sellPrice: 6200000,
        successRate: 45,
        clickGold: 2000,
        specialEffect: "차원 초월",
        visual: {
            image: "assets/weapons/sword_23.png",
            color: "transcend",
            particle: "transcend",
            background: null
        }
    },
    {
        level: 24,
        name: "세계수의 검",
        upgradeCost: 10000000,
        sellPrice: 9600000,
        successRate: 45,
        clickGold: 2400,
        specialEffect: "생명 순환",
        visual: {
            image: "assets/weapons/sword_24.png",
            color: "world_tree",
            particle: "life",
            background: null
        }
    },
    {
        level: 25,
        name: "운명의 검",
        upgradeCost: 16000000,
        sellPrice: 15400000,
        successRate: 40,
        clickGold: 3000,
        specialEffect: "운명 조작",
        visual: {
            image: "assets/weapons/sword_25.png",
            color: "fate",
            particle: "fate",
            background: null
        }
    },
    {
        level: 26,
        name: "카오스 블레이드",
        upgradeCost: 25000000,
        sellPrice: 24200000,
        successRate: 40,
        clickGold: 5000,
        specialEffect: "혼돈의 힘",
        visual: {
            image: "assets/weapons/sword_26.png",
            color: "chaos",
            particle: "chaos",
            background: null
        }
    },
    {
        level: 27,
        name: "코스믹 소드",
        upgradeCost: 40000000,
        sellPrice: 38800000,
        successRate: 35,
        clickGold: 8000,
        specialEffect: "우주 파괴",
        visual: {
            image: "assets/weapons/sword_27.png",
            color: "cosmic",
            particle: "cosmic",
            background: null
        }
    },
    {
        level: 28,
        name: "에테르 블레이드",
        upgradeCost: 65000000,
        sellPrice: 63200000,
        successRate: 35,
        clickGold: 12000,
        specialEffect: "에테르 흡수",
        visual: {
            image: "assets/weapons/sword_28.png",
            color: "ether",
            particle: "ether",
            background: null
        }
    },
    {
        level: 29,
        name: "원초의 검",
        upgradeCost: 100000000,
        sellPrice: 97500000,
        successRate: 30,
        clickGold: 16000,
        specialEffect: "원초의 힘",
        visual: {
            image: "assets/weapons/sword_29.png",
            color: "primordial",
            particle: "primordial",
            background: null
        }
    },
    {
        level: 30,
        name: "절대신검 무한대",
        upgradeCost: 150000000,
        sellPrice: 145000000,
        successRate: 30,
        clickGold: 20000,
        specialEffect: "모든 것을 베는 검",
        visual: {
            image: "assets/weapons/sword_30.png",
            color: "god",
            particle: "god",
            background: null
        }
    }
];