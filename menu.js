document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');
    const menuIcon = document.getElementById('menu-icon');
    const menuContent = document.getElementById('menu-content');

    const menuLinks = menuContent.querySelectorAll('a');

    function closeMenu() {
        menuContainer.classList.remove('open');
        menuContent.classList.add('hidden');
    }

    // メニューアイコンのクリックイベント
    menuIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // documentへのクリックイベントの伝播を停止
        menuContainer.classList.toggle('open');
        menuContent.classList.toggle('hidden');
    });

    // メニュー内のリンクをクリックしたときにメニューを閉じる
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuContainer.classList.contains('open')) {
                closeMenu();
            }
        });
    });

    // メニューの外側をクリックしたときにメニューを閉じる
    document.addEventListener('click', (e) => {
        if (menuContainer && !menuContainer.contains(e.target) && menuContainer.classList.contains('open')) {
            closeMenu();
        }
    });
});