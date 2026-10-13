import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { userAPI } from '@services/api'
import { useAuth } from '@context/AuthContext'
import {
  User, Mail, Phone, Lock, MapPin, Plus, Trash2, Edit, CheckCircle2,
  Package, Heart, Shield, Key, ArrowRight, Save, Clock
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'addresses' | 'security'

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '')

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Address modal state
  const [addressModal, setAddressModal] = useState(false)
  const [newAddr, setNewAddr] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  })

  // Queries
  const { data: profileResp, isLoading: loadingProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: userAPI.getProfile,
    onSuccess: (res) => {
      const p = res.data || res
      if (p) {
        setFullName(p.fullName || '')
        setPhoneNumber(p.phoneNumber || '')
      }
    }
  })

  const { data: addressResp, isLoading: loadingAddresses } = useQuery({
    queryKey: ['user-addresses'],
    queryFn: userAPI.getAddresses,
  })

  const addresses = addressResp?.data || (Array.isArray(addressResp) ? addressResp : [])

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (res) => {
      toast.success('Profile details updated successfully')
      const updated = res.data || res
      updateUser(updated)
      queryClient.invalidateQueries(['user-profile'])
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    }
  })

  const changePasswordMutation = useMutation({
    mutationFn: userAPI.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to change password')
    }
  })

  const addAddressMutation = useMutation({
    mutationFn: userAPI.addAddress,
    onSuccess: () => {
      toast.success('Address added successfully')
      queryClient.invalidateQueries(['user-addresses'])
      setAddressModal(false)
      setNewAddr({
        fullName: user?.fullName || '',
        phoneNumber: user?.phoneNumber || '',
        streetAddress: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add address')
    }
  })

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    updateProfileMutation.mutate({ fullName, phoneNumber })
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    changePasswordMutation.mutate({ currentPassword, newPassword })
  }

  const handleAddAddress = (e) => {
    e.preventDefault()
    addAddressMutation.mutate(newAddr)
  }

  return (
    <div className="container-custom py-10">

      {/* ── Header Banner ───────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl text-white shadow-inner">
            {user?.fullName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.fullName || 'Valued Customer'}</h1>
            <p className="text-xs text-blue-100 mt-0.5 flex items-center gap-2">
              <Mail size={14} /> {user?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/orders" className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5">
            <Package size={15} /> My Orders
          </Link>
          <Link to="/wishlist" className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5">
            <Heart size={15} /> Wishlist
          </Link>
        </div>
      </div>

      {/* ── Main Layout: Sidebar & Tabs ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Navigation Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
              activeTab === 'profile'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
            }`}
          >
            <User size={16} /> Personal Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
              activeTab === 'addresses'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
            }`}
          >
            <MapPin size={16} /> Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-3 transition-all ${
              activeTab === 'security'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800'
            }`}
          >
            <Shield size={16} /> Security & Password
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="md:col-span-3">

          {/* TAB 1: Profile Info */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                <User size={20} className="text-primary-600" /> Personal Details
              </h2>
              <p className="text-xs text-dark-400 mb-6">Update your account profile name and contact number.</p>

              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="e.g. Mahesh Seerla"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    Email Address <span className="text-[10px] text-dark-400 font-normal">(Read only)</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="input w-full text-xs bg-dark-50 dark:bg-dark-800/50 cursor-not-allowed opacity-75"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isLoading}
                    className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
                  >
                    <Save size={15} />
                    {updateProfileMutation.isLoading ? 'Saving Changes...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-100 dark:border-dark-800">
                <div>
                  <h2 className="text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2">
                    <MapPin size={20} className="text-primary-600" /> Saved Addresses
                  </h2>
                  <p className="text-xs text-dark-400 mt-0.5">Manage delivery addresses for fast checkout.</p>
                </div>
                <button
                  onClick={() => setAddressModal(true)}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                >
                  <Plus size={15} /> Add New Address
                </button>
              </div>

              {loadingAddresses ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs text-dark-400">Loading addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-dark-100 dark:border-dark-800 rounded-2xl">
                  <MapPin size={36} className="text-dark-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-dark-700 dark:text-dark-300 mb-1">No Addresses Saved Yet</p>
                  <p className="text-xs text-dark-400 mb-4">Add a shipping address to complete checkout in seconds.</p>
                  <button onClick={() => setAddressModal(true)} className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1">
                    <Plus size={14} /> Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="border border-dark-100 dark:border-dark-800 rounded-xl p-4 relative hover:border-primary-500 transition-colors">
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800">
                          Default
                        </span>
                      )}
                      <p className="font-bold text-xs text-dark-900 dark:text-white mb-1">{addr.fullName}</p>
                      <p className="text-xs text-dark-500 leading-relaxed mb-3">
                        {addr.streetAddress || addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      <p className="text-[11px] text-dark-400">Phone: {addr.phoneNumber}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-dark-900 dark:text-white mb-2 flex items-center gap-2">
                <Lock size={20} className="text-primary-600" /> Change Password
              </h2>
              <p className="text-xs text-dark-400 mb-6">Keep your account secure by updating your password regularly.</p>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input w-full text-xs"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={changePasswordMutation.isLoading}
                    className="btn-primary text-xs py-2.5 px-6 inline-flex items-center gap-2"
                  >
                    <Key size={15} />
                    {changePasswordMutation.isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add Address Modal */}
      {addressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-900 border border-dark-100 dark:border-dark-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-dark-900 dark:text-white mb-4">Add Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="input w-full text-xs"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={newAddr.phoneNumber}
                onChange={(e) => setNewAddr({ ...newAddr, phoneNumber: e.target.value })}
                className="input w-full text-xs"
              />
              <input
                type="text"
                required
                placeholder="Street Address / Flat No."
                value={newAddr.streetAddress}
                onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                className="input w-full text-xs"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="input w-full text-xs"
                />
                <input
                  type="text"
                  required
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="input w-full text-xs"
                />
              </div>
              <input
                type="text"
                required
                placeholder="PIN / Postal Code"
                value={newAddr.postalCode}
                onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="input w-full text-xs"
              />

              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setAddressModal(false)} className="btn-outline text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="submit" disabled={addAddressMutation.isLoading} className="btn-primary text-xs py-2 px-4">
                  {addAddressMutation.isLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
