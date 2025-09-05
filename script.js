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
    setupInfiniteCarousel('song-list', 'prev-song', 'next-song');
    setupInfiniteCarousel('game-list', 'prev-game', 'next-game');
    setupInfiniteCarousel('other-list', 'prev-other', 'next-other');
});