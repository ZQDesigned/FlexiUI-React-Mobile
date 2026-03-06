# FlexiUI React Mobile

English | [简体中文](./README.zh-CN.md)

FlexiUI React Mobile is a Bun-based monorepo for the FlexiUI web component system.
It includes:

- A reusable React + TypeScript component library
- A Vite example app for preview and manual verification
- Design docs and implementation notes aligned to `参数导出.md`

## Project Goals

- Keep behavior and theme values aligned with Android FlexiUI exports
- Use a custom-first implementation strategy (not MD3-base-first)
- Keep all package management and scripts on Bun
- Use CSS-in-JS for component internals (`@emotion/css`)

## Repository Layout

```text
.
├─ packages/
│  └─ flexiui-react-mobile/      # Component library package
├─ example/                      # React + Vite + TS preview app
├─ docs/                         # ADR and coverage docs
├─ 参数导出.md                    # Android-side exported parameters
└─ package.json                  # Workspace scripts
```

## Requirements

- Bun (recommended: latest stable)
- Node.js runtime compatible with Bun tooling

## Getting Started

```bash
bun install
```

Start preview app:

```bash
bun run dev
```

Build all:

```bash
bun run build
```

## Workspace Scripts

From repository root:

- `bun run dev`: run the example app (`flexiui-react-mobile-example`)
- `bun run build`: build library + example
- `bun run build:lib`: build library only
- `bun run build:example`: build example only

## Library Package

Path: `packages/flexiui-react-mobile`

Main exports:

- Root: `flexiui-react-mobile`
- Category subpath exports:
  - `flexiui-react-mobile/actions`
  - `flexiui-react-mobile/content`
  - `flexiui-react-mobile/feedback`
  - `flexiui-react-mobile/forms`
  - `flexiui-react-mobile/icons`
  - `flexiui-react-mobile/layout`
  - `flexiui-react-mobile/navigation`

### Component Groups

- `actions`: `FlexiButton`
- `content`: `FlexiText`, `FlexiIcon`, `FlexiImage`, `FlexiItem`
- `feedback`: `FlexiProgressIndicator`
- `forms`: `FlexiEditText`, `FlexiDropdownList`, `FlexiAutoCompleteText`, `FlexiInputBox`, `FlexiCheckBox`, `FlexiRadioButton`, `FlexiSwitch`, `FlexiSlider`, `FlexiChip`
- `layout`: area/root layouts, `FlexiLinearLayout`, `FlexiScroll`, `FlexiWindowInsetsLayout`
- `navigation`: `FlexiAppBar`, `FlexiAppBarLayout`, `FlexiTabChip`, `FlexiTabLayout`, `FlexiNavigationBar`, `FlexiStickyHeaderBar`
- `icons`: built-in SVG icon components (React components, not external `.svg` files)

### Theme and Tokens

- Theme factory: `createFlexiTheme`
- Token exports: `flexiLightColors`, `flexiDarkColors`, `flexiHighContrastColors`, `flexiPresetPrimaryColors`, `flexiDimensions`
- Theme presets are kept aligned to values defined in `参数导出.md`

## Example App

Path: `example`

- Stack: React + Vite + TypeScript
- Purpose: visual preview, interaction checks, and regression verification during component development

## Development Workflow

1. Update library code in `packages/flexiui-react-mobile/src`
2. Run preview app with `bun run dev`
3. Validate interactions in example pages
4. Build with `bun run build` before review/release

