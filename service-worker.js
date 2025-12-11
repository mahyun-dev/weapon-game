// 검 강화하기 - Service Worker
const CACHE_NAME = 'sword-upgrade-v1.0.3';
const BASE_PATH = '/weapon-game';
const ASSETS_TO_CACHE = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/style.css`,
    `${BASE_PATH}/script.js`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/data/achievements.js`,
    `${BASE_PATH}/data/equipment.js`,
    `${BASE_PATH}/data/forge.js`,
    `${BASE_PATH}/data/items.js`,
    `${BASE_PATH}/data/shop.js`,
    `${BASE_PATH}/data/titles.js`,
    `${BASE_PATH}/data/weapons.js`,
    `${BASE_PATH}/assets/weapons/sword_0.png`,
    `${BASE_PATH}/assets/icons/icon-72x72.png`,
    `${BASE_PATH}/assets/icons/icon-96x96.png`,
    `${BASE_PATH}/assets/icons/icon-128x128.png`,
    `${BASE_PATH}/assets/icons/icon-144x144.png`,
    `${BASE_PATH}/assets/icons/icon-152x152.png`,
    `${BASE_PATH}/assets/icons/icon-192x192.png`,
    `${BASE_PATH}/assets/icons/icon-384x384.png`,
    `${BASE_PATH}/assets/icons/icon-512x512.png`,
    'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap'
];

// 설치 이벤트 - 캐시에 리소스 저장
self.addEventListener('install', (event) => {
    console.log('[Service Worker] 설치 중...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] 캐시에 파일 저장 중...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[Service Worker] 설치 완료!');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] 설치 실패:', error);
            })
    );
});

// 활성화 이벤트 - 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] 활성화 중...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[Service Worker] 오래된 캐시 삭제:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] 활성화 완료!');
                return self.clients.claim();
            })
    );
});

// 페치 이벤트 - 캐시 우선 전략
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // 캐시에 있으면 캐시된 리소스 반환
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 캐시에 없으면 네트워크에서 가져오기
                return fetch(event.request)
                    .then((response) => {
                        // 유효하지 않은 응답은 캐시하지 않음
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // 응답 복제 (한 번은 캐시에, 한 번은 반환용)
                        const responseToCache = response.clone();

                        // 새로운 리소스를 캐시에 추가
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // 네트워크 오류 시 오프라인 페이지 반환 (선택사항)
                        console.log('[Service Worker] 오프라인 모드');
                    });
            })
    );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-game-data') {
        event.waitUntil(syncGameData());
    }
});

async function syncGameData() {
    console.log('[Service Worker] 게임 데이터 동기화 중...');
    // 여기에 서버와 데이터 동기화 로직 추가 가능
}

// 푸시 알림 (선택사항)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : '게임에 새로운 업데이트가 있습니다!',
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification('검 강화하기', options)
    );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
