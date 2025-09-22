document.querySelectorAll('pre > code').forEach((codeBlock) => {
    const codeBlockWrap = codeBlock.closest('.pe-code-block-wrap')
    const copyButton = codeBlockWrap.querySelector('button.pe-code-copy-button')

    function copyingDone() {
        // 添加复制成功的动画效果
        copyButton.style.transform = 'scale(1.2)';

        copyButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="pe-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67375C18.5196 5.98487 18.6374 6.607 18.3262 7.06331L10.8262 18.0633C10.6585 18.3093 10.3898 18.4678 10.0934 18.4956C9.79688 18.5234 9.50345 18.4176 9.29289 18.2071L4.79289 13.7071C4.40237 13.3166 4.40237 12.6834 4.79289 12.2929C5.18342 11.9023 5.81658 11.9023 6.20711 12.2929L9.85368 15.9394L16.6738 5.93664C16.9849 5.48033 17.607 5.36263 18.0633 5.67375Z" fill="currentColor"></path></svg>'
        setTimeout(() => {
            copyButton.style.transform = 'scale(1)';
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" class="pe-icon"><path fill="currentColor" fill-rule="evenodd" d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" clip-rule="evenodd"></path></svg>'
        }, 2000);
    }

    copyButton.addEventListener('click', (cb) => {
        // 防止触发 details-summary 点击事件
        cb.stopPropagation();
        if ('clipboard' in navigator) {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyingDone();
            })
            return;
        }
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
            document.execCommand('copy');
            copyingDone();
        } catch (e) {
        }
        selection.removeRange(range);
    });
});

let peCodeDetails = document.getElementsByClassName('pe-code-details')
for (let element of peCodeDetails) {
    const peCodeSummary = element.getElementsByClassName('pe-code-details-summary')[0];
    if (peCodeSummary) {
        peCodeSummary.addEventListener('click', () => {
            if (element.classList.contains('open')) {
                element.classList.remove('open');
                element.classList.remove('scrollable');
            } else {
                element.classList.add('open');
                setTimeout(() => {
                    element.classList.add('scrollable');
                }, 800);
            }
        }, false);
    }
}