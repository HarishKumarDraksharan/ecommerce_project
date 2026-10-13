import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

const FAQS = [
  { q: 'How does payment sandbox work?', a: 'ShopSphere uses Razorpay Sandbox for checkout simulation. You can use fake test card details/UPI keys on checkout to experience the payment signature verification cycle without using real money.' },
  { q: 'What is the capstone project architecture?', a: 'ShopSphere uses a modular monolith design. The Java backend operates standard Service-Repository patterns connected to MySQL for orders/carts and MongoDB for reviews and history.' },
  { q: 'How is verification email handled?', a: 'We utilize Spring Boot Mail coupled with Thymeleaf templates. Verification flows generate a secure token saved in Redis, which must be confirmed before the user is enabled.' },
  { q: 'Can I add multiple shipping addresses?', a: 'Yes! The Address Book inside your profile tab allows you to add, edit, and delete multiple addresses and toggle a default destination.' },
  { q: 'How are product recommendations calculated?', a: 'Recommendations are aggregated in MongoDB collections. We record user browsing history and queries to fetch trending products and top categories dynamically.' },
]

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(null)

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 py-12">
      <div className="container-custom max-w-3xl">

        <div className="text-center mb-12 mt-4">
          <h1 className="text-4xl font-black font-display dark:text-white">Frequently Asked Questions</h1>
          <p className="text-sm text-dark-400 mt-2">Find answers to common platform queries</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className="card bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-card overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-sm text-dark-900 dark:text-white"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-primary-500 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-dark-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-dark-500 dark:text-dark-400 leading-relaxed border-t border-dark-50 dark:border-dark-800">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
