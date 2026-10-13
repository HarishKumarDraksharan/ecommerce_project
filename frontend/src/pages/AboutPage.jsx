import { Zap, Award, Users, ShieldCheck, HeartHandshake } from 'lucide-react'

const TEAM_MEMBERS = [
  { name: 'Member 1', role: 'Frontend UI Lead', desc: 'Crafting responsive interfaces, search filters, and smooth animations.', emoji: '🎨' },
  { name: 'Member 2', role: 'Auth & User Architect', desc: 'Secure sessions, profile pages, and address book verification.', emoji: '🔐' },
  { name: 'Member 3', role: 'Checkout & Payments', desc: 'Shopping cart logic, coupon validation, and Razorpay flow.', emoji: '💳' },
  { name: 'Member 4', role: 'Admin Panel & Analytics', desc: 'Reporting databases, sales charts, and catalog administration.', emoji: '📊' },
  { name: 'Member 5', role: 'Backend & DevOps', desc: 'Spring Boot REST controllers, flyway migration, and docker deployment.', emoji: '⚙️' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 py-12">

      {/* Branding Hero Banner */}
      <section className="container-custom text-center max-w-3xl mb-16 mt-8">
        <span className="badge bg-primary-100 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full">
          About ShopSphere
        </span>
        <h1 className="text-4xl md:text-6xl font-black font-display dark:text-white mt-4 leading-tight">
          Next Gen E-Commerce <span className="gradient-text">Designed to Scale</span>
        </h1>
        <p className="text-dark-500 dark:text-dark-400 text-lg mt-6 leading-relaxed">
          ShopSphere is an enterprise-grade modular monolith web application developed as a final-year group capstone project. Designed with high separation of concerns and robust security protocols, it demonstrates standard full-stack development patterns.
        </p>
      </section>

      {/* Core values */}
      <section className="bg-dark-50 dark:bg-dark-900/40 py-16 mb-20 border-y border-dark-100 dark:border-dark-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Speed & Reliability', desc: 'Built on Vite, React 19, and Spring Boot 3 with cached database aggregations.' },
              { icon: ShieldCheck, title: 'High Security', desc: 'Stateless JWT validation, role-based authorization, and signature-verified payments.' },
              { icon: HeartHandshake, title: 'Modular Architecture', desc: 'Clear layers allow multiple developers to work independently without merge conflicts.' },
            ].map((value, idx) => (
              <div key={idx} className="card p-6 bg-white dark:bg-dark-900 shadow-card text-center">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon size={22} />
                </div>
                <h3 className="font-bold text-sm dark:text-white mb-2">{value.title}</h3>
                <p className="text-xs text-dark-500 dark:text-dark-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="container-custom mb-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black font-display dark:text-white">Our Capstone Team</h2>
          <p className="text-sm text-dark-400 mt-2">The software architects who engineered ShopSphere</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="card p-5 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-center hover:scale-102 transition-transform duration-200">
              <span className="text-4xl block mb-3">{member.emoji}</span>
              <h3 className="font-bold text-sm dark:text-white leading-tight">{member.name}</h3>
              <p className="text-[10px] text-primary-500 font-semibold mt-1 uppercase tracking-wide">{member.role}</p>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-3 leading-relaxed">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
