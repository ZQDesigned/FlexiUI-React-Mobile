import { useMemo, useState } from "react";
import {
  FlexiAppBar,
  FlexiAutoCompleteText,
  FlexiButton,
  FlexiCheckBox,
  FlexiChip,
  FlexiDropdownList,
  FlexiEditText,
  FlexiInputBox,
  FlexiItem,
  FlexiNavigationBar,
  FlexiProgressIndicator,
  FlexiProvider,
  FlexiRadioButton,
  FlexiSlider,
  FlexiStickyHeaderBar,
  FlexiSwitch,
  FlexiTabChip,
  FlexiTabLayout,
  FlexiText,
  createFlexiTheme,
  type FlexiTabItem,
  type FlexiRenderStrategy,
  type FlexiThemePreset,
  type FlexiThemeVariant,
} from "flexiui-react-mobile";

const variants: FlexiThemeVariant[] = ["light", "dark", "highContrast"];
const presets: FlexiThemePreset[] = ["default", "red", "pink", "purple", "orange", "yellow", "green", "blue"];
const strategies: FlexiRenderStrategy[] = ["custom", "md3-adapter"];
const tabs: FlexiTabItem[] = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "explore", label: "Explore", icon: "🔍" },
  { key: "library", label: "Library", icon: "📚" },
  { key: "profile", label: "Profile", icon: "👤" },
];

function App() {
  const [variant, setVariant] = useState<FlexiThemeVariant>("light");
  const [preset, setPreset] = useState<FlexiThemePreset>("default");
  const [strategy, setStrategy] = useState<FlexiRenderStrategy>("custom");
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");
  const [dropdownSelection, setDropdownSelection] = useState(-1);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [switchValue, setSwitchValue] = useState(false);
  const [checkValue, setCheckValue] = useState(true);
  const [radioValue, setRadioValue] = useState("a");
  const [sliderValue, setSliderValue] = useState(30);
  const [chipChecked, setChipChecked] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [navigationIndex, setNavigationIndex] = useState(0);
  const [tabChipIndex, setTabChipIndex] = useState(-1);
  const [switcherChecked, setSwitcherChecked] = useState(false);
  const [selectorIndex, setSelectorIndex] = useState(0);
  const [mode, setMode] = useState<"editText" | "dropdownText" | "autoCompleteText">("editText");

  const theme = useMemo(() => createFlexiTheme({ variant, preset }), [variant, preset]);

  return (
    <FlexiProvider theme={theme} renderStrategy={strategy}>
      <main
        className="app"
        style={{
          background: theme.colors.colorFlexiBackgroundPrimary,
          color: theme.colors.colorFlexiTextPrimary,
        }}
      >
        <section className="panel" style={{ background: theme.colors.colorFlexiForegroundPrimary }}>
          <FlexiAppBar
            title="FlexiUI React Mobile"
            subtitle="React + Vite + TypeScript preview"
            showNavigationUpIcon={false}
            rightActions={<FlexiButton onClick={() => setCount((value) => value + 1)}>Clicks {count}</FlexiButton>}
          />
          <FlexiText>React + Vite + TypeScript preview</FlexiText>
          <FlexiText secondary>
            Current variant: {variant}, preset: {preset}, strategy: {strategy}
          </FlexiText>

          <div className="controls">
            <label>
              Variant
              <select value={variant} onChange={(event) => setVariant(event.target.value as FlexiThemeVariant)}>
                {variants.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Preset
              <select value={preset} onChange={(event) => setPreset(event.target.value as FlexiThemePreset)}>
                {presets.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Strategy
              <select value={strategy} onChange={(event) => setStrategy(event.target.value as FlexiRenderStrategy)}>
                {strategies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="demoGrid">
            <div className="demoItem">
              <FlexiText>FlexiEditText</FlexiText>
              <FlexiEditText
                placeholder="Type here..."
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <FlexiText secondary>value: {inputValue || "-"}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiInputBox</FlexiText>
              <div className="inlineItems">
                <FlexiButton onClick={() => setMode("editText")}>Edit</FlexiButton>
                <FlexiButton onClick={() => setMode("dropdownText")}>Dropdown</FlexiButton>
                <FlexiButton onClick={() => setMode("autoCompleteText")}>AutoComplete</FlexiButton>
              </div>
              <FlexiInputBox
                inputMode={mode}
                hint="Input box..."
                text={inputValue}
                onTextChange={setInputValue}
                dataSets={["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]}
                showClearTextIcon
                boxStartIcon="✎"
              />
              <FlexiText secondary>mode: {mode}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiDropdownList</FlexiText>
              <FlexiDropdownList
                placeholder="Select an option..."
                dataSets={["Alpha", "Beta", "Gamma", "Delta", "Epsilon"]}
                dropdownItemSelection={dropdownSelection}
                onSelectionChange={(index) => setDropdownSelection(index)}
                onValueChange={setDropdownValue}
                allowInputEvents
                allowRemoveItem
                shownWhenFocused
              />
              <FlexiText secondary>
                selected: {dropdownSelection}, value: {dropdownValue || "-"}
              </FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiAutoCompleteText</FlexiText>
              <FlexiAutoCompleteText
                placeholder="Type at least 2 chars..."
                dataSets={["Android", "Animation", "Compose", "Constraint", "CustomView", "Kotlin", "Material3"]}
                onValueChange={setAutoCompleteValue}
                completionThreshold={2}
                completionMatchesFromAnyPosition
                allowRemoveItem
              />
              <FlexiText secondary>value: {autoCompleteValue || "-"}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiStickyHeaderBar</FlexiText>
              <div className="stickyDemo">
                <FlexiStickyHeaderBar text="Pinned Header" icon="📌" />
                <div className="stickyContent">
                  <FlexiText secondary>Scrollable content to preview sticky header behavior.</FlexiText>
                  <FlexiText secondary>Line 1</FlexiText>
                  <FlexiText secondary>Line 2</FlexiText>
                  <FlexiText secondary>Line 3</FlexiText>
                  <FlexiText secondary>Line 4</FlexiText>
                </div>
              </div>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiSwitch</FlexiText>
              <FlexiSwitch
                checked={switchValue}
                onCheckedChange={setSwitchValue}
                label={switchValue ? "Enabled" : "Disabled"}
              />
            </div>

            <div className="demoItem">
              <FlexiText>FlexiCheckBox / FlexiRadioButton</FlexiText>
              <div className="inlineItems">
                <FlexiCheckBox checked={checkValue} onChange={(event) => setCheckValue(event.target.checked)} label="Accept" />
                <FlexiRadioButton
                  name="demo-radio"
                  checked={radioValue === "a"}
                  onChange={() => setRadioValue("a")}
                  label="Option A"
                />
                <FlexiRadioButton
                  name="demo-radio"
                  checked={radioValue === "b"}
                  onChange={() => setRadioValue("b")}
                  label="Option B"
                />
              </div>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiSlider + FlexiProgressIndicator</FlexiText>
              <FlexiSlider
                value={sliderValue}
                onValueChange={setSliderValue}
                valueLabelBehavior="alwaysVisible"
                valueLabelFormatter="{valueInt}%"
              />
              <div className="inlineItems">
                <FlexiProgressIndicator indicatorType="linear" indeterminate={false} progress={sliderValue} />
                <FlexiProgressIndicator indicatorType="circular" indeterminate={false} progress={sliderValue} />
              </div>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiChip</FlexiText>
              <div className="inlineItems">
                <FlexiChip chipAppearance="normal">Normal</FlexiChip>
                <FlexiChip chipAppearance="checkbox" checked={chipChecked} onCheckedChange={setChipChecked}>
                  Check {chipChecked ? "On" : "Off"}
                </FlexiChip>
                <FlexiChip chipAppearance="candidate" ensureMinTouchTargetSize>
                  Candidate
                </FlexiChip>
              </div>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiTabLayout</FlexiText>
              <FlexiTabLayout tabItems={tabs} tabItemSelection={tabIndex} onTabSelectionChange={(index) => setTabIndex(index)} />
              <FlexiText secondary>selected tab: {tabs[tabIndex]?.label}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiTabChip</FlexiText>
              <FlexiTabChip
                tabItems={tabs}
                tabItemSelection={tabChipIndex}
                onTabSelectionChange={(index) => setTabChipIndex(index)}
                selectionRequired={false}
              />
              <FlexiText secondary>selected chip: {tabChipIndex >= 0 ? tabs[tabChipIndex]?.label : "none"}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiNavigationBar</FlexiText>
              <FlexiNavigationBar
                tabItems={tabs}
                tabItemSelection={navigationIndex}
                onTabSelectionChange={(index) => setNavigationIndex(index)}
              />
              <FlexiText secondary>selected nav: {tabs[navigationIndex]?.label}</FlexiText>
            </div>

            <div className="demoItem">
              <FlexiText>FlexiItem</FlexiText>
              <div className="itemStack">
                <FlexiItem title="Normal Item" subtitle="Tap to toggle selected style" logoImage="📦" />
                <FlexiItem
                  itemStyle="switcher"
                  title="Switcher Item"
                  subtitle="Internal switch state"
                  logoImage="⚙️"
                  checked={switcherChecked}
                  onCheckedChange={setSwitcherChecked}
                />
                <FlexiItem
                  itemStyle="selector"
                  title="Selector Item"
                  subtitle="Choose one option"
                  logoImage="🧭"
                  dataSets={["Alpha", "Beta", "Gamma"]}
                  dropdownItemSelection={selectorIndex}
                  onSelectionChange={(index) => setSelectorIndex(index)}
                />
              </div>
              <FlexiText secondary>
                switch: {switcherChecked ? "on" : "off"}, selector: {selectorIndex}
              </FlexiText>
            </div>
          </div>
        </section>
      </main>
    </FlexiProvider>
  );
}

export default App;
