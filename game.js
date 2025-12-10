document.addEventListener('DOMContentLoaded', function () {
    const gameList = document.getElementById('game-list');
    const modal = document.getElementById('game-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalButton = document.getElementById('modal-close');

    if (!gameList || !modal || !modalBody || !closeModalButton) return;

    const gameCards = gameList.querySelectorAll('.game-card');
    if (gameCards.length === 0) return;

    // モーダルを開く関数
    function openModal(url) {
        // iframeを生成してモーダル内に配置
        modalBody.innerHTML = ''; // 中身をクリア
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.setAttribute('allowfullscreen', '');
        modalBody.appendChild(iframe);

        // モーダルを表示
        modal.classList.remove('hidden');
        document.body.classList.add('game-active'); // 背景アニメーションを停止
    }

    // モーダルを閉じる関数
    function closeModal() {
        modal.classList.add('hidden');
        modalBody.innerHTML = ''; // iframeを削除してメモリを解放
        document.body.classList.remove('game-active'); // 背景アニメーションを再開
    }

    // 閉じるボタンとモーダル背景のクリックイベント
    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // モーダルの背景（黒い部分）をクリックした時だけ閉じる
        if (e.target === modal) {
            closeModal();
        }
    });

    // 各ゲームカードにクリックイベントを設定
    gameCards.forEach(card => {
        const link = card.querySelector('a.cta-button');
        if (link) {
            // "PLAY"ボタンは新しいタブで開くので、モーダルは開かない
            link.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
        
        // カード本体（"PLAY"ボタン以外）がクリックされたらモーダルを開く
        card.addEventListener('click', () => {
            if (link) {
                // 他のカードから .active クラスを削除
                gameCards.forEach(c => c.classList.remove('active'));
                // クリックされたカードに .active クラスを追加
                card.classList.add('active');
                openModal(link.href);
            }
        });
    });
});
