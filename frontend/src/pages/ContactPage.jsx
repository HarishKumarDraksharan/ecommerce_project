import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Your message was sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 py-12">
      <div className="container-custom max-w-5xl">

        <div className="text-center mb-12 mt-4">
          <h1 className="text-4xl font-black font-display dark:text-white">Get In Touch</h1>
          <p className="text-sm text-dark-400 mt-2">Have a question? We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Support Side Details */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: 'Email Us', val: 'support@shopsphere.com', desc: 'Queries answered in 24 hours.' },
              { icon: Phone, title: 'Call Support', val: '+91 98765 43210', desc: 'Mon-Fri from 9am to 6pm IST.' },
              { icon: MapPin, title: 'Headquarters', val: 'Bangalore, India', desc: 'University Tech Capstone Lab.' },
            ].map((box, idx) => (
              <div key={idx} className="card p-5 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-card flex gap-4">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/20 text-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <box.icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-dark-400 dark:text-dark-500 uppercase tracking-wider">{box.title}</h3>
                  <p className="font-semibold text-sm text-dark-900 dark:text-white mt-1">{box.val}</p>
                  <p className="text-xs text-dark-400 mt-0.5">{box.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Area */}
          <div className="md:col-span-2 card p-8 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-card">
            <h2 className="text-xl font-bold dark:text-white mb-6">Send Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-xs">Full Name</label>
                <input
                  required
                  placeholder="John Doe"
                  className="input py-3"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="label text-xs">Email Address</label>
                <input
                  required
                  type="email"
                  placeholder="name@example.com"
                  className="input py-3"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="label text-xs">Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="How can we help you?"
                  className="input py-3 resize-none"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full btn-lg text-sm py-3.5 justify-center mt-2"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : (
                  <>Send Message <Send size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
