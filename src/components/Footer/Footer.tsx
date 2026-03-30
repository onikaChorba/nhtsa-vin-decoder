import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        © {new Date().getFullYear()} VIN Decoder App
      </div>
      <div className={styles.apiLink}>
        Дані надані
        <a
          href="https://vpic.nhtsa.dot.gov/api/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NHTSA vPIC API
        </a>
      </div>
    </footer>
  )
}

export { Footer };