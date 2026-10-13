import { Link } from 'react-router-dom'
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const LINKS = {
  Shop:    [{ l: 'Products', to: '/products' }, { l: 'Categories', to: '/products' }, { l: 'Compare', to: '/compare' }, { l: 'New Arrivals', to: '/products?sort=createdAt,desc' }],
  Project: [{ l: 'Team Members', to: '/team' }, { l: 'Architecture', to: '/team' }, { l: 'Contributions', to: '/team' }, { l: 'Tech Stack', to: '/team' }],
  Account: [{ l: 'My Profile', to: '/profile' }, { l: 'My Orders', to: '/orders' }, { l: 'Wishlist', to: '/wishlist' }, { l: 'Shopping Cart', to: '/cart' }],
}

export default function Footer() {
  return (
    <footer className="bg-dark-900 dark:bg-dark-950 text-dark-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <span className="font-black text-xl font-display text-white">
                Shop<span className="gradient-text">Sphere</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed mb-5 max-w-xs">
              Your one-stop destination for everything you need. Quality products, secure payments, and fast delivery.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, href: '#' }, { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' }, { icon: Youtube, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-dark-800 hover:bg-primary-500 flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-white mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map(({ l, to }) => (
                  <li key={l}>
                    <Link to={to} className="text-sm hover:text-primary-400 transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-6 py-6 border-t border-dark-800 text-sm">
          {[
            { icon: Mail,    text: 'support@shopsphere.com' },
            { icon: Phone,   text: '+91 98765 43210' },
            { icon: MapPin,  text: 'Bangalore, Karnataka, India' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors">
              <Icon size={14} className="text-primary-500" /> {text}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-dark-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-dark-500">
          <p>© {new Date().getFullYear()} ShopSphere. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-dark-300">Privacy Policy</a>
            <a href="#" className="hover:text-dark-300">Terms of Service</a>
            <a href="#" className="hover:text-dark-300">Cookie Policy</a>
          </div>
          <div className="flex items-center gap-2">
            <span>Secured by</span>
            <span className="text-primary-400 font-semibold">Razorpay</span>
            <span>|</span>
            <span className="text-primary-400 font-semibold">SSL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
