// ============================================================
// 个人简历网站交互脚本（科技感 + 可爱风）
// 关键功能：
// - 平滑滚动（考虑固定导航高度，避免标题被遮挡）
// - 导航栏滚动样式变化 + 当前模块高亮（scrollspy）
// - 移动端汉堡菜单展开/关闭
// - 技能进度条：滚动进入技能区时再播放动画（性能友好）
// - 联系方式：邮箱/微信 一键复制（带轻提示）
// - 回到顶部按钮
// - 轻量粒子背景（tsparticles）
// ============================================================

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function getHeaderOffset() {
  var header = document.getElementById("top-nav");
  if (!header) return 0;
  // header 本身 fixed，但内部有 margin/padding；留一点余量更舒服
  return Math.round(header.getBoundingClientRect().height + 14);
}

// 中文注释：带“固定导航偏移”的平滑滚动
function smoothScrollToHash(hash) {
  var id = typeof hash === "string" ? hash : "";
  if (!id || !id.startsWith("#")) return;

  var el = document.querySelector(id);
  if (!el) return;

  var top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  if ("scrollBehavior" in document.documentElement.style) {
    window.scrollTo({ top: top, behavior: "smooth" });
  } else {
    window.scrollTo(0, top);
  }
}

function initNavbar() {
  var header = document.getElementById("top-nav");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileMenu = document.getElementById("mobile-menu");
  var backToTop = document.getElementById("back-to-top");
  if (!header) return;

  // scrollspy：只对这些模块做高亮
  var sectionSelectors = [
    "#home",
    "#about",
    "#skills",
    "#projects",
    "#experience",
    "#education",
    "#contact",
  ];

  var sections = sectionSelectors
    .map(function (sel) {
      var el = document.querySelector(sel);
      return el ? { id: sel, el: el } : null;
    })
    .filter(Boolean);

  // 只高亮桌面导航（避免移动端菜单也被加 underline）
  var desktopNav = header.querySelector("nav.md\\:flex");
  var desktopNavLinks = desktopNav
    ? desktopNav.querySelectorAll('a[href^="#"]')
    : [];

  function onScroll() {
    var scrolled = window.scrollY || window.pageYOffset || 0;

    // 导航栏滚动变色（更“科技”一点）
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

    // 回到顶部按钮显隐
    if (backToTop) {
      var show = scrolled > 260;
      backToTop.style.opacity = show ? "1" : "0.35";
      backToTop.style.pointerEvents = show ? "auto" : "none";
    }

    // 当前模块高亮（简单版：比较每个 section 的 top）
    var currentId = "#home";
    var offsetY = scrolled + getHeaderOffset() + 6;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      var top = s.el.getBoundingClientRect().top + window.scrollY;
      if (top <= offsetY) currentId = s.id;
    }

    for (var j = 0; j < desktopNavLinks.length; j++) {
      var link = desktopNavLinks[j];
      var href = link.getAttribute("href");
      if (href === currentId) link.classList.add("nav-link-active");
      else link.classList.remove("nav-link-active");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 移动端菜单展开/关闭
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    mobileMenu.addEventListener("click", function (e) {
      var t = e.target;
      if (t && t.tagName && t.tagName.toLowerCase() === "a") {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // 所有站内锚点：用 JS 平滑滚动（保证 offset）
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  for (var k = 0; k < anchorLinks.length; k++) {
    anchorLinks[k].addEventListener("click", function (e) {
      var href = this.getAttribute("href");
      if (!href || href === "#") return;
      if (!document.querySelector(href)) return;
      e.preventDefault();
      smoothScrollToHash(href);
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", function () {
      smoothScrollToHash("#home");
    });
  }
}

function initSkillProgress() {
  var section = document.getElementById("skills");
  if (!section) return;

  var bars = Array.prototype.slice.call(
    document.querySelectorAll("[data-skill-bar]")
  );
  if (!bars.length) return;

  var hasAnimated = false;

  function animateBars() {
    if (hasAnimated) return;
    hasAnimated = true;

    bars.forEach(function (bar) {
      var targetPercent = parseInt(bar.getAttribute("data-percent"), 10);
      if (isNaN(targetPercent)) targetPercent = 0;
      targetPercent = clamp(targetPercent, 0, 100);

      var current = 0;
      var step = Math.max(1, Math.round(targetPercent / 44)); // ~0.8s

      function update() {
        current += step;
        if (current > targetPercent) current = targetPercent;
        bar.style.width = current + "%";

        var card = bar.closest(".skill-card");
        var percentTextEl = card
          ? card.querySelector("[data-skill-percent]")
          : null;
        if (percentTextEl) percentTextEl.textContent = current + "%";

        if (current < targetPercent) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
    });
  }

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
      { threshold: 0.32 }
    );
    observer.observe(section);
  } else {
    animateBars();
  }
}

// 中文注释：复制到剪贴板（优先 navigator.clipboard，降级用 execCommand）
async function copyText(text) {
  if (!text) return false;

  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      // 继续走降级方案
    }
  }

  try {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    var ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (e2) {
    return false;
  }
}

function initCopyButtons() {
  var btns = document.querySelectorAll("[data-copy]");
  if (!btns.length) return;

  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", async function (e) {
      // 防止 a 标签点击跳转
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      var text = this.getAttribute("data-copy") || "";
      var ok = await copyText(text);

      // 轻量提示：按钮变色 + 文案临时变化
      var isButton = this.tagName.toLowerCase() === "button";
      var row = !isButton ? this.closest(".contact-row") : null;
      var node = isButton
        ? this
        : row
          ? row.querySelector(".copy-btn")
          : null;
      if (!node) node = this;

      var old = node.dataset.oldText || node.textContent;
      if (!node.dataset.oldText) node.dataset.oldText = old;

      node.classList.add("copied");
      node.textContent = ok ? "已复制" : "复制失败";
      window.setTimeout(function () {
        node.classList.remove("copied");
        // 恢复 icon + 文案（只恢复 button）
        if (isButton) {
          node.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
        } else {
          node.textContent = node.dataset.oldText || old;
        }
      }, 1100);
    });
  }
}

function initParticles() {
  var container = document.getElementById("particles-js");
  if (!container || !window.tsParticles) return;

  window.tsParticles
    .load("particles-js", {
      background: { color: { value: "#121226" } },
      fpsLimit: 45,
      interactivity: {
        events: { onHover: { enable: false }, resize: true },
      },
      particles: {
        color: { value: ["#7B61FF", "#FF9EE7", "#F5F5FF"] },
        links: {
          color: "#6b7280",
          distance: 110,
          enable: true,
          opacity: 0.35,
          width: 1,
        },
        collisions: { enable: false },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: 0.35,
          straight: false,
        },
        number: { density: { enable: true, area: 900 }, value: 42 },
        opacity: { value: 0.55 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
      detectRetina: true,
    })
    .catch(function () {
      // 安静失败：不影响正文
    });
}

function initYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", function () {
  initNavbar();
  initSkillProgress();
  initCopyButtons();
  initParticles();
  initYear();
});

