document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 楽曲カルーセルのロジック ---
    const songList = document.getElementById('song-list');
    const songItems = document.querySelectorAll('.song-item');
    const playerArea = document.getElementById('suno-player-area');
    const prevButton = document.getElementById('prev-song');
    const nextButton = document.getElementById('next-song');

    // カルーセル関連の要素がすべて存在する場合のみ、処理を実行
    if (songList && songItems.length > 0 && playerArea && prevButton && nextButton) {
        
        // 曲アイテムがクリックされたときの処理
        songItems.forEach(item => {
            item.addEventListener('click', () => {
                // 'disabled' クラスを持つアイテムはクリックしても何もしない
                if (item.classList.contains('disabled')) {
                    return;
                }
                // 他のアイテムから 'active' クラスを削除
                songItems.forEach(i => i.classList.remove('active'));
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
                
                playerArea.innerHTML = ''; // 既存のプレイヤーをクリア
                playerArea.appendChild(iframe);
            });
        });

        // カルーセルのナビゲーションボタンの処理
        const scrollAmount = 305; // 1アイテムの幅(280) + ギャップ(25)
        prevButton.addEventListener('click', () => {
            songList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextButton.addEventListener('click', () => {
            songList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // --- 2. ゲームカルーセルのロジック ---
    const gameList = document.getElementById('game-list');
    const prevGameButton = document.getElementById('prev-game');
    const nextGameButton = document.getElementById('next-game');

    // ゲームカルーセル関連の要素がすべて存在する場合のみ、処理を実行
    if (gameList && prevGameButton && nextGameButton) {
        // ゲームカードの幅(320px) + ギャップ(30px)
        const gameScrollAmount = 350; 
        
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
});