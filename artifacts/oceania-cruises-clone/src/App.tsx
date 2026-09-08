import { type FormEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, BriefcaseBusiness, Check, Menu, Search, X } from 'lucide-react';
import { submitCareerApplication, type CareerApplication } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const BASE_URL = import.meta.env.BASE_URL;
const asset = (name: string) => `${BASE_URL}${name}`;
const MAX_RESUME_SIZE = 8 * 1024 * 1024;

type ToastSetter = (message: string) => void;

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
    id: 'life-guard',
    title: 'Life-Guard',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Seasonal contract',
    summary: 'Help guests feel confident, cared for, and ready to enjoy every day onboard.',
    tag: 'Guest care',
  },
  {
    id: 'room-attendant',
    title: 'Room Attendant',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Create calm, considered spaces that make every guest feel at home.',
    tag: 'Care in detail',
  },
  {
    id: 'cruise-staff',
    title: 'Cruise Staff',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Bring energy, organization, and warmth to the moments guests remember.',
    tag: 'People first',
  },
  {
    id: 'gift-shop-staff',
    title: 'Gift Shop Staff',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Seasonal contract',
    summary: 'Help guests find thoughtful keepsakes and useful essentials along the way.',
    tag: 'Guest connection',
  },
  {
    id: 'massage-therapist',
    title: 'Massage Therapist',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Create restorative experiences with skill, presence, and genuine care.',
    tag: 'Wellness',
  },
  {
    id: 'housekeeper',
    title: 'Housekeeper',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Keep the spaces behind the welcome running beautifully and reliably.',
    tag: 'Quiet excellence',
  },
  {
    id: 'child-care',
    title: 'Child Care',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Seasonal contract',
    summary: 'Give younger guests a safe, curious, and memorable time onboard.',
    tag: 'Family care',
  },
  {
    id: 'cleaner',
    title: 'Cleaner',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Take pride in the small details that keep every shared space welcoming.',
    tag: 'Make it shine',
  },
  {
    id: 'bell-staff',
    title: 'Bell Staff',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Be one of the first friendly faces guests meet and remember.',
    tag: 'Warm welcome',
  },
  {
    id: 'medical-staff',
    title: 'Medical Staff',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Bring professionalism and compassion to guest and crew wellbeing.',
    tag: 'Trusted care',
  },
  {
    id: 'retail',
    title: 'Retail',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Pair thoughtful service with a strong eye for what guests value.',
    tag: 'Curated moments',
  },
  {
    id: 'purser',
    title: 'Purser',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Bring clear communication and steady judgment to guest operations.',
    tag: 'Steady hands',
  },
  {
    id: 'chief-purser',
    title: 'Chief Purser',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Lead the onboard guest administration team with care and precision.',
    tag: 'Lead well',
  },
  {
    id: 'cruise-director',
    title: 'Cruise Director',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Shape the rhythm of the day and create a sense of belonging onboard.',
    tag: 'Set the tone',
  },
  {
    id: 'front-desk',
    title: 'Front Desk',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Make every question feel welcome and every answer feel considered.',
    tag: 'First hello',
  },
  {
    id: 'gpa-store',
    title: 'GPA Store',
    team: 'Hotel & guest service',
    location: 'At sea',
    schedule: 'Seasonal contract',
    summary: 'Keep the guest essentials moving with a helpful, organized approach.',
    tag: 'Always ready',
  },
  {
    id: 'waiter',
    title: 'Waiter',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Turn thoughtful service into a dining experience guests talk about.',
    tag: 'Table craft',
  },
  {
    id: 'chef',
    title: 'Chef',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Bring focus, technique, and curiosity to every plate.',
    tag: 'Culinary craft',
  },
  {
    id: 'executive-chef',
    title: 'Executive Chef',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Lead a kitchen culture grounded in quality, respect, and consistency.',
    tag: 'Lead with taste',
  },
  {
    id: 'sous-chef',
    title: 'Sous Chef',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Support an ambitious galley team and help every service run beautifully.',
    tag: 'Kitchen rhythm',
  },
  {
    id: 'head-waiter',
    title: 'Head Waiter',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Set a generous, precise standard for the dining room and the team.',
    tag: 'Service lead',
  },
  {
    id: 'bartender',
    title: 'Bartender',
    team: 'Food & beverage',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Create a welcoming atmosphere one thoughtful pour and conversation at a time.',
    tag: 'Good spirits',
  },
  {
    id: 'engine-storekeeper',
    title: 'Engine Storekeeper',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Keep the technical stores organized, accurate, and ready for the team.',
    tag: 'Ready stores',
  },
  {
    id: 'hotel-storekeeper',
    title: 'Hotel Storekeeper',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Make sure the right supplies reach the right teams at the right time.',
    tag: 'Make it happen',
  },
  {
    id: 'electrician',
    title: 'Electrician',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Keep the systems that support everyday life onboard safe and dependable.',
    tag: 'Power the promise',
  },
  {
    id: 'deckhand-able-seaman',
    title: 'Deckhand / Able Seaman',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Bring practical seamanship and calm teamwork to every watch.',
    tag: 'Steady hands',
  },
  {
    id: 'security-officer',
    title: 'Security Officer',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Help protect the people and spaces that make the journey possible.',
    tag: 'Keep watch',
  },
  {
    id: 'technical-support',
    title: 'Technical Support',
    team: 'Marine deck & engineering',
    location: 'At sea',
    schedule: 'Full-time · Shipboard',
    summary: 'Solve the technical details that keep crew and guest experiences moving.',
    tag: 'Make it work',
  },
];

const teamOptions = ['All teams', 'Hotel & guest service', 'Food & beverage', 'Marine deck & engineering'];

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

const applicationDetailFields = [
  'middleName', 'gender', 'dateOfBirth', 'placeOfBirth', 'height', 'weight',
  'bodyComplexion', 'hairColor', 'eyeColor', 'address', 'city', 'country',
  'postalCode', 'homePhone', 'cellPhone', 'nationality', 'religion', 'language',
  'emergencyName', 'emergencyContactAddress', 'emergencyContactNumber',
  'schoolName', 'schoolLocation', 'schoolYears', 'company', 'organization',
  'selfEmployed', 'employer', 'dateEmployed', 'workPhone', 'salaryRate',
  'workAddress', 'workCity', 'province', 'workPostalCode', 'positionHeld',
  'dutiesPerformed', 'supervisorNameTitle', 'reasonForLeaving', 'mayContactEmployer',
  'referenceName', 'referenceTitle', 'referenceCompany', 'referencePhone',
  'acknowledgement', 'authorizeInvestigation', 'truthfulness',
] as const;

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      const [, base64 = ''] = result.split(',', 2);
      if (!base64) {
        reject(new Error('Unable to read the resume.'));
        return;
      }
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Unable to read the resume.'));
    reader.readAsDataURL(file);
  });
}

function getResumeType(file: File): CareerApplication['resumeType'] | null {
  const knownTypes: Record<string, CareerApplication['resumeType']> = {
    'application/pdf': 'application/pdf',
    'application/msword': 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  if (file.type in knownTypes) return knownTypes[file.type];

  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') return 'application/pdf';
  if (extension === 'doc') return 'application/msword';
  if (extension === 'docx') {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return null;
}

function Home() {
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

  const notify: ToastSetter = (message) => {
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
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const middleName = String(formData.get('middleName') ?? '').trim();
    const name = [firstName, middleName, lastName].filter(Boolean).join(' ');
    const resume = formData.get('resume');
    if (resume instanceof File && resume.size > MAX_RESUME_SIZE) {
      setFormStatus('Please keep your resume under 8 MB.');
      return;
    }

    const hasResume = resume instanceof File && resume.size > 0;
    const resumeType = resume instanceof File && resume.size > 0 ? getResumeType(resume) : null;
    if (hasResume && !resumeType) {
      setFormStatus('Please attach a PDF, DOC, or DOCX resume, or leave the resume field blank.');
      return;
    }

    setSubmitting(true);
    setFormStatus('Sending your application securely…');

    try {
      const details = Object.fromEntries(
        applicationDetailFields
          .map((field) => {
            const value = field === 'selfEmployed'
              ? formData.get(field) === 'on' ? 'Yes' : ''
              : String(formData.get(field) ?? '').trim();
            return [field, value];
          })
          .filter(([, value]) => value),
      );
      const application: CareerApplication = {
        fullName: name,
        email: String(formData.get('email') ?? '').trim(),
        position: activeRole.title,
        phone: String(formData.get('phone') ?? '').trim(),
        note: String(formData.get('note') ?? '').trim(),
        applicationDetails: JSON.stringify(details),
        ...(hasResume && resumeType ? {
          resumeName: resume.name,
          resumeType,
          resumeData: await readFileAsBase64(resume),
          resumeSize: resume.size,
        } : {}),
      };
      await submitCareerApplication(application);
      setFormStatus(`Thank you${name ? `, ${name}` : ''}. Your application was emailed for review.`);
      form.reset();
    } catch {
      setFormStatus('We could not send your application right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
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
                View {roles.length} open roles <ArrowRight size={14} />
              </button>
              <button className="cf-secondary" type="button" onClick={() => scrollTo('life-at-sea')}>
                Meet the people
              </button>
            </div>
            <p className="cf-hero-note">Shipboard · Shore operations · Culinary · Guest experience</p>
          </div>
          <div className="cf-hero-image" role="img" aria-label="A calm coastline at first light">
            <div className="cf-hero-stamp">
              <strong>{roles.length} open roles</strong>
              <span>Across shipboard and shore teams · Updated this week</span>
            </div>
          </div>
        </section>

        <section className="cf-search" aria-label="Search open roles">
          <div className="cf-search-row">
            <div className="cf-field">
              <label htmlFor="role-search">Search roles</label>
              <input id="role-search" type="search" placeholder="Title, team, or keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
            </div>
            <div className="cf-field">
              <label htmlFor="team-filter">Team</label>
              <select id="team-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
                {teamOptions.map((team) => <option key={team}>{team}</option>)}
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
          <p className="cf-search-meta">{filteredRoles.length} of {roles.length} roles shown · New opportunities added regularly</p>
        </section>

        <section className="cf-section cf-vacancies" id="open-roles" aria-labelledby="open-roles-title">
          <div className="cf-section-heading">
            <div>
              <span className="cf-kicker">Your next chapter</span>
              <h2 id="open-roles-title">Open roles</h2>
            </div>
            <p className="cf-heading-copy">The work is varied. The standard is shared. Find the place where your experience can make a visible difference.</p>
          </div>
          <div className="cf-vacancy-layout">
            <div className="cf-role-list" aria-label="Open positions">
              {filteredRoles.length ? filteredRoles.map((role) => (
                <button className={`cf-role ${activeRoleId === role.id ? 'is-selected' : ''}`} type="button" key={role.id} onClick={() => selectRole(role)} aria-pressed={activeRoleId === role.id}>
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
              <p>{activeRole.summary}</p>
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
            <div className="cf-culture-label"><strong>Room to grow</strong><span>Built into the journey</span></div>
          </div>
          <div className="cf-culture-copy">
            <span className="cf-kicker">More than a workplace</span>
            <h2 id="life-title">Bring your whole self aboard.</h2>
            <p>We are a collection of hosts, makers, navigators, and listeners. Some of us work at sea; some keep the shore team moving. What connects us is a shared belief that care is a craft, not a script.</p>
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
            <article className="cf-people-card"><img src={asset('destination-greece.jpg')} alt="" /><div className="cf-people-card-content"><small>Hospitality</small><h3>Make someone feel expected.</h3><p>Guest experience and hotel teams create the warmth guests remember long after the details blur.</p></div></article>
            <article className="cf-people-card"><img src={asset('destination-japan.jpg')} alt="" /><div className="cf-people-card-content"><small>Culinary</small><h3>Let the ingredient speak.</h3><p>Our kitchens are built around respect for craft and the joy of a table well considered.</p></div></article>
            <article className="cf-people-card"><img src={asset('destination-nordic.jpg')} alt="" /><div className="cf-people-card-content"><small>Operations</small><h3>Keep the promise moving.</h3><p>Onboard and ashore, steady teams make ambitious journeys feel effortless.</p></div></article>
          </div>
        </section>

        <section className="cf-section cf-quote" aria-label="Team member quote">
          <div><span className="cf-kicker">A note from the team</span><h2>The details<br />are the culture.</h2></div>
          <div><span className="cf-quote-mark">“</span><p className="cf-quote-text">I came for the sea and stayed for the standard. People here notice the small things — and they notice when you are ready for more.</p><p className="cf-quote-attribution">Marisol R. · Guest Services Manager · 7 years with Oceania</p></div>
        </section>

        <section className="cf-section cf-apply" id="apply-now" aria-labelledby="apply-title">
          <div className="cf-apply-copy">
            <span className="cf-kicker">Start a conversation</span>
            <h2 id="apply-title">A good next step is still a step.</h2>
            <p>Share a little about yourself and the team will help find the right place to begin. You do not need to have every answer before you apply.</p>
            <div className="cf-apply-detail"><span className="cf-detail-number">01</span><span className="cf-detail-copy"><strong>Tell us your story</strong><span>A few details are enough for this first hello.</span></span></div>
            <div className="cf-apply-detail"><span className="cf-detail-number">02</span><span className="cf-detail-copy"><strong>Meet your future team</strong><span>We make space for a real conversation.</span></span></div>
          </div>
          <form className="cf-apply-form" onSubmit={handleApplication}>
            <span className="cf-kicker">Apply now</span>
            <h3>Put your name in the room.</h3>
            <p className="cf-form-note">First name, last name, position, email, and phone are required. Every other question is optional.</p>

            <div className="cf-form-section">
              <h4>Personal information</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field"><span>First name *</span><input name="firstName" type="text" placeholder="First name" required /></label>
                <label className="cf-form-field"><span>Last name *</span><input name="lastName" type="text" placeholder="Last name" required /></label>
                <label className="cf-form-field"><span>Middle name</span><input name="middleName" type="text" placeholder="Middle name" /></label>
                <label className="cf-form-field"><span>Position applying for *</span><select name="position" value={activeRole.id} onChange={(event) => setActiveRoleId(event.target.value)} required>{roles.map((role) => <option value={role.id} key={role.id}>{role.title}</option>)}</select></label>
                <label className="cf-form-field"><span>Email address *</span><input name="email" type="email" placeholder="you@example.com" required /></label>
                <label className="cf-form-field"><span>Phone number *</span><input name="phone" type="tel" placeholder="+1 555 000 0000" required /></label>
                <label className="cf-form-field"><span>Gender</span><input name="gender" type="text" placeholder="Optional" /></label>
                <label className="cf-form-field"><span>Date of birth</span><input name="dateOfBirth" type="date" /></label>
                <label className="cf-form-field"><span>Place of birth</span><input name="placeOfBirth" type="text" /></label>
                <label className="cf-form-field"><span>Height</span><input name="height" type="text" placeholder="Optional" /></label>
                <label className="cf-form-field"><span>Weight</span><input name="weight" type="text" placeholder="Optional" /></label>
                <label className="cf-form-field"><span>Body complexion</span><input name="bodyComplexion" type="text" /></label>
                <label className="cf-form-field"><span>Hair color</span><input name="hairColor" type="text" /></label>
                <label className="cf-form-field"><span>Eye color</span><input name="eyeColor" type="text" /></label>
                <label className="cf-form-field"><span>Nationality</span><input name="nationality" type="text" /></label>
                <label className="cf-form-field"><span>Religion</span><input name="religion" type="text" /></label>
                <label className="cf-form-field"><span>Language or dialect</span><input name="language" type="text" /></label>
                <label className="cf-form-field full"><span>Address</span><input name="address" type="text" /></label>
                <label className="cf-form-field"><span>City</span><input name="city" type="text" /></label>
                <label className="cf-form-field"><span>Country</span><input name="country" type="text" /></label>
                <label className="cf-form-field"><span>Postal code</span><input name="postalCode" type="text" /></label>
                <label className="cf-form-field"><span>Home phone</span><input name="homePhone" type="tel" /></label>
                <label className="cf-form-field"><span>Cell phone</span><input name="cellPhone" type="tel" /></label>
              </div>
            </div>

            <div className="cf-form-section">
              <h4>Emergency contact</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field"><span>Person to contact</span><input name="emergencyName" type="text" /></label>
                <label className="cf-form-field"><span>Contact number</span><input name="emergencyContactNumber" type="tel" /></label>
                <label className="cf-form-field full"><span>Contact address</span><input name="emergencyContactAddress" type="text" /></label>
              </div>
            </div>

            <div className="cf-form-section">
              <h4>Educational background</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field"><span>School name</span><input name="schoolName" type="text" /></label>
                <label className="cf-form-field"><span>Location</span><input name="schoolLocation" type="text" /></label>
                <label className="cf-form-field"><span>Year attended and years</span><input name="schoolYears" type="text" placeholder="Example: 2018–2022" /></label>
              </div>
            </div>

            <div className="cf-form-section">
              <h4>Occupation history</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field"><span>Company</span><input name="company" type="text" /></label>
                <label className="cf-form-field"><span>Organization</span><input name="organization" type="text" /></label>
                <label className="cf-checkbox-row"><input name="selfEmployed" type="checkbox" /><span>Self-employed</span></label>
                <label className="cf-form-field"><span>Employer</span><input name="employer" type="text" /></label>
                <label className="cf-form-field"><span>Date employed</span><input name="dateEmployed" type="text" placeholder="From – to" /></label>
                <label className="cf-form-field"><span>Work phone</span><input name="workPhone" type="tel" /></label>
                <label className="cf-form-field"><span>Salary rate</span><input name="salaryRate" type="text" /></label>
                <label className="cf-form-field"><span>Work address</span><input name="workAddress" type="text" /></label>
                <label className="cf-form-field"><span>Work city</span><input name="workCity" type="text" /></label>
                <label className="cf-form-field"><span>Province</span><input name="province" type="text" /></label>
                <label className="cf-form-field"><span>Postal code</span><input name="workPostalCode" type="text" /></label>
                <label className="cf-form-field"><span>Position</span><input name="positionHeld" type="text" /></label>
                <label className="cf-form-field full"><span>Duty performed</span><textarea name="dutiesPerformed" rows={2} /></label>
                <label className="cf-form-field"><span>Supervisor name and title</span><input name="supervisorNameTitle" type="text" /></label>
                <label className="cf-form-field"><span>Reason for leaving</span><input name="reasonForLeaving" type="text" /></label>
                <label className="cf-form-field"><span>May we contact them?</span><select name="mayContactEmployer" defaultValue=""><option value="">Select</option><option>Yes</option><option>No</option></select></label>
              </div>
            </div>

            <div className="cf-form-section">
              <h4>Reference</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field"><span>Name</span><input name="referenceName" type="text" /></label>
                <label className="cf-form-field"><span>Title</span><input name="referenceTitle" type="text" /></label>
                <label className="cf-form-field"><span>Company</span><input name="referenceCompany" type="text" /></label>
                <label className="cf-form-field"><span>Phone</span><input name="referencePhone" type="tel" /></label>
              </div>
            </div>

            <div className="cf-form-section">
              <h4>Supporting documents</h4>
              <div className="cf-form-grid">
                <label className="cf-form-field full"><span>Resume · PDF, DOC, or DOCX</span><input name="resume" type="file" accept=".pdf,.doc,.docx" /></label>
                <label className="cf-form-field full"><span>Anything else you would like us to know</span><textarea name="note" placeholder="Share your experience, point of view, or what you are curious about." rows={3} /></label>
              </div>
            </div>

            <div className="cf-form-section cf-acknowledgement">
              <h4>Acknowledgement &amp; authorization</h4>
              <p>I certify that all answers given here are true and complete to the best of my knowledge. I authorize investigation of all statements contained in this application as may be necessary in arriving at an employment decision. In the event of employment, I understand that false or misleading information given in my application or interview may result in discharge.</p>
              <label className="cf-checkbox-row"><input name="acknowledgement" type="checkbox" /><span>I have read and understand this acknowledgement.</span></label>
              <label className="cf-checkbox-row"><input name="authorizeInvestigation" type="checkbox" /><span>I authorize the investigation described above.</span></label>
              <label className="cf-checkbox-row"><input name="truthfulness" type="checkbox" /><span>I confirm that the information I provide is complete and accurate.</span></label>
            </div>

            <button className="cf-primary cf-submit" type="submit" disabled={submitting} data-testid="button-apply">{submitting ? 'Sending application…' : 'Send my application'} <ArrowRight size={14} /></button>
            {formStatus && <p className="cf-form-status" role="status" data-testid="text-application-message">{formStatus}</p>}
          </form>
        </section>
      </main>

      <footer className="cf-footer">
        <div className="cf-footer-top">
          <div className="cf-footer-brand">Oceania Cruises<small>A fictional, educational recreation inspired by the language of luxury travel. Not affiliated with any cruise line.</small></div>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              {group.links.map((link) => <button type="button" key={link} onClick={() => notify(`${link} is part of this presentation.`)}>{link}</button>)}
            </div>
          ))}
        </div>
        <div className="cf-footer-bottom"><span>© 2025 Oceania Cruises · Educational recreation</span><span><Check size={12} aria-hidden="true" /> Designed for people who care about the details</span></div>
      </footer>

      {toast && <div className="cf-toast" role="status">{toast}</div>}
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