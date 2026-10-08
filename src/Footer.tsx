import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.credits}>
          A pet project created by{" "}
          <a
            href="https://damienrobson.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Damien Robson (new tab)
          </a>
        </p>

        <div className={styles.navLinks}>
          <p className={styles.navLink}>
            Found this tool useful?{" "}
            <a
              href="https://ko-fi.com/damienrobson"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              Buy me a coffee! (new tab)
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
