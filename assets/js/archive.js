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
        yearContainers.forEach((container) => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)'; // 垂直移动更适合居中时间轴
            container.style.transition = `opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s`;
        });
        
        // 初始化月份容器 - 不使用translateX以避免与CSS中的左右布局冲突
        monthContainers.forEach((container) => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(15px)'; // 垂直移动以适应时间轴布局
            container.style.transition = `opacity 0.2s ease 0.2s, transform 0.2s ease 0.2s`;
        });
        
        // 初始化文章条目
        postEntries.forEach((entry) => {
            entry.style.opacity = '0';
            entry.style.transform = 'translateY(10px)'; // 垂直移动以适应时间轴布局
            entry.style.transition = `opacity 0.2s ease 0.2s, transform 0.2s ease 0.2s`;
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
                            entry.target.style.transform = 'translateY(0)'; // 使用垂直移动
                            
                            // 如果是年份容器，自动展开第一个
                            if (entry.target.classList.contains('archive-year') && entry.target.classList.contains('open')) {
                                // 延迟显示月份和文章，创建层级动画效果
                                setTimeout(() => {
                                    const monthsInYear = entry.target.querySelectorAll('.archive-month');
                                    monthsInYear.forEach((month, index) => {
                                        setTimeout(() => {
                                            month.style.opacity = '1';
                                            month.style.transform = 'translateY(0)'; // 使用垂直移动
                                            
                                            // 延迟显示月份内的文章
                                            setTimeout(() => {
                                                const postsInMonth = month.querySelectorAll('.archive-entry');
                                                postsInMonth.forEach((post, postIndex) => {
                                                    setTimeout(() => {
                                                        post.style.opacity = '1';
                                                        post.style.transform = 'translateY(0)'; // 使用垂直移动
                                                    }, postIndex * 3);
                                                });
                                            }, 100);
                                        }, index * 15);
                                    });
                                }, 20);
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
                    content.style.maxHeight = '20000px';
                    
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
            
            // 折叠年份的函数
            function collapseYear(yearContainer, months, posts, content, isOtherYear = false) {
                if (!isOtherYear) {
                    yearContainer.classList.remove('open');
                }
                
                // 添加内容容器的过渡效果，延长折叠时间使动效更明显
                content.style.transition = 'max-height 0.2s ease';
                
                // 先隐藏文章和月份
                posts.forEach(post => {
                            post.style.opacity = '0';
                            post.style.transform = 'translateY(10px)'; // 使用垂直移动
                        });
                        
                        months.forEach(month => {
                            month.style.opacity = '0';
                            month.style.transform = 'translateY(15px)'; // 使用垂直移动
                        });
                
                // 等待内容淡出后再折叠容器，延长延迟以匹配动效
                setTimeout(() => {
                    content.style.maxHeight = '0';
                }, 200);
            }
            
            // 展开年份的函数
            function expandYear(yearContainer, months, posts, content) {
                yearContainer.classList.add('open');
                
                // 添加内容容器的过渡效果
                content.style.transition = 'max-height 0.2s ease';
                
                // 设置一个足够大的值作为最大高度，以便内容能够完全展开
                content.style.maxHeight = '20000px';
                
                // 缩短展开延迟，加快元素出现速度
                setTimeout(() => {
                    // 使用更紧凑的交错动画显示月份
                    months.forEach((month, index) => {
                                setTimeout(() => {
                                    month.style.opacity = '1';
                                    month.style.transform = 'translateY(0)'; // 使用垂直移动
                                }, index * 5);
                            });
                    
                            // 使用更紧凑的交错动画显示文章
                            posts.forEach((post, index) => {
                                setTimeout(() => {
                                    post.style.opacity = '1';
                                    post.style.transform = 'translateY(0)'; // 使用垂直移动
                                }, 20 + index * 2);
                            });
                }, 30);
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