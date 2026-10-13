import styles from "./Explanation.module.css";

export default function Explanation() {
  return (
    <section
      aria-labelledby="apca-explanation-heading"
      className={styles.container}
    >
      <details className={styles.details} open>
        <summary id="apca-explanation-heading" className={styles.summary}>
          <span className={styles.title}>Disclaimer</span>
          <span className={styles.chevron} aria-hidden="true" />
        </summary>

        <div className={styles.content}>
          <p className={styles.description}>
            This APCA calculator is provided for informational and preliminary
            design guidance only. While it uses the latest perceptual contrast
            metrics to help evaluate text readability, final accessibility
            compliance should always be verified through comprehensive human
            evaluation, user testing, and adherence to your applicable regional
            accessibility standards (such as WCAG guidelines). The developer
            assumes no liability for accessibility audit results or compliance
            outcomes.
          </p>
        </div>
      </details>

      <details className={styles.details}>
        <summary id="apca-explanation-heading" className={styles.summary}>
          <span className={styles.title}>Why did you build this?</span>
          <span className={styles.chevron} aria-hidden="true" />
        </summary>

        <div className={styles.content}>
          <p className={styles.description}>
            Simple, really. The calculators that were already available didn't
            meet my needs: they felt overly complex or didn't give me enough
            granularity. So I built this one.
          </p>
        </div>
      </details>

      <details className={styles.details}>
        <summary id="apca-explanation-heading" className={styles.summary}>
          <span className={styles.title}>What do these results mean?</span>
          <span className={styles.chevron} aria-hidden="true" />
        </summary>

        <div className={styles.content}>
          <p className={styles.description}>
            <strong>APCA (Advanced Perceptual Contrast Algorithm)</strong> is
            the modern standard for contrast scoring in WCAG 3. It factors in
            colour perception, background ambient light context, font size, and
            font weight to determine actual visual readability.
          </p>

          <h3 className={styles.subheading}>Key Metrics</h3>

          <dl className={styles.metricsList}>
            <div className={styles.metricItem}>
              <dt className={styles.term}>Lc Score (Lightness Contrast)</dt>
              <dd className={styles.definition}>
                A scale measuring perceived contrast. Higher absolute numbers
                (i.e. the number without the positive/negative sign) mean better
                visual contrast and legibility. Negative values represent light
                text on a dark background; they do not indicate issues or
                problems.
              </dd>
            </div>

            <div className={styles.metricItem}>
              <dt className={styles.term}>Min Required Lc</dt>
              <dd className={styles.definition}>
                APCA scales contrast requirements based on typography, thinner
                or smaller text requires a higher Lc score to remain legible
                than large or bold text.
              </dd>
            </div>

            <div className={styles.metricItem}>
              <dt className={styles.term}>Recommended Role</dt>
              <dd className={styles.definition}>
                Indicates safe visual tiers based on your Lc score:
              </dd>
            </div>
          </dl>

          <ul
            className={styles.tierList}
            aria-label="APCA Lc score threshold guidance"
          >
            <li className={styles.tierItem}>
              <span className={styles.tierTag}>Lc 90+</span>
              <span>Preferred for fine body text or critical reading.</span>
            </li>
            <li className={styles.tierItem}>
              <span className={styles.tierTag}>Lc 75+</span>
              <span>Minimum standard for primary body text.</span>
            </li>
            <li className={styles.tierItem}>
              <span className={styles.tierTag}>Lc 60+</span>
              <span>
                Best for larger headlines, bold subheadings, or secondary text.
              </span>
            </li>
            <li className={styles.tierItem}>
              <span className={styles.tierTag}>Lc 45+</span>
              <span>
                Suitable for large display headers or non-text UI components.
              </span>
            </li>
            <li className={styles.tierItem}>
              <span className={styles.tierTag}>Lc &lt; 45</span>
              <span>Not recommended for readable text content.</span>
            </li>
          </ul>
        </div>
      </details>
    </section>
  );
}
