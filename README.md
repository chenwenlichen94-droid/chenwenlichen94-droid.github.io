# 个人简历网站（科技感 + 可爱风）— 可直接部署到 GitHub Pages

你现在拿到的是一个**纯静态网站**（HTML + CSS + JavaScript），支持直接打开运行，也支持部署到 GitHub Pages 生成公开网址。

## 项目结构（按你的要求）

```
.
├─ index.html
├─ css/
│  ├─ style.css              # 自定义组件样式（不使用 @apply）
│  └─ styles.css             # 旧文件（可忽略/可删）
├─ js/
│  ├─ script.js              # 交互脚本：滚动/复制/粒子/高亮
│  └─ main.js                # 旧文件（可忽略/可删）
└─ assets/
   └─ images/
      ├─ avatar-placeholder.svg
      ├─ project-1-placeholder.svg
      ├─ project-2-placeholder.svg
      ├─ project-3-placeholder.svg
      └─ wechat-qr-placeholder.svg
```

> 提示：`styles.css` / `main.js` 是你工作区里原先存在的旧版本文件；现在页面已经改为使用 `css/style.css` + `js/script.js`。

## 内容替换指南（新手友好）

### 1) 替换名字/身份/简介
- 打开 `index.html`
- 搜索并替换这些占位符：
  - `[你的邮箱]`
  - `[你的微信号]`
  - `你的名字 / 昵称`
  - `请填写你的城市`
  - 各模块里 `XX` / `XXX` 这类示例文本

### 2) 替换头像与图片
把你的图片放到 `assets/images/`，然后替换 `index.html` 里对应 `src`：
- **头像**：将你的头像命名为 `avatar.png`（或任意名），并把
  - `./assets/images/avatar-placeholder.svg`
  替换为
  - `./assets/images/avatar.png`
- **项目封面**：同理替换
  - `project-1/2/3-placeholder.svg` → 你的项目截图/海报
- **微信二维码**：
  - 将图片命名为 `wechat-qr.png`
  - 把 `./assets/images/wechat-qr-placeholder.svg` 改为 `./assets/images/wechat-qr.png`

### 3) 替换项目链接
在 `index.html` 的「项目经历」卡片里替换：
- `https://github.com/your-name/your-project` → 你的仓库地址
- `href="#"` → 你的详情页/作品链接（没有就先留着）

### 4) 替换社媒平台
在 `index.html` 的「联系方式」区域替换：
- 抖音 / B站 / 小红书 的 `href="#"` → 你的主页链接

## 功能说明（你后续改起来更轻松）

- **平滑滚动**：`js/script.js` 中 `smoothScrollToHash()` 会计算固定导航高度，防止滚动后标题被遮挡。
- **当前章节高亮**：滚动时会给顶部导航的当前链接加上 `.nav-link-active`。
- **点击复制**：带 `data-copy="..."` 的按钮/链接会复制对应文本（邮箱/微信）。
- **粒子背景**：使用 `tsparticles` CDN（轻量配置，控制粒子数量与 FPS）。

## GitHub Pages 部署步骤（新手版）

### A. 用 GitHub 网页端直接部署（最简单）
1. 打开 GitHub，新建一个仓库（Repository），例如：`my-resume-site`
2. 把这些文件上传到仓库根目录：
   - `index.html`
   - `css/`、`js/`、`assets/`
3. 进入仓库 **Settings** → **Pages**
4. 在 **Build and deployment**：
   - Source 选择 **Deploy from a branch**
   - Branch 选择 **main**（或 master）和 **/(root)**
   - 点击 **Save**
5. 等 1-3 分钟，页面会给你一个公开网址（形如 `https://你的用户名.github.io/仓库名/`）

### B. 仓库名为用户名（可得到更短网址）
如果你把仓库命名为 `你的用户名.github.io`，并把文件放在根目录：
- GitHub Pages 通常会变成：`https://你的用户名.github.io/`

## 常见问题

- **页面打开没样式？**
  - 确认 `index.html` 里引用的是 `./css/style.css`，文件确实存在。
- **图片不显示？**
  - 确认图片路径在 `assets/images/`，文件名大小写一致。
- **复制功能在本地 file:// 打开不生效？**
  - 少数浏览器对 `file://` 的剪贴板限制更严格。部署到 GitHub Pages（https）后一定可用；或者本地用 Live Server 之类的方式打开。

