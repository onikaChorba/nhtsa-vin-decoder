import { fetchVinData } from '@/api';
import styles from './Home.module.css';
import { type VinResult } from '@/types';
import { useState, useEffect } from 'react';


const HomePage = () => {
  const [vin, setVin] = useState('');
  const [results, setResults] = useState<VinResult[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('vin_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleSearch = async (targetVin: string) => {
    if (!targetVin.trim()) return setError('Поле не може бути порожнім');
    setError('');

    try {
      const data = await fetchVinData(targetVin);
      setApiMessage(data.Message);
      const filtered = data.Results.filter((r: VinResult) => r.Value && r.Value !== 'null');
      setResults(filtered);

      const newHistory = [targetVin, ...history.filter(h => h !== targetVin)].slice(0, 3);
      setHistory(newHistory);
      localStorage.setItem('vin_history', JSON.stringify(newHistory));
    } catch {
      setError('Помилка сервера');
    }
  };

  const hasContent = history.length > 0 || results.length > 0;

  return (
    <div className={styles.container}>
      <section className={styles.searchSection}>
        <div className={styles.badge}>Fast & Accurate</div>
        <h1 className={styles.title}>
          VIN <span>Decoder</span>
        </h1>
        <p className={styles.subtitle}>
          Отримайте повну технічну специфікацію вашого автомобіля за лічені секунди.
        </p>

        <div className={styles.searchBox}>
          <input
            className={styles.input}
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Введіть VIN код..."
            maxLength={17}
          />
          <button className={styles.button} onClick={() => handleSearch(vin)}>
            Розшифрувати
          </button>
        </div>

        <div className={styles.messageContainer}>
          {error ? (
            <p className={styles.errorMessage}>{error}</p>
          ) : apiMessage ? (
            <p className={styles.apiStatus}>Статус: {apiMessage}</p>
          ) : null}
        </div>
      </section>

      {hasContent ? (
        <div className={styles.mainGrid}>
          {history.length > 0 && (
            <aside className={styles.historyCard}>
              <h3 className={styles.historyTitle}>Останні запити</h3>
              {history.map(h => (
                <div key={h} className={styles.historyItem} onClick={() => { setVin(h); handleSearch(h); }}>
                  {h}
                </div>
              ))}
            </aside>
          )}

          <section className={styles.resultsGrid}>
            {results.length > 0 ? (
              results.map((item, idx) => (
                <div key={idx} className={styles.resultCard}>
                  <div className={styles.label}>{item.Variable}</div>
                  <div className={styles.value}>{item.Value}</div>
                </div>
              ))
            ) : (
              <div className={styles.infoCard}>
                Результати з'являться тут після успішного пошуку
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className={styles.welcomeState}>
          <p>Введіть 17-значний номер кузова (VIN), щоб отримати повну технічну інформацію про транспортний засіб.</p>
        </div>
      )}
    </div>
  );
};

export { HomePage };