// 赞赏功能交互效果
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取DOM元素
        const rewardBtn = document.querySelector('.pe-reward-btn');
        const rewardModal = document.getElementById('rewardModal');
        const closeBtn = document.querySelector('.pe-reward-close-btn');
        const modalContent = document.querySelector('.pe-reward-modal-content');

        // 检查元素是否存在
        if (!rewardBtn || !rewardModal || !closeBtn || !modalContent) {
            return;
        }

        // 模态框进入动画
        function animateModalIn() {
            // 添加微动画效果
            const qrItems = document.querySelectorAll('.pe-reward-qr-item');
            qrItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    void item.offsetWidth;
                    item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 200 + index * 150);
            });
        }

        // 模态框退出动画
        function animateModalOut() {
            return new Promise((resolve) => {
                const qrItems = document.querySelectorAll('.pe-reward-qr-item');
                qrItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                    }, index * 100);
                });

                // 等待所有动画完成
                setTimeout(resolve, 400);
            });
        }

        // 扩展现有函数以添加更多动画效果
        const originalShowRewardQrCode = window.showRewardQrCode;
        window.showRewardQrCode = function() {
            // 调用原始函数
            if (typeof originalShowRewardQrCode === 'function') {
                originalShowRewardQrCode();
            } else {
                // 如果原始函数不存在，自己实现基础功能
                rewardModal.classList.remove('hidden');
                setTimeout(() => {
                    rewardModal.classList.add('show');
                }, 10);
            }
            
            // 禁止背景滚动
            document.body.style.overflow = 'hidden';
            // 添加微动画
            setTimeout(animateModalIn, 300);
        };

        const originalHideRewardQrCode = window.hideRewardQrCode;
        window.hideRewardQrCode = function() {
            // 移除show类
            rewardModal.classList.remove('show');
            // 添加入场动画
            animateModalOut().then(() => {
                // 动画结束后添加hidden类
                rewardModal.classList.add('hidden');
                // 恢复背景滚动
                document.body.style.overflow = '';
                
                // 如果原始函数存在，调用它
                if (typeof originalHideRewardQrCode === 'function' && rewardModal.classList.contains('hidden')) {
                    // 注意：原始函数可能会再次添加/移除类，所以我们只在需要时调用
                    const tempFn = window.hideRewardQrCode;
                    window.hideRewardQrCode = () => {}; // 临时替换以避免循环调用
                    originalHideRewardQrCode();
                    window.hideRewardQrCode = tempFn; // 恢复原函数
                }
            });
        };

        // 为打赏按钮添加悬停效果增强
        rewardBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 18px rgba(255, 107, 107, 0.4)';
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });

        rewardBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 14px rgba(255, 107, 107, 0.3)';
        });

        // 为关闭按钮添加悬停效果增强
        closeBtn.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--code-bg)';
            this.style.color = 'var(--primary)';
            this.style.transition = 'all 0.2s ease';
        });

        closeBtn.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.color = '';
        });

        // 为模态框内容添加点击事件阻止冒泡
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        // 为ESC键添加事件监听
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !rewardModal.classList.contains('hidden')) {
                window.hideRewardQrCode();
            }
        });
    });
})();