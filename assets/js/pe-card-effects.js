// 文章卡片交互效果增强
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取所有文章卡片
        const postCards = document.querySelectorAll('.post-entry');
        
        // 为每个卡片添加交互动画样式
        postCards.forEach(card => {
            // 初始化卡片样式，但不设置初始不可见状态
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        // 滚动显示动画 - 使用Intersection Observer API
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -100px 0px', // 扩大观察区域，顶部和底部各加100px
            threshold: [0, 0.1, 1] // 多个阈值，检测进入、部分可见和完全可见状态
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const card = entry.target;
                const cardIndex = Array.from(postCards).indexOf(card);
                
                // 计算卡片位置与视口顶部的关系
                const rect = card.getBoundingClientRect();
                const isNearTop = rect.top < 100 && rect.top > 0; // 当卡片顶部距离视口顶部小于100px且大于0时
                
                if (entry.isIntersecting) {
                    // 当卡片进入视口时，应用进入动画
                    if (!isNearTop) {
                        // 只有当卡片不在顶部区域时才显示完全
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50 * cardIndex % 3);
                    }
                } else {
                    // 当卡片离开视口时，重置动画状态，以便下次进入视口时再次触发
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
                
                // 添加顶部淡出效果
                if (isNearTop) {
                    // 计算淡出程度，距离顶部越近，透明度越低
                    const fadeOpacity = Math.max(0.3, rect.top / 100);
                    card.style.opacity = fadeOpacity.toString();
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
                const rect = card.getBoundingClientRect();
                if (rect.top >= 100 || rect.top <= 0) {
                    // 如果不在顶部区域，恢复到正常位置
                    card.style.transform = 'translateY(0)';
                }
                card.style.transition = 'transform 0.3s ease';
            });
        });
    });
})();