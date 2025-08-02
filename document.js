document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 楽曲カルーセルのロジック ---
    const songList = document.getElementById('song-list');
    const songItems = document.querySelectorAll('.song-item');
    const playerArea = document.getElementById('suno-player-area');
    const prevButton = document.getElementById('prev-song');
    const nextButton = document.getElementById('next-song');

    if (songList && songItems.length > 0 && playerArea && prevButton && nextButton) {
        // 曲アイテムがクリックされたときの処理
        songItems.forEach(item => {
            item.addEventListener('click', () => {
                songItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const sunoId = item.dataset.sunoId;
                const songTitle = item.dataset.songTitle;

                const iframe = document.createElement('iframe');
                iframe.src = `https://suno.com/embed/${sunoId}/`;
                iframe.width = '100%';
                iframe.height = '180';
                iframe.style.border = 'none';
                iframe.style.borderRadius = '8px';
                iframe.title = `Suno AI Player for ${songTitle}`;
                
                playerArea.innerHTML = '';
                playerArea.appendChild(iframe);
            });
        });

        // カルーセルのナビゲーションボタン
        const scrollAmount = 305; // 1アイテムの幅(280) + ギャップ(25)
        prevButton.addEventListener('click', () => {
            songList.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextButton.addEventListener('click', () => {
            songList.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // --- 2. スクロールで要素をフェードインさせるロジック ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    if (fadeInSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1 // 要素が10%見えたら実行
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // 一度表示したら監視を停止
                }
            });
        }, observerOptions);

        fadeInSections.forEach(section => observer.observe(section));
    }
});