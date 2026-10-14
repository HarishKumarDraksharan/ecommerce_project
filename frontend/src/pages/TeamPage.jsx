import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Github, Linkedin, Mail, Sparkles, CheckCircle2, Award, Terminal, ArrowRight } from 'lucide-react'

export default function TeamPage() {
  const teamMembers = [
    {
      id: 1,
      name: 'Mahesh Seerla',
      role: 'Full Stack Developer & Lead Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      initials: 'MS',
      email: 'seerlamahesh17@gmail.com',
      github: 'https://github.com/seerlamahesh',
      linkedin: 'https://linkedin.com',
      bio: 'Final year B.Tech Computer Science student specializing in modern web architectures, scalable API design, and full-stack software development.',
      contributions: [
        'Frontend development & React architecture',
        'Backend integration & REST API design',
        'Database modeling & authentication security',
        'Project architecture & Razorpay payment workflow'
      ],
      skills: ['React.js', 'Node.js', 'Express', 'SQLite/PostgreSQL', 'Tailwind CSS', 'JWT Auth']
    },
    {
      id: 2,
      name: 'Maveen',
      role: 'Full Stack Developer & UI Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      initials: 'MV',
      email: 'maveen@example.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      bio: 'Creative software engineer passionate about modern UI/UX execution, responsive mobile-first layouts, and client-side performance.',
      contributions: [
        'UI component development & layout polish',
        'Feature implementation & state management',
        'End-to-end testing, debugging & bug fixes',
        'Responsive layout optimization for mobile/desktop'
      ],
      skills: ['React.js', 'Tailwind CSS', 'Framer Motion', 'REST APIs', 'State Management', 'Testing']
    }
  ]

  const projectTech = [
    { name: 'React.js 18', type: 'Frontend Framework' },
    { name: 'Tailwind CSS', type: 'Styling Engine' },
    { name: 'Express.js', type: 'Node Backend Server' },
    { name: 'SQLite / Drizzle', type: 'Database Engine' },
    { name: 'JWT & Bcrypt', type: 'Authentication Security' },
    { name: 'Razorpay Integration', type: 'Payment Processing' },
  ]

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-12">
      <div className="container-custom max-w-5xl">

        {/* Header Badge & Title */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Award size={14} /> B.Tech Final Year Capstone Project
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-dark-900 dark:text-white tracking-tight mb-3">
            ShopSphere Development Team
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Engineered and built from scratch as part of our academic degree requirements. Demonstrating modern full-stack web engineering best practices.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-blue-500 text-white font-black text-xl flex items-center justify-center shadow-md flex-shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                      {member.name}
                    </h2>
                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-xs text-dark-400 mt-1">
                      B.Tech Computer Science & Engineering
                    </p>
                  </div>
                </div>

                <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed mb-6">
                  {member.bio}
                </p>

                {/* Contributions List */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Key Contributions
                  </h3>
                  <ul className="space-y-2">
                    {member.contributions.map((contrib, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-dark-700 dark:text-dark-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5 flex-shrink-0" />
                        <span>{contrib}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Skills */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 mb-2.5 flex items-center gap-1.5">
                    <Code2 size={14} className="text-primary-500" /> Technical Stack Focus
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 bg-dark-50 dark:bg-dark-800 text-dark-700 dark:text-dark-300 text-[11px] font-medium rounded-lg border border-dark-100 dark:border-dark-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact / Links */}
              <div className="pt-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
                <a
                  href={`mailto:${member.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-dark-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  <Mail size={14} /> {member.email}
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-primary-600 hover:text-white flex items-center justify-center text-dark-600 dark:text-dark-300 transition-colors"
                  >
                    <Github size={15} />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-dark-100 dark:bg-dark-800 hover:bg-primary-600 hover:text-white flex items-center justify-center text-dark-600 dark:text-dark-300 transition-colors"
                  >
                    <Linkedin size={15} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Architecture Overview Card */}
        <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400 flex items-center justify-center font-bold">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark-900 dark:text-white">
                Project Technical Specifications
              </h2>
              <p className="text-xs text-dark-500">
                Full stack architecture built following enterprise coding standards
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {projectTech.map((item, i) => (
              <div key={i} className="bg-dark-50/70 dark:bg-dark-800/50 p-3 rounded-xl text-center border border-dark-100 dark:border-dark-800">
                <p className="text-xs font-bold text-dark-900 dark:text-white mb-0.5">{item.name}</p>
                <p className="text-[10px] text-dark-400">{item.type}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-dark-500 border-t border-dark-100 dark:border-dark-800 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-amber-500" />
              <span>Features REST API integration, state management, Razorpay payment demo, and admin panel.</span>
            </div>
            <Link to="/products" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              Explore Live Store <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
