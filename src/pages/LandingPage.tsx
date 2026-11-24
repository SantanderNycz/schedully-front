import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-900/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-display text-2xl text-amber-500 italic leading-none">Schedully</span>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register/owner" className="btn-primary text-sm">Create your page</Link>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6">
      <div className="max-w-6xl mx-auto py-20 sm:py-28">
        <div className="max-w-3xl animate-fade-up">
          <p className="font-mono text-xs uppercase tracking-widest text-amber-500 mb-5">
            Booking pages for service businesses
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-ink-100 leading-[1.05] mb-6">
            Your booking page,<br />
            <em className="text-amber-500">live in minutes.</em>
          </h1>
          <p className="text-ink-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
            Schedully gives your business its own page where clients pick a service,
            choose a free slot, and book themselves — while you confirm, cancel, and get
            paid from one clean dashboard. No calls, no spreadsheets.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/register/owner" className="btn-primary">Create your page →</Link>
            <Link to="/register/client" className="btn-ghost">Book an appointment</Link>
          </div>
          <p className="text-ink-500 text-xs font-mono mt-5">
            Free plan included · No credit card to start
          </p>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    n: '01',
    title: 'Create your page',
    body: 'Add your services, opening hours, and prices. Claim a public link like schedully.app/your-studio.',
  },
  {
    n: '02',
    title: 'Share your link',
    body: 'Drop it in your bio, WhatsApp, or email signature. Clients book a free slot without ever calling you.',
  },
  {
    n: '03',
    title: 'Confirm & get paid',
    body: 'Approve or decline in one tap, collect payments through Stripe, and let email reminders do the chasing.',
  },
];

function HowItWorks() {
  return (
    <section className="px-6 border-t border-ink-700">
      <div className="max-w-6xl mx-auto py-16 sm:py-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-ink-100 mb-3">
            From zero to booked in three steps
          </h2>
          <p className="text-ink-400 text-sm sm:text-base max-w-xl mb-12">
            Everything your clients need to self-serve, and everything you need to stay in control.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="card h-full">
                <span className="font-mono text-sm text-amber-500">{s.n}</span>
                <h3 className="font-display text-xl text-ink-100 mt-3 mb-2">{s.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    title: 'A page per business',
    body: 'True multi-tenant: every business gets its own branded booking page and data, fully isolated from the rest.',
  },
  {
    title: 'Roles & access',
    body: 'Owners manage services, availability, and bookings. Clients only see their own appointments.',
  },
  {
    title: 'Payments with Stripe',
    body: 'Upgrade to Pro and let Stripe handle checkout, subscriptions, and the billing portal for you.',
  },
  {
    title: 'Smart availability',
    body: 'Set weekly hours; slots are generated per service duration and never double-booked.',
  },
  {
    title: 'Email notifications',
    body: 'Clients and owners get instant confirmations and status updates — powered by transactional email.',
  },
  {
    title: 'Speaks your language',
    body: 'The whole experience ships in English, Portuguese, Spanish, French, and Mandarin.',
  },
];

function Features() {
  return (
    <section className="px-6 border-t border-ink-700 bg-ink-800/40">
      <div className="max-w-6xl mx-auto py-16 sm:py-24">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl text-ink-100 mb-3">
            Built for the way you actually work
          </h2>
          <p className="text-ink-400 text-sm sm:text-base max-w-xl mb-12">
            Practical features, not a feature list. Each one removes a step from your day.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <div className="card h-full">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                </div>
                <h3 className="font-medium text-ink-100 mb-1.5">{f.title}</h3>
                <p className="text-ink-400 text-sm leading-relaxed">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// A styled mock of the owner dashboard — not a screenshot, built from the same tokens.
function DashboardPreview() {
  return (
    <section className="px-6 border-t border-ink-700">
      <div className="max-w-6xl mx-auto py-16 sm:py-24">
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-100 mb-3">
              One dashboard for every booking
            </h2>
            <p className="text-ink-400 text-sm sm:text-base">
              See who's coming, confirm with a tap, and keep the day under control.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="rounded-xl border border-ink-700 bg-ink-800 overflow-hidden shadow-2xl">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-4 h-10 border-b border-ink-700 bg-ink-900/60">
              <span className="w-2.5 h-2.5 rounded-full bg-ink-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-ink-600" />
              <span className="ml-3 font-mono text-xs text-ink-500">schedully.app/studio-norte</span>
            </div>

            <div className="p-5 sm:p-8">
              {/* mock tabs */}
              <div className="flex gap-1 mb-6 bg-ink-900/60 border border-ink-700 rounded-lg p-1 w-fit">
                <span className="px-4 py-1.5 rounded-md text-xs font-medium bg-ink-600 text-ink-100">Bookings</span>
                <span className="px-4 py-1.5 rounded-md text-xs font-medium text-ink-400">Services</span>
                <span className="px-4 py-1.5 rounded-md text-xs font-medium text-ink-400">Availability</span>
                <span className="px-4 py-1.5 rounded-md text-xs font-medium text-ink-400">Billing</span>
              </div>

              <div className="space-y-3">
                <MockBooking day="Fri" num="24" name="Marina Alves" service="Haircut & Styling · 10:00–11:00" price="35.00" status="pending" />
                <MockBooking day="Fri" num="24" name="Tomás Ribeiro" service="Beard Trim · 11:30–12:00" price="18.00" status="confirmed" />
                <MockBooking day="Sat" num="25" name="Inês Carvalho" service="Color · 14:00–16:00" price="90.00" status="confirmed" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const MOCK_STATUS = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-400 border-green-500/20',
};

function MockBooking({
  day, num, name, service, price, status,
}: {
  day: string; num: string; name: string; service: string; price: string;
  status: keyof typeof MOCK_STATUS;
}) {
  return (
    <div className="card flex items-center gap-4 py-4">
      <div className="shrink-0 text-center bg-ink-700 rounded-lg px-3 py-2 min-w-[52px]">
        <p className="font-mono text-xs text-ink-400">{day}</p>
        <p className="font-display text-2xl text-ink-100 leading-tight">{num}</p>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-ink-100">{name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full border font-mono capitalize ${MOCK_STATUS[status]}`}>
            {status}
          </span>
        </div>
        <p className="text-ink-400 text-sm mt-0.5 truncate">{service}</p>
      </div>
      <span className="shrink-0 font-display text-lg text-amber-500">€{price}</span>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="px-6 border-t border-ink-700 bg-ink-800/40">
      <div className="max-w-3xl mx-auto py-20 sm:py-28 text-center">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-5xl text-ink-100 leading-tight mb-5">
            Start taking bookings <em className="text-amber-500">today.</em>
          </h2>
          <p className="text-ink-400 text-sm sm:text-base max-w-md mx-auto mb-8">
            Create your page, add your first service, and share the link. It takes about five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register/owner" className="btn-primary">Create your page →</Link>
            <Link to="/login" className="btn-ghost">Sign in</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ink-700 px-6">
      <div className="max-w-6xl mx-auto py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-display text-xl text-amber-500 italic">Schedully</span>
        <nav className="flex items-center gap-5 text-sm text-ink-400">
          <Link to="/login" className="hover:text-ink-100 transition-colors">Sign in</Link>
          <Link to="/register/owner" className="hover:text-ink-100 transition-colors">For businesses</Link>
          <Link to="/register/client" className="hover:text-ink-100 transition-colors">For clients</Link>
        </nav>
        <p className="font-mono text-xs text-ink-500">
          © {new Date().getFullYear()} Schedully
        </p>
      </div>
    </footer>
  );
}
