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
    const cleanVin = targetVin.trim();
    if (!cleanVin) return setError('Поле не може бути порожнім');
    setError('');

    try {
      const data = await fetchVinData(cleanVin);
      setApiMessage(data.Message);

      const filtered = data.Results.filter((r: VinResult) =>
        r.Value && r.Value !== 'null' && r.Value.trim() !== ""
      );
      setResults(filtered);

      setVin('');

      const newHistory = [cleanVin, ...history.filter(h => h !== cleanVin)].slice(0, 3);
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
          {error && (
            <div className={styles.errorBadge}>
              <span className={styles.icon}>⚠️</span> {error}
            </div>
          )}

          {!error && apiMessage && (
            <div className={`${styles.apiStatus} ${apiMessage.includes('successfully') ? styles.success : ''}`}>
              {apiMessage.includes('successfully') ? '✅ Дані отримано' : `Статус: ${apiMessage}`}
            </div>
          )}
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

          <div className={styles.tableContainer}>
            {results.length > 0 ? (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Параметр</th>
                    <th>Значення</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item, idx) => (
                    <tr key={idx}>
                      <td className={styles.paramName}>{item.Variable}</td>
                      <td className={styles.paramValue}>
                        {item.Value && item.Value.trim() !== "" ? (
                          item.Value
                        ) : (
                          <span className={styles.empty}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={styles.emptyState}>
                <p>Введіть VIN-код для отримання специфікації</p>
              </div>
            )}
          </div>
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