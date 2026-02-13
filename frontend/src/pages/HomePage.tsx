import { Card } from '../shared/ui/Card';
import { useTranslation } from '../shared/lang/translations';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="stack">
      <section className="section home-landing">
        <div className="home-hero-panel">
          <div className="home-hero-copy">
            <p className="home-kicker">{t('app.chip')}</p>
            <h1 className="home-hero-title">{t('home.hero.title')}</h1>
            <p className="home-hero-description">{t('home.hero.description')}</p>
            <div className="home-hero-actions">
              <Link className="btn btn-primary" to="/create">
                {t('nav.newComplaint')}
              </Link>
              <Link className="btn btn-secondary" to="/my-complaints">
                {t('nav.myComplaints')}
              </Link>
            </div>
          </div>
          <div className="home-hero-graphic" aria-hidden="true">
            <div className="home-orb home-orb-one" />
            <div className="home-orb home-orb-two" />
            <div className="home-flow-item">
              <span>01</span>
              <p>{t('home.section.getStarted.title')}</p>
            </div>
            <div className="home-flow-item">
              <span>02</span>
              <p>{t('home.section.submit.title')}</p>
            </div>
            <div className="home-flow-item">
              <span>03</span>
              <p>{t('home.section.feedback.title')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          <Card className="home-feature-card">
            <h3>{t('home.section.getStarted.title')}</h3>
            <ul className="list">
              <li>{t('home.section.getStarted.item1')}</li>
              <li>{t('home.section.getStarted.item2')}</li>
              <li>{t('home.section.getStarted.item3')}</li>
            </ul>
          </Card>
          <Card className="home-feature-card">
            <h3>{t('home.section.submit.title')}</h3>
            <ul className="list">
              <li>{t('home.section.submit.item1')}</li>
              <li>{t('home.section.submit.item2')}</li>
              <li>{t('home.section.submit.item3')}</li>
            </ul>
          </Card>
          <Card className="home-feature-card">
            <h3>{t('home.section.feedback.title')}</h3>
            <ul className="list">
              <li>{t('home.section.feedback.item1')}</li>
              <li>{t('home.section.feedback.item2')}</li>
              <li>{t('home.section.feedback.item3')}</li>
            </ul>
          </Card>
          <Card className="home-feature-card">
            <h3>{t('home.section.help.title')}</h3>
            <p>{t('home.section.help.text')}</p>
          </Card>
        </div>
      </section>
    </div>
  );
};
