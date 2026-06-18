document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 楽曲プレイヤーのセットアップ関数 ---
    // 楽曲アイテムにクリックイベントを設定し、プレイヤーを制御する
    const initializeMusicPlayer = (listElement, playerAreaElement) => {
        if (!listElement || !playerAreaElement) return;

        const songItems = listElement.querySelectorAll('.song-item');
        if (songItems.length === 0) return;

        songItems.forEach(item => {
            item.addEventListener('click', () => {
                // 'disabled' クラスを持つアイテムやsunoIdがない場合は何もしない
                if (item.classList.contains('disabled') || !item.dataset.sunoId) return;

                // 他のアイテムから 'active' クラスを削除
                // 親要素(listElement)から全アイテムを再取得して処理する
                listElement.querySelectorAll('.song-item').forEach(i => i.classList.remove('active'));
                // クリックされたアイテムに 'active' クラスを追加
                item.classList.add('active');

                const sunoId = item.dataset.sunoId;
                const songTitle = item.dataset.songTitle;

                // iframeを生成してプレイヤーを埋め込む
                const iframe = document.createElement('iframe');
                iframe.src = `https://suno.com/embed/${sunoId}/`;
                iframe.width = '100%';
                iframe.height = '180';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '8px';
                iframe.title = `Suno AI Player for ${songTitle}`;

                playerAreaElement.innerHTML = ''; // 既存のプレイヤーをクリア
                playerAreaElement.appendChild(iframe);
            });
        });

        // ページ読み込み時に最初の曲を自動で読み込む
        const firstActiveSong = listElement.querySelector('.song-item.active');
        if (firstActiveSong) {
            firstActiveSong.click();
        }
    }

    // --- 2. 楽曲プレイヤーの初期化実行 ---
    // music.html と index.html の両方で動作する
    const songList = document.getElementById('song-list');
    const playerArea = document.getElementById('suno-player-area');
    initializeMusicPlayer(songList, playerArea);

    // --- 3. スクロールで要素をフェードインさせるロジック ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    if (fadeInSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeInSections.forEach(section => observer.observe(section));
    }

    // --- 4. カルーセルをセットアップする汎用関数（シームレスなループ機能付き） ---
    const setupInfiniteCarousel = (containerId, prevButtonId, nextButtonId) => {
        const list = document.getElementById(containerId);
        const prevButton = document.getElementById(prevButtonId);
        const nextButton = document.getElementById(nextButtonId);

        if (!list || !prevButton || !nextButton || list.children.length === 0) {
            return;
        }

        const originalItems = Array.from(list.children);
        const itemsCount = originalItems.length;
        let isTransitioning = false;

        // 前後にアイテムをクローンして配置
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            list.appendChild(clone);
        });
        originalItems.slice().reverse().forEach(item => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            list.prepend(clone);
        });

        // 楽曲カルーセルの場合、クローンにもクリックイベントを再設定
        if (containerId === 'song-list') {
            initializeMusicPlayer(list, document.getElementById('suno-player-area'));
        }

        // スクロール量を決定
        let scrollAmount;
        if (containerId === 'song-list') {
            scrollAmount = window.innerWidth <= 768 ? 240 : 305;
        } else {
            scrollAmount = window.innerWidth <= 768 ? 260 : 350;
        }

        // 初期位置を「本物」のアイテムの先頭に設定
        const resetScrollPosition = () => {
            const itemWidth = list.children[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(list).gap) || 30;
            list.scrollLeft = (itemWidth + gap) * itemsCount;
        };
        resetScrollPosition();

        const handleScroll = (direction) => {
            if (isTransitioning) return;
            isTransitioning = true;
            list.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
        };

        nextButton.addEventListener('click', () => handleScroll(1));
        prevButton.addEventListener('click', () => handleScroll(-1));

        // スクロールが端に達したら、アニメーションなしで位置をリセット
        let scrollEndTimer;
        list.addEventListener('scroll', () => {
            clearTimeout(scrollEndTimer);
            scrollEndTimer = setTimeout(() => {
                isTransitioning = false;
                const itemWidth = list.children[0].offsetWidth;
                const gap = parseInt(window.getComputedStyle(list).gap) || 30;
                const totalItemWidth = itemWidth + gap;

                // 右端のクローン領域に達した場合
                if (list.scrollLeft >= totalItemWidth * (itemsCount * 2)) {
                    list.style.scrollBehavior = 'auto';
                    list.scrollLeft -= totalItemWidth * itemsCount;
                    list.style.scrollBehavior = 'smooth';
                }
                // 左端のクローン領域に達した場合
                if (list.scrollLeft <= totalItemWidth * (itemsCount - 1)) {
                    list.style.scrollBehavior = 'auto';
                    list.scrollLeft += totalItemWidth * itemsCount;
                    list.style.scrollBehavior = 'smooth';
                }
            }, 150);
        });

        // ウィンドウリサイズ時に位置を再計算
        window.addEventListener('resize', resetScrollPosition);
    };

    // --- 5. 各カルーセルの初期化 ---
    setupInfiniteCarousel('carousel-list', 'prev-song', 'next-song');
    setupInfiniteCarousel('game-list', 'prev-game', 'next-game');
    setupInfiniteCarousel('other-list', 'prev-other', 'next-other');

    // --- 5.5. ゲームカード全体をクリック可能にする設定 ---
    const gameCards = document.querySelectorAll('.game-card');
    gameCards.forEach(card => {
        // game.html のようにプレビュー用モーダルがある場合は、game.js の処理と競合しないようスキップする
        if (document.getElementById('game-preview-modal')) {
            return;
        }

        const link = card.querySelector('a.cta-button');
        if (link) {
            card.addEventListener('click', (e) => {
                // すでにリンク要素(a)自体をクリックしている場合は、二重遷移を防ぐために何もしない
                if (e.target.closest('a')) {
                    return;
                }
                e.preventDefault();
                const target = link.getAttribute('target') || '_self';
                if (target === '_blank') {
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = link.href;
                }
            });
        }
    });

    // --- 6. フッターのコピーライト年を自動更新 ---
    const copyrightElement = document.querySelector('.footer p');
    if (copyrightElement && copyrightElement.textContent.includes('Synapse Creations')) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; ${currentYear} Synapse Creations. All Rights Reserved.`;
    }

    // --- 7. 背景テーマの自動切り替えロジック ---
    const themes = [
        {
            name: "white",
            bgColor: "#f6f5f1",
            textMain: "#25282a",
            orbs: ["#ffd2d2", "#d2e0ff"],
            textures: [1, 0] // [Plaster, Brick]
        },
        {
            name: "navy",
            bgColor: "#0a192f",
            textMain: "#e2e8f0",
            orbs: ["#1e40af", "#0ea5e9"],
            textures: [0, 1]
        },
        {
            name: "black",
            bgColor: "#090a0c",
            textMain: "#e8ecef",
            orbs: ["#f43f5e", "#06b6d4"],
            textures: [0, 1]
        }
    ];

    function updateTheme(index) {
        const theme = themes[index];
        
        // 背景色と文字色の適用
        document.documentElement.style.setProperty('--current-bg', theme.bgColor);
        document.documentElement.style.setProperty('--text-main', theme.textMain);
        document.body.style.backgroundColor = theme.bgColor;
        document.body.style.color = theme.textMain;

        // テクスチャの不透明度切り替え
        const plaster = document.getElementById('texture-plaster');
        const brick = document.getElementById('texture-brick');
        if (plaster) plaster.style.opacity = theme.textures[0] ? '0.25' : '0';
        if (brick) brick.style.opacity = theme.textures[1] ? '0.35' : '0';

        // 光の玉の色変更
        const orb1 = document.getElementById('orb-1');
        const orb2 = document.getElementById('orb-2');
        if (orb1) orb1.style.backgroundColor = theme.orbs[0];
        if (orb2) orb2.style.backgroundColor = theme.orbs[1];
        
        // 各種カード要素のスタイル自動調整
        const cards = document.querySelectorAll('.game-card, .song-item, .artist-intro, .member-profile, .tech-stack-box');
        cards.forEach(card => {
            if (theme.name === "white") {
                card.style.background = '#ffffff';
                card.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.08)';
                card.style.backdropFilter = 'none';
            } else {
                card.style.background = 'rgba(255, 255, 255, 0.05)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                card.style.boxShadow = 'none';
                card.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // 8秒ごとに自動切り替え
    let currentThemeIndex = 0;
    setInterval(() => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        updateTheme(currentThemeIndex);
    }, 8000);

    // 初回実行
    updateTheme(0);
});