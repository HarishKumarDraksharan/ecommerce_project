export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 py-12">
      <div className="container-custom max-w-4xl">
        <div className="card p-8 bg-white dark:bg-dark-900 shadow-card border border-dark-200 dark:border-dark-800">
          <h1 className="text-3xl font-black font-display dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-xs text-dark-400 mb-4">Last updated: July 11, 2026</p>

          <div className="prose dark:prose-invert max-w-none text-xs text-dark-600 dark:text-dark-350 space-y-4 leading-relaxed">
            <p>
              At ShopSphere, accessible from shopsphere.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ShopSphere and how we use it.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">1. Information We Collect</h3>
            <p>
              We collect user registration profiles (names, emails, passwords encrypted via BCrypt) to authenticate catalog shopping sessions. Order histories and address profiles are retained securely in MySQL databases. Reviews and search tokens are stored in MongoDB logs for recommendations.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">2. How We Use Information</h3>
            <p>
              The information we gather is used to configure checkout carts, process online sandbox payments (via Razorpay SDK signature verification), prevent security breaches, audit administrator CRUD logs, and send automated confirmation emails via Spring Mail.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">3. Security Precautions</h3>
            <p>
              We implement industry-standard JWT auth filters, password salting, SQL injection sanitization, and Redis rate limiting to safeguard user details from unauthorized exposure.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
