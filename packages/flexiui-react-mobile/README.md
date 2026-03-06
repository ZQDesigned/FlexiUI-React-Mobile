# flexiui-react-mobile

Basic structure:

- `src/tokens`: design tokens (colors, dimensions)
- `src/theme`: theme factory and types
- `src/components`: reusable UI components
- `src/foundation`: provider and rendering strategy

Notes:

- Component internal styles use CSS-in-JS (`@emotion/css`).
- Default rendering strategy is `custom`; `md3-adapter` is reserved for future adapters.

Implemented components (first batch):

- `FlexiAppBarLayout`
- `FlexiAreaCoordinatorLayout`
- `FlexiAreaConstraintLayout`
- `FlexiAreaFrameLayout`
- `FlexiAreaLinearLayout`
- `FlexiAreaRelativeLayout`
- `FlexiAppBar`
- `FlexiAutoCompleteText`
- `FlexiButton`
- `FlexiCheckBox`
- `FlexiChip`
- `FlexiDropdownList`
- `FlexiEditText`
- `FlexiIcon`
- `FlexiImage`
- `FlexiInputBox`
- `FlexiItem`
- `FlexiNavigationBar`
- `FlexiProgressIndicator`
- `FlexiRadioButton`
- `FlexiRootCoordinatorLayout`
- `FlexiRootConstraintLayout`
- `FlexiRootFrameLayout`
- `FlexiRootLinearLayout`
- `FlexiRootRelativeLayout`
- `FlexiScroll`
- `FlexiSlider`
- `FlexiStickyHeaderBar`
- `FlexiSwitch`
- `FlexiTabChip`
- `FlexiTabLayout`
- `FlexiText`
- `FlexiLinearLayout`
- `FlexiWindowInsetsLayout`
