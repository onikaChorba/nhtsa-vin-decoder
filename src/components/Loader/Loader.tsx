import styles from './Loader.module.css';

interface LoaderProps {
  text?: string;
}

const Loader = ({ text = "Завантаження..." }: LoaderProps) => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.spinner}></div>
      {text && <span className={styles.loaderText}>{text}</span>}
    </div>
  );
};

export { Loader };