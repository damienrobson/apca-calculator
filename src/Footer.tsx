import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.navLinks}>
          <p className={styles.navLink}>
            Created by{" "}
            <a
              href="https://damienrobson.co.uk"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Damien Robson
            </a>
          </p>

          <p className={styles.navLink}>
            Colour Swatch Icon by{" "}
            <a
              href="https://icons8.com"
              rel="noopener noreferrer"
              className={styles.link}
            >
              icons8
            </a>
          </p>
          <p className={styles.navLink}>
            <a
              href="https://ko-fi.com/damienrobson"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Useful? Buy me a coffee!
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
