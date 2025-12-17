document.addEventListener('DOMContentLoaded', function () {
    const gameModal = document.getElementById('game-preview-modal');
    const gameIframe = document.getElementById('game-preview-iframe');
    const closeModalButton = document.getElementById('game-preview-close');
    const gameCards = document.querySelectorAll('.game-card');

    if (!gameModal || !gameIframe || !closeModalButton || gameCards.length === 0) {
        return;
    }

    // モーダルを開く関数
    function openGameModal(url) {
        gameIframe.src = url;
        gameModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // 背景のスクロールを禁止
    }

    // モーダルを閉じる関数
    function closeGameModal() {
        gameModal.classList.add('hidden');
        gameIframe.src = ''; // iframeの読み込みを停止してリソースを解放
        document.body.style.overflow = ''; // 背景のスクロール禁止を解除
    }

    // 閉じるボタンのクリックイベント
    closeModalButton.addEventListener('click', closeGameModal);

    // モーダルの背景（オーバーレイ）クリックで閉じる
    gameModal.addEventListener('click', (e) => {
        if (e.target === gameModal) {
            closeGameModal();
        }
    });

    // 各ゲームカードにクリックイベントを設定
    gameCards.forEach(card => {
        const link = card.querySelector('a.cta-button');
        if (link) {
            // カード全体をクリックしたときにモーダルを開く
            card.addEventListener('click', (e) => {
                e.preventDefault(); // リンクのデフォルト動作（ページ遷移やタブを開くなど）をキャンセル
                openGameModal(link.href);
            });
        });
    });
});
