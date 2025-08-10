document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 楽曲関連のロジック ---
    const songList = document.getElementById('song-list');
    const songItems = document.querySelectorAll('.song-item');
    const playerArea = document.getElementById('suno-player-area');
    const prevButton = document.getElementById('prev-song');
    const nextButton = document.getElementById('next-song');

    // 楽曲クリックイベントのロジック (曲リストとプレイヤーエリアがあれば実行)
    if (songList && songItems.length > 0 && playerArea) {

        // 曲アイテムがクリックされたときの処理
        songItems.forEach(item => {
            item.addEventListener('click', () => {
                // 'disabled' クラスを持つアイテムはクリックしても何もしない
                if (item.classList.contains('disabled')) {
                    return;
                }

                const sunoId = item.dataset.sunoId;
                // sunoId がない場合（リンクカードなど）は何もしない
                if (!sunoId) {
                    return;
                }

                // 他のアイテムから 'active' クラスを削除
                songItems.forEach(i => i.classList.remove('active'));
                // クリックされたアイテムに 'active' クラスを追加
                item.classList.add('active');
                const songTitle = item.dataset.songTitle;

                // iframeを生成してプレイヤーを埋め込む
                const iframe = document.createElement('iframe');
                iframe.src = `https://suno.com/embed/${sunoId}/`;
                iframe.width = '100%';
                iframe.height = '180';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '8px';
                iframe.title = `Suno AI Player for ${songTitle}`;

                playerArea.innerHTML = ''; // 既存のプレイヤーをクリア
                playerArea.appendChild(iframe);
            });
        });

        // ページ読み込み時に最初の曲を自動で読み込む
        const firstActiveSong = document.querySelector('.song-item.active');
        if (firstActiveSong) {
            firstActiveSong.click();
        }
    }

    // カルーセルナビゲーションのロジック (カルーセルボタンがあれば実行)
    if (prevButton && nextButton && songList) {
        // モバイルとPCでスクロール量を変更
        const scrollAmount = window.innerWidth <= 768 ? 240 : 305; // モバイル: 220px card + 20px gap
        prevButton.addEventListener('click', () => songList.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextButton.addEventListener('click', () => songList.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    }

    // --- 2. ゲームカルーセルのロジック ---
    const gameList = document.getElementById('game-list');
    const prevGameButton = document.getElementById('prev-game');
    const nextGameButton = document.getElementById('next-game');

    // ゲームカルーセル関連の要素がすべて存在する場合のみ、処理を実行
    if (gameList && prevGameButton && nextGameButton) {
        // モバイルとPCでスクロール量を変更
        const gameScrollAmount = window.innerWidth <= 768 ? 260 : 350; // モバイル: 240px card + 20px gap
        
        prevGameButton.addEventListener('click', () => {
            gameList.scrollBy({ left: -gameScrollAmount, behavior: 'smooth' });
        });

        nextGameButton.addEventListener('click', () => {
            gameList.scrollBy({ left: gameScrollAmount, behavior: 'smooth' });
        });
    }

    // --- 3. スクロールで要素をフェードインさせるロジック ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    // フェードインさせたいセクションが存在する場合のみ、処理を実行
    if (fadeInSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 要素が10%見えたら実行
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // 要素が画面内に入ったら
                if (entry.isIntersecting) {
                    // 'visible' クラスを追加して表示させる
                    entry.target.classList.add('visible');
                    // 一度表示したら、その要素の監視を停止してパフォーマンスを向上
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 各セクションの監視を開始
        fadeInSections.forEach(section => observer.observe(section));
    }

    // --- 4. その他の作品カルーセルのロジック ---
    const otherList = document.getElementById('other-list');
    const prevOtherButton = document.getElementById('prev-other');
    const nextOtherButton = document.getElementById('next-other');

    // その他の作品カルーセル関連の要素がすべて存在する場合のみ、処理を実行
    if (otherList && prevOtherButton && nextOtherButton) {
        // モバイルとPCでスクロール量を変更 (ゲームカルーセルと同じ設定)
        const otherScrollAmount = window.innerWidth <= 768 ? 260 : 350; // モバイル: 240px card + 20px gap
        
        prevOtherButton.addEventListener('click', () => {
            otherList.scrollBy({ left: -otherScrollAmount, behavior: 'smooth' });
        });

        nextOtherButton.addEventListener('click', () => {
            otherList.scrollBy({ left: otherScrollAmount, behavior: 'smooth' });
        });
    }
});