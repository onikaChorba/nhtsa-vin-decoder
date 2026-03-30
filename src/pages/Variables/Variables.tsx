import { Loader } from '@/components';
import { fetchVariables } from '@/api';
import { Link } from 'react-router-dom';
import styles from './Variables.module.css';
import { useEffect, useState } from 'react';
import { type VehicleVariable } from '@/types';


const VariablesPage = () => {
  const [variables, setVariables] = useState<VehicleVariable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getVars = async () => {
      try {
        const data = await fetchVariables();
        setVariables(data);
      } catch (err) {
        setError('Не вдалося завантажити список змінних');
      } finally {
        setLoading(false);
      }
    };
    getVars();
  }, []);

  if (loading) {
    return (
      <Loader text='Завантаження специфікацій...' />
    );
  }

  if (error) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', color: 'var(--error)' }}>
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Змінні автомобіля</h1>
        <p className={styles.description}>
          Повний довідник параметрів, які доступні для розшифровки через vPIC API.
        </p>
      </div>

      <div className={styles.grid}>
        {variables.map((v) => (
          <Link
            to={`/variables/${v.ID}`}
            key={v.ID}
            className={styles.card}
          >
            <div className={styles.cardId}>ID: {v.ID}</div>
            <h3 className={styles.cardName}>{v.Name}</h3>
            <div
              className={styles.cardDesc}
              dangerouslySetInnerHTML={{
                __html: v.Description.length > 110
                  ? v.Description.substring(0, 110) + '...'
                  : v.Description
              }}
            />
            <span className={styles.readMore}>Переглянути деталі →</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export { VariablesPage };