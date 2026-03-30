import { Loader } from '@/components';
import { fetchVariables } from '@/api';
import { useEffect, useState } from 'react';
import { type VehicleVariable } from '@/types';
import styles from './VariableDetail.module.css';
import { useParams, useNavigate } from 'react-router-dom';

const VariableDetail = () => {
  const { variableId } = useParams();
  const navigate = useNavigate();
  const [variable, setVariable] = useState<VehicleVariable | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetail = async () => {
      try {
        const allVars = await fetchVariables();
        const found = allVars.find((v: VehicleVariable) => v.ID === Number(variableId));
        setVariable(found || null);
      } catch (error) {
        console.error("Помилка завантаження:", error);
      } finally {
        setLoading(false);
      }
    };
    getDetail();
  }, [variableId]);

  if (loading) return (
    <div className={styles.container}>
      <Loader text='Завантаження деталей...' />
    </div>
  );

  if (!variable) return (
    <div className={styles.container}>
      <div className={styles.errorState}>
        <h2>Змінну не знайдено</h2>
        <button className={styles.backButton} onClick={() => navigate('/variables')}>
          <span className={styles.backIcon}>←</span> Повернутися до списку
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <span className={styles.backIcon}>←</span> Назад
      </button>

      <article className={styles.contentCard}>
        <header className={styles.cardHeader}>
          <span className={styles.idBadge}>ID: {variable.ID}</span>
          <h1 className={styles.title}>{variable.Name}</h1>
          <code className={styles.systemName}>System Name: {variable.Name.replace(/\s+/g, '_')}</code>
        </header>

        <div className={styles.divider} />

        <div className={styles.descriptionWrapper}>
          {variable.Description ? (
            <div dangerouslySetInnerHTML={{ __html: variable.Description }} />
          ) : (
            <p className={styles.noDescription}>Опис для цієї змінної відсутній у базі даних NHTSA.</p>
          )}
        </div>
      </article>
    </div>
  );
};

export { VariableDetail };