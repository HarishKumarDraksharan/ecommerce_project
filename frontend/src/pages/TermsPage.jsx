export default function TermsPage() {
  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950 py-12">
      <div className="container-custom max-w-4xl">
        <div className="card p-8 bg-white dark:bg-dark-900 shadow-card border border-dark-200 dark:border-dark-800">
          <h1 className="text-3xl font-black font-display dark:text-white mb-6">Terms of Service</h1>
          <p className="text-xs text-dark-400 mb-4">Last updated: July 11, 2026</p>

          <div className="prose dark:prose-invert max-w-none text-xs text-dark-600 dark:text-dark-350 space-y-4 leading-relaxed">
            <p>
              Welcome to ShopSphere. These Terms of Service govern your use of our capstone e-commerce sandbox application and related APIs.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">1. Use of Sandbox Carts</h3>
            <p>
              ShopSphere is configured as a university group evaluation platform. Payments are processed in Test/Sandbox modes. Users must not use real money or valid credit card details during the checkout test cycles.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">2. User Account Security</h3>
            <p>
              You are responsible for safeguarding the credentials of your account. In case of password leak, you can utilize the secure Reset Password mail token cycle to change it.
            </p>

            <h3 className="font-bold text-sm text-dark-800 dark:text-white pt-2">3. Product & Reviews Conduct</h3>
            <p>
              Users can write reviews for catalog items. Admin reserves the right to delete flagged or inappropriate reviews from MongoDB collections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
