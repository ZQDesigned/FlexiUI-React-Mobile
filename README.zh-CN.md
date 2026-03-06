# FlexiUI React Mobile

[English](./README.md) | 简体中文

FlexiUI React Mobile 是一个基于 Bun 的 FlexiUI Web 组件仓库，包含：

- 可复用的 React + TypeScript 组件库
- 用于预览与人工验证的 Vite 示例应用
- 与 `参数导出.md` 对齐的设计与实现文档

## 项目目标

- 行为与主题数值尽量对齐 Android FlexiUI 参数导出
- 采用 custom-first 实现策略（不是 MD3-base-first）
- 所有包管理与脚本统一使用 Bun
- 组件内部样式使用 CSS-in-JS（`@emotion/css`）

## 仓库结构

```text
.
├─ packages/
│  └─ flexiui-react-mobile/      # 组件库包
├─ example/                      # React + Vite + TS 预览应用
├─ docs/                         # ADR 与覆盖率文档
├─ 参数导出.md                    # Android 侧导出参数
└─ package.json                  # Workspace 脚本
```

## 环境要求

- Bun（建议使用最新稳定版）
- 与 Bun 工具链兼容的 Node.js 运行时

## 快速开始

```bash
bun install
```

启动预览应用：

```bash
bun run dev
```

构建全部：

```bash
bun run build
```

## Workspace 脚本

在仓库根目录执行：

- `bun run dev`：运行示例应用（`flexiui-react-mobile-example`）
- `bun run build`：构建组件库 + 示例应用
- `bun run build:lib`：仅构建组件库
- `bun run build:example`：仅构建示例应用

## 组件库包

路径：`packages/flexiui-react-mobile`

主要导出：

- 根导出：`flexiui-react-mobile`
- 分类子路径导出：
  - `flexiui-react-mobile/actions`
  - `flexiui-react-mobile/content`
  - `flexiui-react-mobile/feedback`
  - `flexiui-react-mobile/forms`
  - `flexiui-react-mobile/icons`
  - `flexiui-react-mobile/layout`
  - `flexiui-react-mobile/navigation`

### 组件分组

- `actions`：`FlexiButton`
- `content`：`FlexiText`、`FlexiIcon`、`FlexiImage`、`FlexiItem`
- `feedback`：`FlexiProgressIndicator`
- `forms`：`FlexiEditText`、`FlexiDropdownList`、`FlexiAutoCompleteText`、`FlexiInputBox`、`FlexiCheckBox`、`FlexiRadioButton`、`FlexiSwitch`、`FlexiSlider`、`FlexiChip`
- `layout`：area/root layouts、`FlexiLinearLayout`、`FlexiScroll`、`FlexiWindowInsetsLayout`
- `navigation`：`FlexiAppBar`、`FlexiAppBarLayout`、`FlexiTabChip`、`FlexiTabLayout`、`FlexiNavigationBar`、`FlexiStickyHeaderBar`
- `icons`：内置 SVG 图标组件（React 组件形式，不导出外部 `.svg` 文件）

### 主题与 Token

- 主题工厂：`createFlexiTheme`
- Token 导出：`flexiLightColors`、`flexiDarkColors`、`flexiHighContrastColors`、`flexiPresetPrimaryColors`、`flexiDimensions`
- 主题预置颜色与 `参数导出.md` 中定义值保持对齐

## 示例应用

路径：`example`

- 技术栈：React + Vite + TypeScript
- 用途：组件视觉预览、交互检查与开发期回归验证

## 开发流程

1. 在 `packages/flexiui-react-mobile/src` 修改组件库代码
2. 用 `bun run dev` 启动示例应用联调
3. 在示例页面验证交互行为
4. 提交评审前执行 `bun run build`

