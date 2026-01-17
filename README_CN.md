<p align="center">
  <img src="src-tauri/icons/icon.png" width="128" height="128" alt="SkillPocket Logo">
</p>

<h1 align="center">SkillPocket</h1>

<p align="center">
  <strong>管理你的 Claude Skills，生成精美图标</strong>
</p>

<p align="center">
  <a href="README.md">English</a>
</p>

---

## 应用截图

<p align="center">
  <img src="screenshots/myskills.png" width="800" alt="My Skills">
  <br><em>我的 Skills - 管理所有 Claude Skills</em>
</p>

<p align="center">
  <img src="screenshots/icons.png" width="800" alt="Icons">
  <br><em>图标 - 生成和管理自定义 SVG 图标</em>
</p>

<p align="center">
  <img src="screenshots/setting.png" width="800" alt="Settings">
  <br><em>设置 - 主题、语言和数据管理</em>
</p>

---

## 功能介绍

### 📦 管理 Skills
- 自动扫描本地所有 Claude Skills
- 搜索、收藏、分类管理
- 标签系统快速筛选

### 🎨 生成图标 (特色功能!)
- 让 Claude 帮你生成 SVG 图标
- 支持多种设计风格
- 一键复制使用

### ⚙️ 个性化设置
- 亮色/暗色主题
- 中英文切换
- 数据导入导出

---

## 安装步骤

### 第一步：下载 App

| 系统 | 下载链接 |
|------|----------|
| macOS (M1/M2/M3) | [下载 .dmg](https://github.com/xmqywx/skill-pocket/releases) |
| macOS (Intel) | [下载 .dmg](https://github.com/xmqywx/skill-pocket/releases) |
| Windows | [下载 .msi](https://github.com/xmqywx/skill-pocket/releases) |

### 第二步：安装图标生成 Skill (可选但推荐)

这一步让你可以用 Claude 生成自定义图标。

```bash
cp -r skills/icon-selector ~/.claude/skills/
```

### 第三步：复制示例图标 (可选)

首次使用可以复制示例数据看看效果：

```bash
cp -r sample-data/icons ~/.claude/skill-pocket/
```

---

## 使用方法

### 管理 Skills

1. 打开 App，自动扫描你的 Skills
2. 用搜索框查找
3. 点击 ⭐ 收藏常用的
4. 添加标签分类管理

### 生成图标

> 需要先完成第二步安装 icon-selector skill

1. 打开 Claude Code
2. 告诉它你想要的图标，比如：
   - "帮我设计一套电商 App 图标，蓝色渐变风格，20 个"
   - "参考 https://dribbble.com/shots/xxx 帮我做一套图标"
3. Claude 会自动生成并保存到 SkillPocket
4. 在 App 的 **Icons** 页面查看和使用

---

## 常见问题

**Q: Skills 没有显示？**
> 确保你的 Skills 放在 `~/.claude/skills/` 或 `~/.claude/plugins/` 目录

**Q: 图标功能不工作？**
> 检查是否已安装 icon-selector skill 到 `~/.claude/skills/` 目录

**Q: 如何备份数据？**
> 设置页面 → 导出配置

---

## 从源码构建

```bash
# 需要: Node.js 18+, pnpm, Rust

git clone https://github.com/xmqywx/skill-pocket.git
cd skill-pocket
pnpm install
pnpm tauri dev      # 开发模式
pnpm tauri build    # 打包
```

---

## 相关链接

- [Claude Code Skills 官方文档](https://docs.anthropic.com/en/docs/claude-code/skills)
- [SkillsMP.com](https://skillsmp.com/) - 63,000+ Skills 市场

---

## 许可证

MIT License - 见 [LICENSE](LICENSE)

<p align="center">
  Made with ❤️ for Claude 用户
</p>
