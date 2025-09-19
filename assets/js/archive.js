// 归档页面时间轴交互效果增强
(function() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', function() {
        // 获取所有年份容器
        const yearContainers = document.querySelectorAll('.archive-year');
        
        // 获取所有月份容器
        const monthContainers = document.querySelectorAll('.archive-month');
        
        // 获取所有文章条目
        const postEntries = document.querySelectorAll('.archive-entry');
        
        // 获取所有年份标题
        const yearHeaders = document.querySelectorAll('.archive-year-header');
        
        // 初始化所有元素的透明度和位置，为动画做准备
    function initElements() {
        // 初始化年份容器 - 减少过渡时间，移除初始延迟
        yearContainers.forEach((container) => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)'; // 垂直移动更适合居中时间轴
            container.style.transition = `opacity 0.3s ease, transform 0.3s ease`;
        });
        
        // 初始化月份容器 - 减少过渡时间，移除初始延迟
        monthContainers.forEach((container) => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(15px)'; // 垂直移动以适应时间轴布局
            container.style.transition = `opacity 0.25s ease, transform 0.25s ease`;
        });
        
        // 初始化文章条目 - 减少过渡时间，移除初始延迟
        postEntries.forEach((entry) => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(10px)'; // 垂直移动以适应时间轴布局
            entry.style.transition = `opacity 0.2s ease, transform 0.2s ease`;
        });
    }
        
        // 使用Intersection Observer API实现滚动显示动画
        function setupScrollAnimation() {
            // 配置观察选项
            const observerOptions = {
                root: null,
                rootMargin: '-110px 0px -70px 0px', // 进一步扩大观察区域，更早触发动画
                threshold: [0, 0.05] // 使用更低的阈值，更早检测元素进入
            };
            
            // 创建观察器实例
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // 防止短时间内重复触发动画 - 添加防闪烁机制
                    const lastAnimationTime = entry.target.getAttribute('data-last-animation') || 0;
                    const now = Date.now();
                    const timeSinceLastAnimation = now - lastAnimationTime;
                    const animationCooldown = 300; // 300ms的冷却时间
                     
                    if (entry.isIntersecting) {
                        // 元素进入视口足够深度时才触发动画，且有冷却时间
                        if (timeSinceLastAnimation > animationCooldown) {
                            // 当元素进入视口时，显示元素
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)'; // 使用垂直移动
                            entry.target.setAttribute('data-last-animation', now);
                             
                            // 如果是年份容器且已展开，显示其中的月份和文章
                            if (entry.target.classList.contains('archive-year') && entry.target.classList.contains('open')) {
                                // 减少延迟，更快地显示月份和文章
                                setTimeout(() => {
                                    const monthsInYear = entry.target.querySelectorAll('.archive-month');
                                    monthsInYear.forEach((month, index) => {
                                        setTimeout(() => {
                                            month.style.opacity = '1';
                                            month.style.transform = 'translateY(0)'; // 使用垂直移动
                                             
                                            // 减少延迟，更快地显示月份内的文章
                                            setTimeout(() => {
                                                const postsInMonth = month.querySelectorAll('.archive-entry');
                                                postsInMonth.forEach((post, postIndex) => {
                                                    setTimeout(() => {
                                                        post.style.opacity = '1';
                                                        post.style.transform = 'translateY(0)'; // 使用垂直移动
                                                    }, postIndex * 2); // 进一步减少间隔
                                                });
                                            }, 20); // 大幅减少延迟
                                        }, index * 5); // 大幅减少月份显示间隔
                                    });
                                }, 0); // 移除初始延迟
                            }
                        }
                    } else {
                        // 当元素离开视口时，重置为初始状态，且有冷却时间
                        if (timeSinceLastAnimation > animationCooldown) {
                            // 不处理年份容器，避免与展开/折叠功能冲突
                            if (!entry.target.classList.contains('archive-year')) {
                                // 月份容器
                                if (entry.target.classList.contains('archive-month')) {
                                    entry.target.style.opacity = '0';
                                    entry.target.style.transform = 'translateY(15px)'; // 使用垂直移动
                                     
                                    // 同时隐藏该月份内的所有文章
                                    const postsInMonth = entry.target.querySelectorAll('.archive-entry');
                                    postsInMonth.forEach(post => {
                                        post.style.opacity = '0';
                                        post.style.transform = 'translateY(10px)'; // 使用垂直移动
                                    });
                                } 
                                // 单独的文章条目
                                else if (entry.target.classList.contains('archive-entry')) {
                                    entry.target.style.opacity = '0';
                                    entry.target.style.transform = 'translateY(10px)'; // 使用垂直移动
                                }
                            }
                            entry.target.setAttribute('data-last-animation', now);
                        }
                    }
                });
            }, observerOptions);
            
            // 观察所有年份容器、月份容器和文章条目，确保全面监控
            yearContainers.forEach(container => {
                observer.observe(container);
            });
            
            monthContainers.forEach(container => {
                observer.observe(container);
            });
            
            postEntries.forEach(entry => {
                observer.observe(entry);
            });
        }
        
        // 设置年份折叠/展开功能
        function setupYearToggle() {
            // 确保最多只有一个年份同时展开
            let currentlyOpenYear = null;
            
            // 初始化所有年份
            yearHeaders.forEach((header, index) => {
                const yearContainer = header.closest('.archive-year');
                const content = yearContainer.querySelector('.pe-archive-details-content');
                
                // 第一个年份应该自动展开
                if (index === 0) {
                    // 确保第一个年份是展开状态
                    yearContainer.classList.add('open', 'initially-open');
                    content.style.maxHeight = '2000px';
                    
                    // 获取年份下的所有月份和文章
                    const monthsInYear = Array.from(yearContainer.querySelectorAll('.archive-month'));
                    const allPosts = Array.from(yearContainer.querySelectorAll('.archive-entry'));
                    
                    // 设置为显示状态
                    monthsInYear.forEach(month => {
                        month.style.opacity = '1';
                        month.style.transform = 'translateY(0)'; // 使用垂直移动
                    });
                    
                    allPosts.forEach(post => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)'; // 使用垂直移动
                    });
                    
                    currentlyOpenYear = yearContainer;
                } else {
                    // 其他年份初始化收起状态
                    if (!yearContainer.classList.contains('initially-open')) {
                        content.style.maxHeight = '0';
                        
                        // 获取年份下的所有月份和文章
                        const monthsInYear = Array.from(yearContainer.querySelectorAll('.archive-month'));
                        const allPosts = Array.from(yearContainer.querySelectorAll('.archive-entry'));
                        
                        // 设置为隐藏状态
                        monthsInYear.forEach(month => {
                            month.style.opacity = '0';
                            month.style.transform = 'translateY(15px)'; // 使用垂直移动
                        });
                        
                        allPosts.forEach(post => {
                            post.style.opacity = '0';
                            post.style.transform = 'translateY(10px)'; // 使用垂直移动
                        });
                    } else {
                        currentlyOpenYear = header.closest('.archive-year');
                    }
                }
            });
            
            yearHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    const yearContainer = this.closest('.archive-year');
                    const isCurrentlyOpen = yearContainer.classList.contains('open');
                    const content = yearContainer.querySelector('.pe-archive-details-content');
                    
                    // 获取年份下的所有月份和文章
                    const monthsInYear = Array.from(yearContainer.querySelectorAll('.archive-month'));
                    const allPosts = Array.from(yearContainer.querySelectorAll('.archive-entry'));
                    
                    // 强制重排以确保过渡效果正常工作
                    void content.offsetHeight;
                    
                    // 如果点击的是已经展开的年份，则只需要折叠它
                    if (isCurrentlyOpen) {
                        collapseYear(yearContainer, monthsInYear, allPosts, content);
                        currentlyOpenYear = null;
                    } else {
                        // 展开当前年份
                        expandYear(yearContainer, monthsInYear, allPosts, content);
                        currentlyOpenYear = yearContainer;
                    }
                });
            });
            
            // 快速折叠年份的函数
            function collapseYear(yearContainer, months, posts, content, isOtherYear = false) {
                if (!isOtherYear) {
                    yearContainer.classList.remove('open');
                }
                
                // 加速折叠收回的速度：设置更快的过渡时间
                posts.forEach(post => {
                            post.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                            post.style.opacity = '0';
                            post.style.transform = 'translateY(10px)'; // 使用垂直移动
                        });
                        
                        months.forEach(month => {
                            month.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                            month.style.opacity = '0';
                            month.style.transform = 'translateY(15px)'; // 使用垂直移动
                        });
                
                // 更快的延迟时间
                setTimeout(() => {
                    content.style.maxHeight = '0';
                }, 100);
            }
            
            // 快速展开年份的函数
            function expandYear(yearContainer, months, posts, content) {
                yearContainer.classList.add('open');
                
                // 立即设置最大高度，加快首次展开速度
                content.style.maxHeight = '2000px';
                
                // 优化显示逻辑，加快首次展开速度
                // 进一步加速月份显示，使用极短延迟
                months.forEach((month, index) => {
                            setTimeout(() => {
                                month.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                                month.style.opacity = '1';
                                month.style.transform = 'translateY(0)'; // 使用垂直移动
                            }, index * 3); // 极短延迟
                        });
                        
                        // 进一步加速文章显示
                        posts.forEach((post, index) => {
                            setTimeout(() => {
                                post.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                                post.style.opacity = '1';
                                post.style.transform = 'translateY(0)'; // 使用垂直移动
                            }, 5 + index * 2); // 最小化延迟和间隔
                        });
            }
        }
        
        
        // 初始化所有功能
        function init() {
            initElements();
            setupScrollAnimation();
            setupYearToggle();
        }
        
        // 启动初始化
        init();
    });
})();