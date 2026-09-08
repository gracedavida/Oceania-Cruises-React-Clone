import './careers-first.css';

import { type FormEvent, useMemo, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Check, Menu, Search, X } from 'lucide-react';

const asset = (name: string) => `/__mockup/images/${name}`;

type Role = {
  id: string;
  title: string;
  team: string;
  location: string;
  schedule: string;
  summary: string;
  tag: string;
};

const roles: Role[] = [
  {
    id: 'guest-experience-host',
    title: 'Guest Experience Host',
    team: 'Guest experience',
    location: 'At sea',
    schedule: 'Seasonal contract',
    summary: 'Create warm, memorable moments for guests from welcome to farewell.',
    tag: 'People first',
  },
  {
    id: 'executive-sous-chef',
    title: 'Executive Sous Chef',
    team: 'Culinary',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Lead a thoughtful galley team in delivering the finest small-ship dining.',
    tag: 'Culinary craft',
  },
  {
    id: 'voyage-planning-associate',
    title: 'Voyage Planning Associate',
    team: 'Shore operations',
    location: 'Miami, FL',
    schedule: 'Full-time · Hybrid',
    summary: 'Shape the details behind extraordinary itineraries, teams, and timing.',
    tag: 'Make it happen',
  },
  {
    id: 'restaurant-manager',
    title: 'Restaurant Manager',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Set the tone for service across a dining room where every detail matters.',
    tag: 'Quiet excellence',
  },
  {
    id: 'marine-operations-coordinator',
    title: 'Marine Operations Coordinator',
    team: 'Shore operations',
    location: 'Miami, FL',
    schedule: 'Full-time · On site',
    summary: 'Keep the movement behind every voyage considered, clear, and safe.',
    tag: 'Steady hands',
  },
];

const navItems = [
  { label: 'Careers', href: '#open-roles' },
  { label: 'Open roles', href: '#open-roles' },
  { label: 'Life at sea', href: '#life-at-sea' },
  { label: 'Shore teams', href: '#shore-teams' },
  { label: 'Our values', href: '#our-values' },
];

const footerGroups = [
  { title: 'For candidates', links: ['Open roles', 'Life at sea', 'How we hire', 'Benefits'] },
  { title: 'Our teams', links: ['Guest experience', 'Culinary', 'Shipboard', 'Shore operations'] },
  { title: 'Connect', links: ['Candidate support', 'Accessibility', 'Privacy', 'Guest access'] },
];

export function CareersFirst() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(roles[0].id);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('All teams');
  const [location, setLocation] = useState('All locations');
  const [toast, setToast] = useState('');
  const [formStatus, setFormStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const activeRole = roles.find((role) => role.id === activeRoleId) ?? roles[0];
  const filteredRoles = useMemo(() => {
    const term = keyword.trim().toLowerCase();
    return roles.filter((role) => {
      const matchesTerm = !term || `${role.title} ${role.team} ${role.location}`.toLowerCase().includes(term);
      const matchesCategory = category === 'All teams' || role.team === category;
      const matchesLocation = location === 'All locations' || role.location === location;
      return matchesTerm && matchesCategory && matchesLocation;
    });
  }, [category, keyword, location]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const selectRole = (role: Role) => {
    setActiveRoleId(role.id);
    notify(`${role.title} is selected for your application.`);
  };

  const handleSearch = () => {
    scrollTo('open-roles');
    notify(filteredRoles.length ? `${filteredRoles.length} open roles match your search.` : 'No roles match those filters yet.');
  };

  const handleApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('fullName') ?? '').trim();
    setSubmitting(true);
    setFormStatus('Preparing your application…');
    await new Promise((resolve) => window.setTimeout(resolve, 450));
    setFormStatus(`Thank you${name ? `, ${name}` : ''}. Your interest in ${activeRole.title} has been recorded for this presentation.`);
    form.reset();
    setSubmitting(false);
  };

  return (
    <div className="careers-first min-h-screen">
      <div className="cf-utility">
        <strong>An independent educational recreation</strong>
        <div className="cf-utility-right">
          <span>Careers, considered</span>
          <button className="cf-utility-link" type="button" onClick={() => notify('Candidate access is for this presentation only.')}>
            Candidate access
          </button>
        </div>
      </div>

      <header className="cf-brand-row">
        <button
          className="cf-menu-button"
          type="button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} strokeWidth={1.25} /> : <Menu size={21} strokeWidth={1.25} />}
        </button>
        <a className="cf-wordmark" href="#top" aria-label="Oceania Cruises careers home">
          <span className="cf-wordmark-main">Oceania</span>
          <span className="cf-wordmark-sub">Cruises</span>
          <span className="cf-wordmark-detail">Careers destination</span>
        </a>
      </header>

      <nav className={`cf-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Careers navigation">
        {navItems.map((item) => (
          <a className="cf-nav-link" href={item.href} key={item.label} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
      </nav>

      <main id="top">
        <section className="cf-hero" aria-labelledby="careers-hero-title">
          <div className="cf-hero-copy cf-reveal">
            <span className="cf-eyebrow">A career with purpose · Oceania Cruises</span>
            <h1 id="careers-hero-title">Make the journey matter.</h1>
            <p className="cf-hero-lede">
              Bring your point of view to a team that believes hospitality is a way of paying attention — to guests, to craft, and to one another.
            </p>
            <div className="cf-hero-actions">
              <button className="cf-primary" type="button" onClick={() => scrollTo('open-roles')}>
                View 18 open roles <ArrowRight size={14} />
              </button>
              <button className="cf-secondary" type="button" onClick={() => scrollTo('life-at-sea')}>
                Meet the people
              </button>
            </div>
            <p className="cf-hero-note">Shipboard · Shore operations · Culinary · Guest experience</p>
          </div>
          <div className="cf-hero-image" role="img" aria-label="A calm coastline at first light">
            <div className="cf-hero-stamp">
              <strong>18 open roles</strong>
              <span>Across shipboard and shore teams · Updated this week</span>
            </div>
          </div>
        </section>

        <section className="cf-search" aria-label="Search open roles">
          <div className="cf-search-row">
            <div className="cf-field">
              <label htmlFor="role-search">Search roles</label>
              <input
                id="role-search"
                type="search"
                placeholder="Title, team, or keyword"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
            </div>
            <div className="cf-field">
              <label htmlFor="team-filter">Team</label>
              <select id="team-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>All teams</option>
                <option>Guest experience</option>
                <option>Culinary</option>
                <option>Shore operations</option>
                <option>Food &amp; beverage</option>
              </select>
            </div>
            <div className="cf-field">
              <label htmlFor="location-filter">Location</label>
              <select id="location-filter" value={location} onChange={(event) => setLocation(event.target.value)}>
                <option>All locations</option>
                <option>At sea</option>
                <option>Miami, FL</option>
              </select>
            </div>
            <button className="cf-filter-button" type="button" onClick={handleSearch}>
              <Search size={13} /> Find roles
            </button>
          </div>
          <p className="cf-search-meta">{filteredRoles.length} roles shown · New opportunities added regularly</p>
        </section>

        <section className="cf-section cf-vacancies" id="open-roles" aria-labelledby="open-roles-title">
          <div className="cf-section-heading">
            <div>
              <span className="cf-kicker">Your next chapter</span>
              <h2 id="open-roles-title">Open roles</h2>
            </div>
            <p className="cf-heading-copy">
              The work is varied. The standard is shared. Find the place where your experience can make a visible difference.
            </p>
          </div>
          <div className="cf-vacancy-layout">
            <div className="cf-role-list" aria-label="Open positions">
              {filteredRoles.length ? filteredRoles.map((role) => (
                <button
                  className={`cf-role ${activeRoleId === role.id ? 'is-selected' : ''}`}
                  type="button"
                  key={role.id}
                  onClick={() => selectRole(role)}
                  aria-pressed={activeRoleId === role.id}
                >
                  <span>
                    <span className="cf-role-top"><span>{role.tag}</span><i /></span>
                    <strong className="cf-role-title">{role.title}</strong>
                    <span className="cf-role-meta"><span>{role.team}</span><span>{role.location}</span><span>{role.schedule}</span></span>
                  </span>
                  <ArrowRight className="cf-role-arrow" size={17} aria-hidden="true" />
                </button>
              )) : (
                <div className="cf-role" aria-live="polite">
                  <span>
                    <span className="cf-role-top"><span>Keep looking</span></span>
                    <strong className="cf-role-title">No roles found</strong>
                    <span className="cf-role-meta"><span>Try a broader search</span></span>
                  </span>
                  <Search className="cf-role-arrow" size={17} aria-hidden="true" />
                </div>
              )}
            </div>
            <aside className="cf-vacancy-aside">
              <BriefcaseBusiness size={18} color="#d9bd8d" strokeWidth={1.3} aria-hidden="true" />
              <h3>Ready when you are.</h3>
              <p>Choose a role that feels like a good fit, then tell us how you would help us make the everyday extraordinary.</p>
              <div className="cf-aside-rule" />
              <div className="cf-aside-stat"><strong>4</strong><span>disciplines hiring now</span></div>
              <button className="cf-aside-link" type="button" onClick={() => scrollTo('apply-now')}>
                Apply to {activeRole.title} <ArrowRight size={13} />
              </button>
            </aside>
          </div>
        </section>

        <section className="cf-section cf-culture" id="life-at-sea" aria-labelledby="life-title">
          <div className="cf-culture-art" role="img" aria-label="Blue water and distant shore">
            <div className="cf-culture-label">
              <strong>Room to grow</strong>
              <span>Built into the journey</span>
            </div>
          </div>
          <div className="cf-culture-copy">
            <span className="cf-kicker">More than a workplace</span>
            <h2 id="life-title">Bring your whole self aboard.</h2>
            <p>
              We are a collection of hosts, makers, navigators, and listeners. Some of us work at sea; some keep the shore team moving. What connects us is a shared belief that care is a craft, not a script.
            </p>
            <div className="cf-principles" id="our-values">
              <div className="cf-principle"><strong>Be present</strong><span>Notice what guests and teammates need next.</span></div>
              <div className="cf-principle"><strong>Stay curious</strong><span>Keep learning from every port, plate, and person.</span></div>
              <div className="cf-principle"><strong>Raise the bar</strong><span>Make thoughtful choices when no one is watching.</span></div>
            </div>
          </div>
        </section>

        <section className="cf-section cf-people" id="shore-teams" aria-labelledby="people-title">
          <div className="cf-section-heading">
            <div>
              <span className="cf-kicker">The people behind the welcome</span>
              <h2 id="people-title">Different roles.<br />One rhythm.</h2>
            </div>
            <p className="cf-heading-copy">A great guest experience is never the work of one department. It is the handoff between many good people.</p>
          </div>
          <div className="cf-people-grid">
            <article className="cf-people-card">
              <img src={asset('destination-greece.jpg')} alt="" />
              <div className="cf-people-card-content">
                <small>Hospitality</small>
                <h3>Make someone feel expected.</h3>
                <p>Guest experience and hotel teams create the warmth guests remember long after the details blur.</p>
              </div>
            </article>
            <article className="cf-people-card">
              <img src={asset('destination-japan.jpg')} alt="" />
              <div className="cf-people-card-content">
                <small>Culinary</small>
                <h3>Let the ingredient speak.</h3>
                <p>Our kitchens are built around respect for craft and the joy of a table well considered.</p>
              </div>
            </article>
            <article className="cf-people-card">
              <img src={asset('destination-nordic.jpg')} alt="" />
              <div className="cf-people-card-content">
                <small>Operations</small>
                <h3>Keep the promise moving.</h3>
                <p>Onboard and ashore, steady teams make ambitious journeys feel effortless.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="cf-section cf-quote" aria-label="Team member quote">
          <div>
            <span className="cf-kicker">A note from the team</span>
            <h2>The details<br />are the culture.</h2>
          </div>
          <div>
            <span className="cf-quote-mark">“</span>
            <p className="cf-quote-text">I came for the sea and stayed for the standard. People here notice the small things — and they notice when you are ready for more.</p>
            <p className="cf-quote-attribution">Marisol R. · Guest Services Manager · 7 years with Oceania</p>
          </div>
        </section>

        <section className="cf-section cf-apply" id="apply-now" aria-labelledby="apply-title">
          <div className="cf-apply-copy">
            <span className="cf-kicker">Start a conversation</span>
            <h2 id="apply-title">A good next step is still a step.</h2>
            <p>Share a little about yourself and the team will help find the right place to begin. You do not need to have every answer before you apply.</p>
            <div className="cf-apply-detail">
              <span className="cf-detail-number">01</span>
              <span className="cf-detail-copy"><strong>Tell us your story</strong><span>A few details are enough for this first hello.</span></span>
            </div>
            <div className="cf-apply-detail">
              <span className="cf-detail-number">02</span>
              <span className="cf-detail-copy"><strong>Meet your future team</strong><span>We make space for a real conversation.</span></span>
            </div>
          </div>
          <form className="cf-apply-form" onSubmit={handleApplication}>
            <span className="cf-kicker">Apply now</span>
            <h3>Put your name in the room.</h3>
            <div className="cf-form-grid">
              <label className="cf-form-field">
                <span>Full name</span>
                <input name="fullName" type="text" placeholder="Your full name" required />
              </label>
              <label className="cf-form-field">
                <span>Email address</span>
                <input name="email" type="email" placeholder="you@example.com" required />
              </label>
              <label className="cf-form-field full">
                <span>Role of interest</span>
                <select name="position" value={activeRole.id} onChange={(event) => setActiveRoleId(event.target.value)}>
                  {roles.map((role) => <option value={role.id} key={role.id}>{role.title}</option>)}
                </select>
              </label>
              <label className="cf-form-field full">
                <span>What would you bring?</span>
                <textarea name="note" placeholder="A sentence or two about your experience, point of view, or what you are curious about." />
              </label>
            </div>
            <button className="cf-primary cf-submit" type="submit" disabled={submitting}>
              {submitting ? 'Preparing application…' : 'Send my interest'} <ArrowRight size={14} />
            </button>
            {formStatus && <p className="cf-form-status" role="status">{formStatus}</p>}
          </form>
        </section>
      </main>

      <footer className="cf-footer">
        <div className="cf-footer-top">
          <div className="cf-footer-brand">
            Oceania Cruises
            <small>A fictional, educational recreation inspired by the language of luxury travel. Not affiliated with any cruise line.</small>
          </div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => (
                <button type="button" key={link} onClick={() => notify(`${link} is part of this presentation.`)}>{link}</button>
              ))}
            </div>
          ))}
        </div>
        <div className="cf-footer-bottom">
          <span>© 2025 Oceania Cruises · Educational recreation</span>
          <span><Check size={12} aria-hidden="true" /> Designed for people who care about the details</span>
        </div>
      </footer>

      {toast && <div className="cf-toast" role="status">{toast}</div>}
    </div>
  );
}