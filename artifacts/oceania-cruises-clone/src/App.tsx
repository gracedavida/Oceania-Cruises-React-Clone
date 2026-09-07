import { type CSSProperties, type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, Bell, ChevronDown, Menu, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const BASE_URL = import.meta.env.BASE_URL;
const asset = (name: string) => `${BASE_URL}${name}`;

type ToastSetter = (message: string) => void;

const offers = [
  {
    id: 'coastal-edit',
    label: 'The seasonal edit',
    title: 'The coast, considered',
    body: 'Sunlit harbors, old stone, and days that ask nothing of you.',
    image: 'hero-coast.jpg',
  },
  {
    id: 'grand-voyage',
    label: 'Longer stays',
    title: 'Take the long way',
    body: 'A slower rhythm across three distinct seas.',
    image: 'destination-nordic.jpg',
  },
  {
    id: 'culinary',
    label: 'At the table',
    title: 'A taste of place',
    body: 'Markets, kitchens, and the stories between them.',
    image: 'destination-greece.jpg',
  },
];

const destinations = [
  { id: 'japan', region: 'Asia & the Pacific', title: 'Japan in bloom', image: 'destination-japan.jpg' },
  { id: 'nordic', region: 'Northern Europe', title: 'Fjords in soft light', image: 'destination-nordic.jpg' },
  { id: 'aegean', region: 'The Mediterranean', title: 'Aegean blue', image: 'destination-greece.jpg' },
];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [destination, setDestination] = useState('Everywhere');
  const [month, setMonth] = useState('Any month');
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  const notify: ToastSetter = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const handleFind = () => {
    notify(
      destination === 'Everywhere' && month === 'Any month'
        ? 'Showing our full collection of voyages.'
        : `Curating voyages to ${destination} for ${month.toLowerCase()}.`,
    );
  };

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    setNewsletterMessage('You’re on the list. A little inspiration is on its way.');
    setEmail('');
  };

  return (
    <div
      className="page-shell"
      style={
        {
          '--hero-image': `url("${asset('hero-coast.jpg')}")`,
        } as CSSProperties
      }
    >
      <div className="utility-bar">
        <span className="utility-link">An independent educational recreation</span>
        <div className="utility-right">
          <span>Voyage notes, sent slowly</span>
          <button
            className="utility-link"
            data-testid="button-sign-in"
            onClick={() => notify('Guest access is for this presentation only.')}
          >
            Guest access
          </button>
          <Bell size={12} strokeWidth={1.5} aria-hidden="true" />
        </div>
      </div>

      <header className="wordmark-header">
        <button
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          data-testid="button-mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} strokeWidth={1.25} /> : <Menu size={22} strokeWidth={1.25} />}
        </button>
        <a href="#top" className="wordmark" data-testid="link-home">
          <span className="wordmark-main"><span className="wordmark-mark">⌁</span>Oceania</span>
          <span className="wordmark-sub">Cruises</span>
        </a>
      </header>

      <nav className={`nav-bar ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        {['Plan your voyage', 'Destinations', 'Life onboard', 'Seasonal offers', 'Our point of view'].map((item) => (
          <a
            href={item === 'Destinations' ? '#destinations' : item === 'Seasonal offers' ? '#offers' : '#journal'}
            className="nav-link"
            key={item}
            data-testid={`link-nav-${item.toLowerCase().replaceAll(' ', '-')}`}
            onClick={() => setMenuOpen(false)}
          >
            {item}
          </a>
        ))}
      </nav>

      <main id="top">
        <section className="finder" aria-label="Find a voyage">
          <div className="finder-inner">
            <label>
              <span className="field-label">Where would you like to go?</span>
              <select
                className="field-select"
                value={destination}
                data-testid="select-destination"
                onChange={(event) => setDestination(event.target.value)}
              >
                <option>Everywhere</option>
                <option>The Mediterranean</option>
                <option>Asia &amp; the Pacific</option>
                <option>Northern Europe</option>
                <option>Alaska &amp; the Americas</option>
              </select>
            </label>
            <label>
              <span className="field-label">When would you like to go?</span>
              <select
                className="field-select"
                value={month}
                data-testid="select-month"
                onChange={(event) => setMonth(event.target.value)}
              >
                <option>Any month</option>
                <option>April 2026</option>
                <option>May 2026</option>
                <option>June 2026</option>
                <option>September 2026</option>
                <option>October 2026</option>
              </select>
            </label>
            <div>
              <button className="find-button" data-testid="button-find-cruise" onClick={handleFind}>
                Find a voyage
              </button>
              <button className="advanced-search" data-testid="button-advanced-search" onClick={() => notify('Advanced planning opens after your first selection.')}>
                Advanced search
              </button>
            </div>
          </div>
        </section>

        <section className="hero" aria-label="Featured voyage">
          <div className="hero-content reveal">
            <span className="eyebrow">Oceania, in season · September to November</span>
            <h1>Go where the light is.</h1>
            <p className="hero-copy">
              Intimate ships. Unhurried days. A considered way to see the coastlines that stay with you.
            </p>
            <div className="hero-actions">
              <button className="brass-button" data-testid="button-explore-hero" onClick={() => notify('Explore the autumn collection below.')}>
                Explore voyages
              </button>
              <a className="text-link" href="#offers" data-testid="link-view-offers">View the edit <ArrowRight size={13} /></a>
            </div>
            <p className="hero-note">Educational recreation · imagery generated for this experience</p>
          </div>
        </section>

        <section className="section offers-section" id="offers">
          <div className="section-heading">
            <div>
              <span className="section-kicker">A little more time</span>
              <h2>Featured offers</h2>
            </div>
            <p className="section-intro">Thoughtful ways to make a voyage linger — from a longer stay in port to a table set with local flavor.</p>
          </div>
          <div className="offer-grid">
            {offers.map((offer) => (
              <button
                className="offer-card"
                key={offer.id}
                data-testid={`card-offer-${offer.id}`}
                onClick={() => notify(`${offer.title} is part of the Oceania seasonal edit.`)}
              >
                <img className="offer-image" src={asset(offer.image)} alt="" />
                <div className="offer-content">
                  <span className="eyebrow">{offer.label}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.body}</p>
                  <div className="card-arrow">Read the note <ArrowRight size={13} /></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="section journal-section" id="destinations">
          <div className="section-heading">
            <div>
              <span className="section-kicker">The destination journal</span>
              <h2>Stay curious.</h2>
            </div>
            <p className="section-intro">A collection of places with enough character to reward a second look. Start anywhere.</p>
          </div>
          <div className="destination-grid">
            {destinations.map((place) => (
              <button
                className="destination-card"
                key={place.id}
                data-testid={`card-destination-${place.id}`}
                onClick={() => {
                  setDestination(place.title.split(' ')[0] === 'Japan' ? 'Asia & the Pacific' : place.title.includes('Fjord') ? 'Northern Europe' : 'The Mediterranean');
                  notify(`Destination selected: ${place.title}.`);
                }}
              >
                <img src={asset(place.image)} alt={place.title} />
                <span className="destination-label">
                  <small>{place.region}</small>
                  <h3>{place.title}</h3>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="section quote-section" id="journal">
          <div>
            <span className="section-kicker">Oceania point of view</span>
            <h2>Room to notice.</h2>
          </div>
          <div>
            <span className="quote-mark">“</span>
            <p className="quote-text">The best voyages do not fill every minute. They leave a little space for the unexpected: a late light, a local bakery, a conversation that changes the shape of a day.</p>
            <p className="quote-attribution">Our travel editors · 2025 field notes</p>
          </div>
        </section>

        <section className="section newsletter" aria-label="Newsletter signup">
          <div>
            <span className="section-kicker">The slow dispatch</span>
            <h2>Make room for somewhere new.</h2>
            <p>Occasional destination notes, seasonal routes, and the quiet pleasures of going well. No pressure, just good reasons to look at a map.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              className="newsletter-input"
              type="email"
              placeholder="Your email address"
              aria-label="Your email address"
              value={email}
              data-testid="input-newsletter-email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <button className="newsletter-submit" data-testid="button-newsletter-submit" type="submit">Keep me posted <ArrowRight size={14} /></button>
          </form>
          {newsletterMessage && <p className="newsletter-message" data-testid="text-newsletter-message">{newsletterMessage}</p>}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">Oceania Cruises<small>A fictional, educational recreation inspired by the language of luxury travel. Not affiliated with any cruise line.</small></div>
          <FooterColumn title="Plan" links={['Find a voyage', 'Our ships', 'What to pack', 'Travel notes']} onLink={notify} />
          <FooterColumn title="Explore" links={['Destinations', 'Life onboard', 'The journal', 'Seasonal offers']} onLink={notify} />
          <FooterColumn title="Connect" links={['Guest access', 'Newsletter', 'Contact the studio', 'Privacy']} onLink={notify} />
        </div>
        <div className="footer-bottom">
          <span>© 2025 Oceania Cruises · Educational recreation</span>
          <span>Designed for curious travelers</span>
        </div>
      </footer>
      {toast && <div className="toast-message" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function FooterColumn({ title, links, onLink }: { title: string; links: string[]; onLink: ToastSetter }) {
  return (
    <div>
      <h4>{title}</h4>
      {links.map((link) => (
        <button className="footer-link" key={link} data-testid={`button-footer-${link.toLowerCase().replaceAll(' ', '-')}`} onClick={() => onLink(`${link} is part of this presentation.`)}>
          {link}
        </button>
      ))}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;