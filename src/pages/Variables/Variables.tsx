import { Loader } from '@/components';
import { fetchVariables } from '@/api';
import { Link } from 'react-router-dom';
import styles from './Variables.module.css';
import { type VehicleVariable } from '@/types';
import { useEffect, useState, useMemo } from 'react';

const ITEMS_PER_PAGE = 12;

const VariablesPage = () => {
  const [variables, setVariables] = useState<VehicleVariable[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const { currentItems, totalPages } = useMemo(() => {
    const lastIndex = currentPage * ITEMS_PER_PAGE;
    const firstIndex = lastIndex - ITEMS_PER_PAGE;
    return {
      currentItems: variables.slice(firstIndex, lastIndex),
      totalPages: Math.ceil(variables.length / ITEMS_PER_PAGE)
    };
  }, [variables, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {currentItems.map((v) => (
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

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageBtn}
          >
            ←
          </button>

          <span className={styles.pageInfo}>
            Сторінка <strong>{currentPage}</strong> з {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageBtn}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export { VariablesPage };