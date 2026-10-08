import { useEffect, useState, type ChangeEvent } from "react";
import { isApcaAccessible, type FontWeight } from "./helpers";
import styles from "./App.module.css";
import Explanation from "./Explanation";

interface ApcaResults {
  lc: number;
  isAccessible: boolean;
  minRequiredLc?: number;
  recommendedRole?: string;
  [key: string]: unknown;
}

const FONT_WEIGHT_OPTIONS = [
  { label: "100 - Thin", value: 100 },
  { label: "200 - Extra Light", value: 200 },
  { label: "300 - Light", value: 300 },
  { label: "400 - Normal", value: 400 },
  { label: "500 - Medium", value: 500 },
  { label: "600 - Semi Bold", value: 600 },
  { label: "700 - Bold", value: 700 },
  { label: "800 - Extra Bold", value: 800 },
  { label: "900 - Black", value: 900 },
];

const PANGRAMS = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "Sphinx of black quartz, judge my vow.",
  "How vexingly quick waft zephyr discourse.",
  "Two driven jocks fax quiz speed to my nephew.",
  "Jackdaws love my big sphinx of quartz.",
  "The five boxing wizards jump quickly.",
  "Brawny gods xored pale zinc vanquished by quiet flame.",
  "Mr. Jock, TV quiz phd, bags few lynx.",
  "Cwm, fjord-bank glyphs vext quiz.",
  "Blowzy night-frumps vex'd Jack Q.",
];

function normalizeHex(value: string): string | null {
  let hex = value.trim();
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }
  if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    return hex.toUpperCase();
  }
  return null;
}

export default function App() {
  const [fg, setFg] = useState<string>("#FFF2A8");
  const [bg, setBg] = useState<string>("#0B1B3D");

  const [fgInput, setFgInput] = useState<string>("#FFF2A8");
  const [bgInput, setBgInput] = useState<string>("#0B1B3D");

  const [fontSize, setFontSize] = useState<number>(18);
  const [fontWeight, setFontWeight] = useState<number>(400);

  const [apcaResults, setApcaResults] = useState<ApcaResults | null>(null);
  const [sentence, setSentence] = useState("");

  const pickRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * PANGRAMS.length);
    setSentence(PANGRAMS[randomIndex]);
  };

  // Picks a random sentence when the component mounts / page loads
  useEffect(() => {
    const run = () => pickRandomSentence();
    run();
  }, []);

  const handleFgPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setFg(val);
    setFgInput(val);
  };

  const handleBgPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setBg(val);
    setBgInput(val);
  };

  const handleFgTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFgInput(val);

    const validHex = normalizeHex(val);
    if (validHex) {
      setFg(validHex);
    }
  };

  const handleBgTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBgInput(val);

    const validHex = normalizeHex(val);
    if (validHex) {
      setBg(validHex);
    }
  };

  useEffect(() => {
    const calculate = () => {
      const results = isApcaAccessible(
        fg,
        bg,
        fontSize,
        fontWeight as FontWeight,
      );
      setApcaResults(results as ApcaResults);
    };
    calculate();
  }, [fg, bg, fontSize, fontWeight]);

  const swapColours = () => {
    const cache = {
      fg,
      bg,
      fgInput,
      bgInput,
    };

    setFg(cache.bg);
    setBg(cache.fg);
    setFgInput(cache.bgInput);
    setBgInput(cache.fgInput);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>APCA Calculator</h1>

      <p>
        Use the controls below to select foreground and background colors, font
        size, and font weight to check APCA accessibility. Swap the selected
        colours with the Swap button.
      </p>

      <div className={styles.controlGrid}>
        <div className={styles.controlRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="foreground" className={styles.label}>
              Foreground Color
            </label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                id="foreground"
                name="foreground"
                value={fg}
                onChange={handleFgPickerChange}
                className={styles.colorPicker}
              />
              <input
                type="text"
                id="foreground-text"
                name="foreground-text"
                value={fgInput}
                onChange={handleFgTextChange}
                placeholder="#FFF2A8"
                maxLength={7}
                className={`${styles.textInput} ${styles.hexInput}`}
              />
            </div>
          </div>

          <div className={`${styles.fieldGroup} ${styles.centre}`}>
            <button
              type="button"
              onClick={swapColours}
              aria-label="Swap foreground and background colours"
            >
              Swap
            </button>
          </div>

          <div className={`${styles.fieldGroup} ${styles.end}`}>
            <label htmlFor="background" className={styles.label}>
              Background Color
            </label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                id="background"
                name="background"
                value={bg}
                onChange={handleBgPickerChange}
                className={styles.colorPicker}
              />
              <input
                type="text"
                id="background-text"
                name="background-text"
                value={bgInput}
                onChange={handleBgTextChange}
                placeholder="#0B1B3D"
                maxLength={7}
                className={`${styles.textInput} ${styles.hexInput}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.controlRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="font-size" className={styles.label}>
              Font Size (px)
            </label>
            <input
              type="number"
              id="font-size"
              name="font-size"
              min={8}
              max={120}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value) || 16)}
              className={styles.textInput}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="font-weight" className={styles.label}>
              Font Weight
            </label>
            <select
              id="font-weight"
              name="font-weight"
              value={fontWeight}
              onChange={(e) => setFontWeight(Number(e.target.value))}
              className={styles.selectInput}
            >
              {FONT_WEIGHT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className={styles.previewCard}
        style={{
          color: fg,
          backgroundColor: bg,
        }}
      >
        <p
          className={styles.previewBody}
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: fontWeight,
          }}
        >
          {sentence}
        </p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>APCA Result</h2>
          <span
            className={`${styles.badge} ${
              apcaResults?.isAccessible
                ? styles.badgeAccessible
                : styles.badgeInaccessible
            }`}
          >
            {apcaResults?.isAccessible ? "Accessible" : "Not Accessible"}
          </span>
        </div>

        <div className={styles.metricsList}>
          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Lc Score</span>
            <span className={styles.metricValuePrimary}>
              {apcaResults?.lc ?? "Unable to calculate"}
            </span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Min Required Lc</span>
            <span className={styles.metricValueSecondary}>
              {apcaResults?.minRequiredLc ?? "N/A"}
            </span>
          </div>

          <div className={styles.metricRow}>
            <span className={styles.metricLabel}>Recommended Role</span>
            <span className={styles.roleTag}>
              {apcaResults?.recommendedRole ?? "None"}
            </span>
          </div>
        </div>
      </div>

      <Explanation />
    </main>
  );
}
