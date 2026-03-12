// ============================================================
// 复刻参考网站整体交互结构说明
// 来源参考：https://chen2695248455-lang.github.io/myself-website/
// - 全局导航：固定顶部 + 滚动背景变化 + 当前模块高亮 + 移动端汉堡菜单
// - 平滑滚动：点击导航 / 回到顶部按钮，平滑滚动到对应模块
// - Hero 区：左文右图，主要动画由 CSS 控制淡入
// - Skills 区：滚动到技能模块时，技能进度条从 0% 动画到目标百分比
// - Projects 区：项目卡片 hover 上浮 + 阴影增强（此部分主要由 CSS 控制）
// - Timeline 区：时间轴节点 hover 高亮（CSS 控制）
// - Contact 区：图标 hover 发光（CSS 控制）
// - 背景：轻量粒子星空（FPS 和粒子数量受控，保证性能）
// 本文件在结构和交互逻辑上复刻上述行为，仅将视觉风格替换为炫酷可爱星空风。
// ============================================================

// 顶部导航滚动样式 & 平滑滚动逻辑等交互（复刻参考网站导航行为）

// 工具函数：平滑滚动到指定元素（兼容性处理）
function smoothScrollTo(target) {
  // target 可以是选择器或元素
  var element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  // 现代浏览器：使用 scrollIntoView
  if ("scrollBehavior" in document.documentElement.style) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    // 简单降级：直接跳转
    var rect = element.getBoundingClientRect();
    window.scrollTo(0, rect.top + window.scrollY);
  }
}

// 初始化导航栏交互
function initNavbar() {
  var header = document.getElementById("top-nav");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var backToTop = document.getElementById("back-to-top");

  if (!header) return;

  // 预先获取需要高亮的导航链接和对应模块（复刻参考网站 scrollspy 行为）
  var sectionSelectors = ["#hero", "#about", "#skills", "#projects", "#experience", "#education", "#contact"];
  var sections = sectionSelectors
    .map(function (sel) {
      var el = document.querySelector(sel);
      return el
        ? {
            id: sel,
            el: el,
          }
        : null;
    })
    .filter(Boolean);
  var navLinks = document.querySelectorAll('a[href^="#"]');

  // 滚动时改变导航栏背景与阴影 + 导航当前项高亮
  window.addEventListener("scroll", function () {
    var scrolled = window.scrollY || window.pageYOffset;
    if (scrolled > 40) {
      header.classList.add(
        "bg-[#050816]/95",
        "shadow-[0_12px_35px_rgba(0,0,0,0.55)]",
        "border-b",
        "border-white/10"
      );
    } else {
      header.classList.remove(
        "bg-[#050816]/95",
        "shadow-[0_12px_35px_rgba(0,0,0,0.55)]",
        "border-b",
        "border-white/10"
      );
    }

    // 控制返回顶部按钮显隐
    if (backToTop) {
      if (scrolled > 300) {
        backToTop.style.opacity = "1";
        backToTop.style.pointerEvents = "auto";
      } else {
        backToTop.style.opacity = "0.3";
        backToTop.style.pointerEvents = "none";
      }
    }

    // 根据当前滚动位置高亮对应导航项（简单版 scrollspy，复刻参考网站当前章节高亮效果）
    var currentId = "#hero";
    var offsetY = scrolled + 120; // 适当提前一些，避免遮挡
    sections.forEach(function (s) {
      var rect = s.el.getBoundingClientRect();
      var top = rect.top + window.scrollY;
      if (top <= offsetY) {
        currentId = s.id;
      }
    });

    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      if (href === currentId) {
        link.classList.add("nav-link-active");
      } else {
        link.classList.remove("nav-link-active");
      }
    });
  });

  // 移动端菜单展开/关闭（复刻参考网站移动端汉堡菜单逻辑）
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    // 点击菜单项后自动收起
    mobileMenu.addEventListener("click", function (e) {
      if (e.target.tagName.toLowerCase() === "a") {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // 导航点击平滑滚动（桌面 + 移动，复刻参考网站 smooth scroll 行为）
  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href === "#" || href.startsWith("http")) return;
      var targetId = href;
      if (document.querySelector(targetId)) {
        e.preventDefault();
        smoothScrollTo(targetId);
      }
    });
  });

  // 返回顶部按钮
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      smoothScrollTo("#hero");
    });
  }
}

// 技能进度条动画（复刻参考网站 Skills：滚动到技能区时进度条从 0% 拉满）
function initSkillProgress() {
  var section = document.getElementById("skills");
  if (!section) return;

  var bars = Array.prototype.slice.call(
    document.querySelectorAll("[data-skill-bar]")
  );
  var percents = Array.prototype.slice.call(
    document.querySelectorAll("[data-skill-percent]")
  );
  if (!bars.length) return;

  var hasAnimated = false;

  function animateBars() {
    if (hasAnimated) return;
    hasAnimated = true;

    bars.forEach(function (bar) {
      var targetPercent = parseInt(bar.getAttribute("data-percent"), 10);
      if (isNaN(targetPercent)) targetPercent = 0;

      var current = 0;
      var step = Math.max(1, Math.round(targetPercent / 40)); // 约 0.8s 左右完成

      function update() {
        current += step;
        if (current > targetPercent) current = targetPercent;
        bar.style.width = current + "%";

        // 同步更新右上角百分比文本
        var percentTextEl = bar
          .closest(".skill-card")
          .querySelector("[data-skill-percent]");
        if (percentTextEl) {
          percentTextEl.textContent = current + "%";
        }

        if (current < targetPercent) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // 使用 IntersectionObserver 监听技能模块是否进入视口
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateBars();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(section);
  } else {
    // 不支持 IntersectionObserver 时，页面加载后直接执行动画
    animateBars();
  }
}

// 粒子背景初始化（使用 tsparticles，配置为柔和星空，复刻参考网站粒子背景行为）
function initParticles() {
  var container = document.getElementById("particles-js");
  if (!container || !window.tsParticles) return;

  // 中文注释：调用 tsparticles 加载粒子效果，参数可根据喜好调整
  window.tsParticles
    .load("particles-js", {
      background: {
        color: {
          value: "#121226",
        },
      },
      fpsLimit: 45,
      interactivity: {
        events: {
          onHover: {
            enable: false,
            mode: "none",
          },
          resize: true,
        },
        modes: {
          repulse: {
            distance: 80,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ["#7B61FF", "#FF9EE7", "#F5F5FF"],
        },
        links: {
          color: "#6b7280",
          distance: 110,
          enable: true,
          opacity: 0.35,
          width: 1,
        },
        collisions: {
          enable: false,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 0.35,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 800,
          },
          value: 45,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    })
    .catch(function () {
      // 如果加载失败，安静地忽略错误，避免影响页面
    });
}

// 初始化年份显示
function initYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// 页面加载完成后统一初始化
document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initSkillProgress();
  initParticles();
  initYear();
});

