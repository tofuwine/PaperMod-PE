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
            // 初始化年份容器
            yearContainers.forEach((container, index) => {
                container.style.opacity = '0';
                container.style.transform = 'translateX(-20px)';
                container.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            });
            
            // 初始化月份容器
            monthContainers.forEach((container, index) => {
                container.style.opacity = '0';
                container.style.transform = 'translateX(-15px)';
                container.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
            });
            
            // 初始化文章条目
            postEntries.forEach((entry, index) => {
                entry.style.opacity = '0';
                entry.style.transform = 'translateX(-10px)';
                entry.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
            });
        }
        
        // 使用Intersection Observer API实现滚动显示动画
        function setupScrollAnimation() {
            // 配置观察选项
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            // 创建观察器实例
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // 当元素进入视口时，显示元素
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                        
                        // 如果是年份容器，自动展开第一个
                        if (entry.target.classList.contains('archive-year') && entry.target.classList.contains('open')) {
                            // 延迟显示月份和文章，创建层级动画效果
                            setTimeout(() => {
                                const monthsInYear = entry.target.querySelectorAll('.archive-month');
                                monthsInYear.forEach((month, index) => {
                                    setTimeout(() => {
                                        month.style.opacity = '1';
                                        month.style.transform = 'translateX(0)';
                                        
                                        // 延迟显示月份内的文章
                                        setTimeout(() => {
                                            const postsInMonth = month.querySelectorAll('.archive-entry');
                                            postsInMonth.forEach((post, postIndex) => {
                                                setTimeout(() => {
                                                    post.style.opacity = '1';
                                                    post.style.transform = 'translateX(0)';
                                                }, postIndex * 30);
                                            });
                                        }, 100);
                                    }, index * 150);
                                });
                            }, 200);
                        }
                    }
                });
            }, observerOptions);
            
            // 观察所有年份容器
            yearContainers.forEach(container => {
                observer.observe(container);
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
                        month.style.transform = 'translateX(0)';
                    });
                    
                    allPosts.forEach(post => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateX(0)';
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
                            month.style.transform = 'translateX(-15px)';
                        });
                        
                        allPosts.forEach(post => {
                            post.style.opacity = '0';
                            post.style.transform = 'translateX(-10px)';
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
                        // 如果有其他年份是展开的，则先折叠它
                        if (currentlyOpenYear && currentlyOpenYear !== yearContainer) {
                            const otherContent = currentlyOpenYear.querySelector('.pe-archive-details-content');
                            const otherMonths = Array.from(currentlyOpenYear.querySelectorAll('.archive-month'));
                            const otherPosts = Array.from(currentlyOpenYear.querySelectorAll('.archive-entry'));
                            
                            collapseYear(currentlyOpenYear, otherMonths, otherPosts, otherContent, true);
                        }
                        
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
                    post.style.transform = 'translateX(-10px)';
                });
                
                months.forEach(month => {
                    month.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
                    month.style.opacity = '0';
                    month.style.transform = 'translateX(-15px)';
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
                // 同时显示所有月份，使用非常小的延迟
                months.forEach((month, index) => {
                    setTimeout(() => {
                        month.style.opacity = '1';
                        month.style.transform = 'translateX(0)';
                    }, index * 20); // 更小的延迟
                });
                
                // 更快地显示文章，使用更紧凑的交错动画
                posts.forEach((post, index) => {
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateX(0)';
                    }, 50 + index * 10); // 减少基础延迟和间隔
                });
            }
        }
        
        // 添加文章条目悬停效果
        function setupEntryHoverEffects() {
            postEntries.forEach(entry => {
                // 鼠标移入效果
                entry.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(8px)';
                    this.style.transition = 'transform 0.2s ease';
                });
                
                // 鼠标移出效果
                entry.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                    this.style.transition = 'transform 0.3s ease';
                });
            });
        }
        
        // 实现平滑滚动到顶部按钮
        function setupScrollToTop() {
            // 创建滚动到顶部按钮（如果不存在）
            let topButton = document.getElementById('top-link');
            if (!topButton) {
                topButton = document.createElement('button');
                topButton.id = 'top-link';
                topButton.className = 'pe-float-btn';
                topButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"></path></svg>';
                topButton.title = '回到顶部';
                document.body.appendChild(topButton);
            }
            
            // 监听滚动事件，显示或隐藏回到顶部按钮
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    topButton.style.visibility = 'visible';
                    topButton.style.opacity = '1';
                } else {
                    topButton.style.visibility = 'hidden';
                    topButton.style.opacity = '0';
                }
            });
            
            // 添加点击事件，平滑滚动到顶部
            topButton.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // 初始化所有功能
        function init() {
            initElements();
            setupScrollAnimation();
            setupYearToggle();
            setupEntryHoverEffects();
            setupScrollToTop();
        }
        
        // 启动初始化
        init();
    });
})();