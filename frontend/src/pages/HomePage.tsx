import { Card } from '../shared/ui/Card';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="stack">
      <Section title={t('home.hero.title')} description={t('home.hero.description')}>
        <div className="grid grid-2">
          <Card>
            <h3>{t('home.section.getStarted.title')}</h3>
            <ul className="list">
              <li>{t('home.section.getStarted.item1')}</li>
              <li>{t('home.section.getStarted.item2')}</li>
              <li>{t('home.section.getStarted.item3')}</li>
            </ul>
          </Card>
          <Card>
            <h3>{t('home.section.submit.title')}</h3>
            <ul className="list">
              <li>{t('home.section.submit.item1')}</li>
              <li>{t('home.section.submit.item2')}</li>
              <li>{t('home.section.submit.item3')}</li>
            </ul>
          </Card>
          <Card>
            <h3>{t('home.section.feedback.title')}</h3>
            <ul className="list">
              <li>{t('home.section.feedback.item1')}</li>
              <li>{t('home.section.feedback.item2')}</li>
              <li>{t('home.section.feedback.item3')}</li>
            </ul>
          </Card>
          <Card>
            <h3>{t('home.section.help.title')}</h3>
            <p>{t('home.section.help.text')}</p>
          </Card>
        </div>
      </Section>
    </div>
  );
};
