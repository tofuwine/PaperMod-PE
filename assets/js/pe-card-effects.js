// 文章卡片交互效果增强
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取所有文章卡片
        const postCards = document.querySelectorAll('.post-entry');
        
        // 为每个卡片添加交互动画
        postCards.forEach(card => {
            // 初始化卡片的透明度和位置
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // 滚动显示动画 - 使用Intersection Observer API
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 当卡片进入视口时，应用动画
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100 * Array.from(postCards).indexOf(entry.target) % 3);
                    
                    // 一旦动画完成，不再观察该元素
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // 开始观察所有卡片
        postCards.forEach(card => {
            observer.observe(card);
        });
        
        // 添加卡片悬停效果
        postCards.forEach(card => {
            // 鼠标移动时的效果
            card.addEventListener('mousemove', () => {
                // 仅保留悬浮提升效果
                card.style.transform = 'translateY(-8px)';
                card.style.transition = 'transform 0.15s ease';
            });
            
            // 鼠标离开时的效果
            card.addEventListener('mouseleave', () => {
                // 恢复卡片位置
                card.style.transform = 'translateY(0)';
                card.style.transition = 'transform 0.3s ease';
            });
        });
    });
})();