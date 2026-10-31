import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useInView, animate } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]
const W = 'mx-auto max-w-7xl px-5 md:px-8'
const H2 = 'font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-5xl'
const EMERGENCY = '16999' // replace with your real number

const SERVICES = [
  { n: 'Cardiology', d: 'Heart checks, ECG, echo and stress tests, with cath lab support if you need it.', t: ['Chest pain', 'High blood pressure', 'Heart failure'] },
  { n: 'Neurology', d: 'Diagnosis and long-term care for the brain, spine and nerves, backed by 3T MRI.', t: ['Migraine', 'Stroke recovery', 'Epilepsy'] },
  { n: 'Orthopedics', d: 'Joint, bone and sports injury care, from physiotherapy to replacement surgery.', t: ['Knee pain', 'Fractures', 'Back pain'] },
  { n: 'Pediatrics', d: 'Child-friendly rooms, vaccinations and growth checks from newborn to 16 years.', t: ['Vaccines', 'Fever and cough', 'Growth checks'] },
  { n: "Women's health", d: 'Antenatal care, delivery, gynecology and screening with female doctors on request.', t: ['Pregnancy', 'PCOS', 'Screening'] },
  { n: 'Dental', d: 'Cleaning, fillings, braces and implants in a calm, pain-aware setting.', t: ['Root canal', 'Braces', 'Implants'] },
  { n: 'Eye care', d: 'Vision tests, cataract surgery and retina care with same-day glasses.', t: ['Cataract', 'Glaucoma', 'Eye tests'] },
  { n: 'Diagnostics', d: 'Pathology, X-ray, CT and ultrasound under one roof, with digital reports.', t: ['Blood tests', 'CT scan', 'Ultrasound'] },
]
const DOCTORS = [
  { n: 'Dr. Farhana Rahman', s: 'Cardiology', e: 18, slot: 'Today, 4:30 PM' },
  { n: 'Dr. Tanvir Ahmed', s: 'Neurology', e: 14, slot: 'Today, 6:00 PM' },
  { n: 'Dr. Sadia Karim', s: 'Pediatrics', e: 11, slot: 'Tomorrow, 10:00 AM' },
  { n: 'Dr. Imran Hossain', s: 'Orthopedics', e: 20, slot: 'Tomorrow, 12:30 PM' },
  { n: 'Dr. Nusrat Jahan', s: "Women's health", e: 16, slot: 'Today, 5:15 PM' },
  { n: 'Dr. Rafiq Islam', s: 'Cardiology', e: 22, slot: 'Tomorrow, 9:00 AM' },
]
const PACKAGES = [
  { n: 'Essential', p: '2,500', f: ['Blood sugar and lipid profile', 'Blood pressure and BMI', 'Doctor consultation', 'Report in 24 hours'] },
  { n: 'Complete', p: '6,500', hot: true, f: ['Everything in Essential', 'ECG and chest X-ray', 'Liver and kidney tests', 'Eye and dental screening', 'Dietitian session'] },
  { n: 'Executive', p: '12,000', f: ['Everything in Complete', 'Echo and stress test', 'Abdomen ultrasound', 'Cancer marker panel', 'Priority booking for a year'] },
]
const STORIES = [
  { q: 'My father had chest pain at 2 AM. We were in the ER within ten minutes and the cardiologist was already waiting.', n: 'Shafiq M.', c: 'Son of a cardiac patient' },
  { q: 'They explained every test before doing it. For the first time I did not feel rushed in a hospital.', n: 'Rumana A.', c: 'Health check patient' },
  { q: 'Delivery went smoothly and the nurses checked on us every hour. We came home happy and well informed.', n: 'Tasnim & Rafi', c: 'New parents' },
]
const FAQ = [
  ['Do I need an appointment?', 'Walk-ins are welcome for emergencies. For specialists, booking a slot keeps your wait under 15 minutes.'],
  ['Which insurance do you accept?', 'We work with major corporate and health insurers. Bring your card and our desk will confirm cover before treatment.'],
  ['How do I get my reports?', 'Reports appear in your phone within hours and you can download them anytime. Printed copies are also available.'],
  ['Can I see a female doctor?', 'Yes. Pick a female doctor when booking, or ask the front desk and we will arrange it.'],
  ['Is parking available?', 'There is free parking for 200 cars, with wheelchair access from every entrance.'],
]
const AV = ['bg-pine-500', 'bg-coral', 'bg-pine-700', 'bg-pine-900']

/* ---------- helpers ---------- */
function Count({ to, suffix = '' }) {
  const r = useRef(null), v = useInView(r, { once: true }), [n, setN] = useState(0)
  useEffect(() => { if (!v) return; const c = animate(0, to, { duration: 1.6, ease, onUpdate: (x) => setN(Math.round(x)) }); return () => c.stop() }, [v, to])
  return <span ref={r}>{n.toLocaleString('en-IN')}{suffix}</span>
}
const Cross = ({ c = 'currentColor' }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill={c}><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" /></svg>
)

/* ---------- Nav ---------- */
function Nav() {
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const links = [['Services', '#services'], ['Doctors', '#doctors'], ['Packages', '#packages'], ['Contact', '#emergency']]
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-pine-900/10 bg-paper/85 backdrop-blur-md">
      <motion.div style={{ scaleX: w }} className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-coral" />
      <nav className={`${W} flex h-16 items-center justify-between`}>
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-bold"><span className="text-coral"><Cross c="#FF6B57" /></span>Nirog</a>
        <ul className="hidden gap-9 text-sm font-medium md:flex">{links.map(([l, h]) => <li key={l}><a href={h} className="hover:text-pine-500">{l}</a></li>)}</ul>
        <div className="flex items-center gap-2">
          <a href="#book" className="rounded-full bg-pine-900 px-5 py-2 text-sm font-medium text-paper hover:bg-pine-500">Book a visit</a>
          <button aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)} className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden">
            <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }} className="h-0.5 w-6 bg-pine-900" />
            <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }} className="h-0.5 w-6 bg-pine-900" />
          </button>
        </div>
      </nav>
      <AnimatePresence>{open && (
        <motion.ul initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden bg-paper md:hidden">
          {links.map(([l, h]) => <li key={l}><a onClick={() => setOpen(false)} href={h} className="block border-t border-pine-900/10 px-5 py-4 font-display text-xl font-semibold">{l}</a></li>)}
        </motion.ul>)}
      </AnimatePresence>
    </header>
  )
}

/* ---------- 1 Hero ---------- */
function Pulse() {
  const [bpm, setBpm] = useState(72)
  useEffect(() => { const t = setInterval(() => setBpm(70 + Math.floor(Math.random() * 7)), 1400); return () => clearInterval(t) }, [])
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[2rem] bg-pine-900 p-6 text-paper shadow-2xl md:p-8">
        <p className="text-sm text-paper/60">Heart rate</p>
        <p className="font-display text-6xl font-bold md:text-7xl"><AnimatePresence mode="popLayout"><motion.span key={bpm} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }} className="inline-block">{bpm}</motion.span></AnimatePresence><span className="ml-2 text-xl font-medium text-paper/60">bpm</span></p>
        <svg viewBox="0 0 400 120" className="mt-6 h-32 w-full" fill="none" aria-hidden="true">
          <path d="M0 60H400" stroke="#14574D" strokeWidth="1" strokeDasharray="3 6" />
          <motion.path d="M0 60H60L75 60L85 18L100 104L112 60H190L205 60L215 28L228 84L240 60H400" stroke="#FF6B57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.6 }} />
        </svg>
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease, delay: 1.2 }}
        className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 rounded-2xl bg-white p-4 shadow-xl md:-left-8 md:right-auto">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-100 font-display font-bold text-pine-700">FR</span>
        <div><p className="text-sm font-bold">Dr. Farhana Rahman</p><p className="text-xs text-pine-900/60">Next slot today, 4:30 PM</p></div>
      </motion.div>
    </div>
  )
}
function Hero() {
  const words = ['Care', 'that', 'starts', 'before', 'you', 'arrive.']
  return (
    <section id="top" className={`${W} grid items-center gap-14 pb-24 pt-28 lg:grid-cols-[1.2fr_1fr] lg:pt-36`}>
      <div>
        <h1 className="font-display text-5xl font-bold leading-[1] tracking-tight sm:text-6xl lg:text-[4.6rem]">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
              <motion.span className="inline-block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.08 * i }}>{w}</motion.span>
            </span>))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-7 max-w-md text-lg leading-relaxed text-pine-900/70">
          150 specialists, one booking, a waiting time you can count in minutes. Emergency care is open every hour of the year.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="mt-9 flex flex-wrap gap-3">
          <a href="#book" className="rounded-full bg-coral px-8 py-4 font-bold text-white transition-transform hover:-translate-y-0.5">Book an appointment</a>
          <a href="#doctors" className="rounded-full border-2 border-pine-900 px-8 py-4 font-bold hover:bg-pine-900 hover:text-paper">Find a doctor</a>
        </motion.div>
      </div>
      <Pulse />
    </section>
  )
}

/* ---------- 2 Stats ---------- */
function Stats() {
  const s = [[25, '+', 'years of care'], [150, '+', 'specialist doctors'], [240000, '', 'patients treated'], [12, ' min', 'average wait']]
  return (
    <section className="bg-pine-900 py-14 text-paper">
      <div className={`${W} grid grid-cols-2 gap-8 md:grid-cols-4`}>
        {s.map(([n, x, l]) => <div key={l}><p className="font-display text-4xl font-bold md:text-5xl"><Count to={n} suffix={x} /></p><p className="mt-1 text-paper/65">{l}</p></div>)}
      </div>
    </section>
  )
}

/* ---------- 3 Services ---------- */
function Services() {
  const [i, setI] = useState(0)
  const s = SERVICES[i]
  return (
    <section id="services" className={`${W} scroll-mt-16 py-24`}>
      <h2 className={`${H2} max-w-2xl`}>Every specialty, one building</h2>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div role="tablist" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
          {SERVICES.map((x, k) => (
            <button key={x.n} role="tab" aria-selected={i === k} onClick={() => setI(k)} className="relative shrink-0 rounded-2xl px-5 py-3.5 text-left font-display font-semibold">
              {i === k && <motion.span layoutId="svc" className="absolute inset-0 rounded-2xl bg-pine-900" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className={`relative ${i === k ? 'text-paper' : ''}`}>{x.n}</span>
            </button>))}
        </div>
        <div className="relative min-h-[300px] overflow-hidden rounded-[2rem] bg-pine-100 p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <h3 className="font-display text-3xl font-semibold md:text-4xl">{s.n}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-pine-900/75">{s.d}</p>
              <p className="mt-8 text-sm font-bold">We treat</p>
              <div className="mt-3 flex flex-wrap gap-2">{s.t.map((t) => <span key={t} className="rounded-full bg-paper px-4 py-2 text-sm font-medium">{t}</span>)}</div>
              <a href="#book" className="mt-9 inline-block rounded-full bg-pine-900 px-6 py-3 font-bold text-paper hover:bg-pine-500">Book {s.n}</a>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---------- 4 Why us ---------- */
function Why() {
  const bars = [['Nirog Health', 12, 'bg-coral'], ['Typical private hospital', 55, 'bg-pine-700'], ['Typical public hospital', 120, 'bg-pine-900/30']]
  const pts = [['Doctors on time', 'Slots are real. If your doctor runs late, we tell you before you leave home.'], ['Clear prices', 'You get an estimate before any test or procedure. No surprise bills.'], ['One digital record', 'Reports, prescriptions and scans live in one place you can share with any doctor.']]
  return (
    <section className="bg-pine-50 py-24">
      <div className={`${W} grid gap-14 lg:grid-cols-2`}>
        <div>
          <h2 className={H2}>Less waiting. More time with your doctor.</h2>
          <ul className="mt-10 space-y-7">{pts.map(([t, d]) => <li key={t} className="border-l-4 border-coral pl-5"><h3 className="font-display text-xl font-semibold">{t}</h3><p className="mt-1 max-w-md text-pine-900/70">{d}</p></li>)}</ul>
        </div>
        <div className="self-center rounded-[2rem] bg-white p-7 shadow-sm md:p-10">
          <p className="font-display text-xl font-semibold">Average minutes in the waiting room</p>
          <div className="mt-8 space-y-6">
            {bars.map(([l, m, c]) => (
              <div key={l}><div className="mb-2 flex justify-between text-sm font-medium"><span>{l}</span><span>{m} min</span></div>
                <div className="h-4 rounded-full bg-pine-50"><motion.div className={`h-4 rounded-full ${c}`} initial={{ width: 0 }} whileInView={{ width: `${(m / 120) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease }} /></div></div>))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- 5 Doctors ---------- */
function Doctors() {
  const cats = ['All', ...new Set(DOCTORS.map((d) => d.s))]
  const [c, setC] = useState('All')
  const list = DOCTORS.filter((d) => c === 'All' || d.s === c)
  return (
    <section id="doctors" className={`${W} scroll-mt-16 py-24`}>
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h2 className={`${H2} max-w-xl`}>Meet doctors who explain things</h2>
        <div className="flex flex-wrap gap-2">{cats.map((x) => (
          <button key={x} onClick={() => setC(x)} aria-pressed={c === x} className="relative rounded-full px-4 py-2 text-sm font-bold">
            {c === x && <motion.span layoutId="dpill" className="absolute inset-0 rounded-full bg-pine-900" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <span className={`relative ${c === x ? 'text-paper' : ''}`}>{x}</span></button>))}
        </div>
      </div>
      <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">{list.map((d, k) => (
          <motion.article key={d.n} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease }}
            className="rounded-[1.75rem] border border-pine-900/10 bg-white p-6 transition-shadow hover:shadow-xl">
            <div className="flex items-center gap-4">
              <span className={`flex h-16 w-16 items-center justify-center rounded-full font-display text-xl font-bold text-white ${AV[DOCTORS.indexOf(d) % 4]}`}>{d.n.split(' ').slice(1).map((x) => x[0]).join('')}</span>
              <div><h3 className="font-display text-lg font-semibold">{d.n}</h3><p className="text-sm text-pine-900/60">{d.s}, {d.e} years</p></div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-pine-900/10 pt-4">
              <p className="text-sm"><span className="text-pine-900/60">Next slot </span><b>{d.slot}</b></p>
              <a href="#book" className="rounded-full bg-pine-100 px-4 py-2 text-sm font-bold hover:bg-coral hover:text-white">Book</a>
            </div>
          </motion.article>))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

/* ---------- 6 Steps ---------- */
function Steps() {
  const s = [['Choose', 'Pick a doctor or specialty and a time that suits you.'], ['Arrive', 'Check in from your phone and walk straight to the room.'], ['Consult', 'Tests, scans and your doctor visit happen in one trip.'], ['Follow up', 'Reports and your plan arrive on your phone the same day.']]
  return (
    <section className="bg-pine-700 py-24 text-paper">
      <div className={W}>
        <h2 className={`${H2} max-w-2xl`}>Four steps from booking to better</h2>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4">
          <motion.div className="absolute left-0 top-6 hidden h-0.5 w-full origin-left bg-coral md:block" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, ease }} />
          {s.map(([t, d], k) => (
            <li key={t} className="relative"><span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-coral font-display text-lg font-bold">{k + 1}</span>
              <h3 className="mt-5 font-display text-xl font-semibold">{t}</h3><p className="mt-2 text-paper/75">{d}</p></li>))}
        </ol>
      </div>
    </section>
  )
}

/* ---------- 7 Packages ---------- */
function Packages() {
  return (
    <section id="packages" className={`${W} scroll-mt-16 py-24`}>
      <h2 className={`${H2} max-w-2xl`}>Health checks, priced up front</h2>
      <div className="mt-12 grid items-stretch gap-6 md:grid-cols-3">
        {PACKAGES.map((p) => (
          <motion.div key={p.n} whileHover={{ y: -6 }} className={`flex flex-col rounded-[2rem] p-8 ${p.hot ? 'bg-pine-900 text-paper md:-my-4' : 'border border-pine-900/10 bg-white'}`}>
            <h3 className="font-display text-xl font-semibold">{p.n}</h3>
            <p className="mt-4 font-display text-5xl font-bold">৳{p.p}</p>
            <ul className="mt-7 flex-1 space-y-3">{p.f.map((f) => <li key={f} className="flex gap-3"><span className={p.hot ? 'text-coral' : 'text-pine-500'}>✓</span>{f}</li>)}</ul>
            <a href="#book" className={`mt-8 rounded-full py-3.5 text-center font-bold ${p.hot ? 'bg-coral text-white' : 'border-2 border-pine-900 hover:bg-pine-900 hover:text-paper'}`}>Choose {p.n}</a>
          </motion.div>))}
      </div>
    </section>
  )
}

/* ---------- 8 Facilities ---------- */
function Facilities() {
  const t = [['3T MRI and 128-slice CT', 'Sharper scans in half the time.', 'md:col-span-2 bg-pine-900 text-paper'], ['24/7 ICU', '1 nurse for every 2 beds.', 'bg-coral text-white'], ['Pathology lab', 'Most reports in 4 hours.', 'bg-pine-100'], ['In-house pharmacy', 'Collect medicine before you leave.', 'bg-pine-100'], ['Family comfort', 'Prayer room, cafe, free parking for 200 cars.', 'md:col-span-2 bg-pine-50 border border-pine-900/10']]
  return (
    <section className="bg-white py-24">
      <div className={W}>
        <h2 className={`${H2} max-w-2xl`}>Built around the patient</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {t.map(([h, d, c]) => (
            <motion.div key={h} whileHover={{ scale: 1.02 }} className={`flex min-h-[200px] flex-col justify-end rounded-[1.75rem] p-7 ${c}`}>
              <h3 className="font-display text-2xl font-semibold">{h}</h3><p className="mt-2 opacity-75">{d}</p>
            </motion.div>))}
        </div>
      </div>
    </section>
  )
}

/* ---------- 9 Stories ---------- */
function Stories() {
  const [i, setI] = useState(0)
  const s = STORIES[i]
  return (
    <section className={`${W} py-24`}>
      <div className="rounded-[2.5rem] bg-pine-100 px-6 py-16 text-center md:px-16 md:py-24">
        <div className="mx-auto min-h-[260px] max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
              <blockquote className="font-display text-2xl font-semibold leading-snug md:text-4xl">{s.q}</blockquote>
              <figcaption className="mt-8"><b>{s.n}</b><span className="text-pine-900/60">, {s.c}</span></figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-3">{STORIES.map((_, k) => <button key={k} aria-label={`Story ${k + 1}`} onClick={() => setI(k)} className={`h-3 rounded-full transition-all ${k === i ? 'w-10 bg-coral' : 'w-3 bg-pine-900/25'}`} />)}</div>
      </div>
    </section>
  )
}

/* ---------- 10 Booking ---------- */
function Booking() {
  const slots = ['09:00 AM', '11:00 AM', '02:30 PM', '04:30 PM', '06:00 PM']
  const [f, setF] = useState({ name: '', phone: '', spec: SERVICES[0].n, date: '', slot: slots[0] })
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const inp = 'w-full rounded-xl border border-pine-900/15 bg-white px-4 py-3.5'
  return (
    <section id="book" className="scroll-mt-16 bg-pine-50 py-24">
      <div className={`${W} grid gap-12 lg:grid-cols-[1fr_1.2fr]`}>
        <div><h2 className={H2}>Book your visit in under a minute</h2><p className="mt-5 max-w-sm text-lg text-pine-900/70">Tell us who you are and when you are free. We will confirm by SMS within 10 minutes.</p></div>
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-9">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pine-500 text-3xl text-white">✓</motion.span>
                <h3 className="mt-6 font-display text-2xl font-semibold">You are booked, {f.name.split(' ')[0]}</h3>
                <p className="mt-2 text-pine-900/70">{f.spec} on {f.date} at {f.slot}. We will text {f.phone} to confirm.</p>
                <button onClick={() => setDone(false)} className="mt-6 font-bold underline">Book another visit</button>
              </motion.div>
            ) : (
              <motion.form key="form" exit={{ opacity: 0 }} onSubmit={(e) => { e.preventDefault(); setDone(true) }} className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold">Full name<input required value={f.name} onChange={set('name')} className={`${inp} mt-1.5 font-normal`} /></label>
                <label className="text-sm font-bold">Phone<input required type="tel" value={f.phone} onChange={set('phone')} className={`${inp} mt-1.5 font-normal`} /></label>
                <label className="text-sm font-bold">Specialty<select value={f.spec} onChange={set('spec')} className={`${inp} mt-1.5 font-normal`}>{SERVICES.map((s) => <option key={s.n}>{s.n}</option>)}</select></label>
                <label className="text-sm font-bold">Date<input required type="date" value={f.date} onChange={set('date')} className={`${inp} mt-1.5 font-normal`} /></label>
                <fieldset className="sm:col-span-2"><legend className="text-sm font-bold">Time</legend>
                  <div className="mt-1.5 flex flex-wrap gap-2">{slots.map((s) => <button type="button" key={s} onClick={() => setF({ ...f, slot: s })} aria-pressed={f.slot === s} className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${f.slot === s ? 'border-pine-900 bg-pine-900 text-paper' : 'border-pine-900/15 hover:border-pine-900'}`}>{s}</button>)}</div></fieldset>
                <button className="rounded-full bg-coral py-4 font-bold text-white transition-transform hover:-translate-y-0.5 sm:col-span-2">Confirm appointment</button>
              </motion.form>)}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ---------- 11 FAQ ---------- */
function Faq() {
  const [o, setO] = useState(0)
  return (
    <section className={`${W} grid gap-12 py-24 lg:grid-cols-[1fr_1.4fr]`}>
      <h2 className={H2}>Questions patients ask us</h2>
      <div className="divide-y divide-pine-900/10 border-y border-pine-900/10">
        {FAQ.map(([q, a], k) => (
          <div key={q}>
            <button onClick={() => setO(o === k ? -1 : k)} aria-expanded={o === k} className="flex w-full items-center justify-between gap-6 py-6 text-left font-display text-lg font-semibold">
              {q}<motion.span animate={{ rotate: o === k ? 45 : 0 }} className="text-3xl leading-none text-coral">+</motion.span>
            </button>
            <AnimatePresence initial={false}>{o === k && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden pr-10 text-pine-900/70"><span className="block pb-6">{a}</span></motion.p>)}
            </AnimatePresence>
          </div>))}
      </div>
    </section>
  )
}

/* ---------- 12 Emergency ---------- */
function Emergency() {
  return (
    <section id="emergency" className="px-5 pb-24 md:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-coral px-6 py-16 text-white md:py-24">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="relative mb-6 flex h-4 w-4"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" /><span className="relative inline-flex h-4 w-4 rounded-full bg-white" /></span>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">Emergency? Call now. We answer in 3 rings.</h2>
          <a href={`tel:${EMERGENCY}`} className="mt-9 rounded-full bg-pine-900 px-10 py-5 font-display text-3xl font-bold transition-transform hover:scale-105">{EMERGENCY}</a>
          <p className="mt-5 text-white/85">Ambulance and ER open 24 hours, every day. Road 12, Gulshan, Dhaka.</p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-pine-900/10 py-10">
      <div className={`${W} flex flex-col justify-between gap-4 text-sm text-pine-900/70 md:flex-row`}>
        <p className="flex items-center gap-2 font-display text-lg font-bold text-pine-900"><Cross c="#FF6B57" />Nirog Health</p>
        <p>Open 24 hours. Outpatient 8 AM to 10 PM. © 2026 Nirog Health Ltd.</p>
      </div>
    </footer>
  )
}

export default function App() {
  return (<><Nav /><main><Hero /><Stats /><Services /><Why /><Doctors /><Steps /><Packages /><Facilities /><Stories /><Booking /><Faq /><Emergency /></main><Footer /></>)
}
