'use client';

import { useState, useEffect } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { toast } from 'sonner';
import { 
  User, 
  Lock, 
  Bell, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck,
  Globe,
  Save
} from 'lucide-react';

export default function StudentSettings() {
  const { activeUser, saveActiveUserState } = usePortalState();

  // Tab State
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'alerts'>('account');

  // Tab 1: Profile & Contact States
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');

  // Tab 2: Security Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Tab 3: Notification Alerts States
  const [notifPref, setNotifPref] = useState({
    emailAlerts: true,
    smsAlerts: false,
    mockReminders: true
  });

  // Synchronize state when activeUser is fetched from usePortalState
  useEffect(() => {
    if (activeUser) {
      setEmail(activeUser.personalInfo?.email || '');
      setMobile(activeUser.personalInfo?.mobile || '');
      setAddress('RGU Hostels, Block C, Room 304, Coimbatore, India');
    }
  }, [activeUser]);

  // Place conditional return AFTER all hooks are called
  if (!activeUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-navy-950 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mobile) {
      toast.warning('Please input your active email and mobile contacts.');
      return;
    }

    // Save profile contact changes directly to central state
    const updatedUser = {
      ...activeUser,
      personalInfo: {
        ...activeUser.personalInfo,
        email: email.trim(),
        mobile: mobile.trim()
      }
    };

    saveActiveUserState(updatedUser);
    toast.success('Account contact settings saved successfully!');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.warning('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.', {
        description: 'Ensure new security keys are keyed identically.'
      });
      return;
    }

    toast.success('Security password has been updated!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSavePreferences = () => {
    toast.success('Communication and system channel preferences saved!');
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled(prev => {
      const nextVal = !prev;
      toast.info(nextVal ? 'Two-Factor Authentication (2FA) enabled.' : 'Two-Factor Authentication disabled.');
      return nextVal;
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5">
        <h1 className="font-outfit font-black text-2xl text-navy-950">System Settings</h1>
        <p className="text-xs font-semibold text-text-slate">Manage your contact details, security credentials, and system alert channels.</p>
      </div>

      {/* Tabs list */}
      <div className="flex bg-surface-slate p-1 rounded-2xl border border-border-slate w-full max-w-lg">
        <button
          onClick={() => setActiveTab('account')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'account' ? 'bg-white text-navy-950 shadow-sm' : 'text-text-slate hover:text-navy-950'}`}
        >
          <User className="w-4 h-4" />
          Account Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'security' ? 'bg-white text-navy-950 shadow-sm' : 'text-text-slate hover:text-navy-950'}`}
        >
          <Lock className="w-4 h-4" />
          Security Credentials
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'alerts' ? 'bg-white text-navy-950 shadow-sm' : 'text-text-slate hover:text-navy-950'}`}
        >
          <Bell className="w-4 h-4" />
          Alert Channels
        </button>
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className="max-w-4xl">
        
        {/* TAB 1: Account Profile */}
        {activeTab === 'account' && (
          <form onSubmit={handleUpdateContact} className="premium-card bg-white border border-border-slate p-8 space-y-6 shadow-sm">
            <div className="border-b border-border-slate/60 pb-4">
              <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">Edit Account Information</h3>
              <p className="text-[11px] font-semibold text-text-slate mt-0.5">Manage details related to your active scholar login.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-xs font-bold text-text-slate">
                <label className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-800" />
                  Primary Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full premium-input font-medium"
                />
              </div>

              <div className="space-y-1.5 text-xs font-bold text-text-slate">
                <label className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-800" />
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full premium-input font-medium"
                />
              </div>

              <div className="space-y-1.5 text-xs font-bold text-text-slate md:col-span-2">
                <label className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-800" />
                  Mailing / Correspondence Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full premium-input font-medium"
                />
              </div>

              <div className="space-y-1.5 text-xs font-bold text-text-slate">
                <label className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-800" />
                  Preferred Portal Language
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full premium-input font-semibold"
                >
                  <option value="English">English (United Kingdom)</option>
                  <option value="Hindi">Hindi (India)</option>
                  <option value="Tamil">Tamil (India)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-border-slate/60 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Account Settings
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: Security Credentials */}
        {activeTab === 'security' && (
          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            
            {/* Password changes form */}
            <form onSubmit={handleUpdatePassword} className="md:col-span-7 premium-card bg-white border border-border-slate p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-border-slate/60 pb-4">
                  <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">Update Security Key</h3>
                  <p className="text-[11px] font-semibold text-text-slate mt-0.5">We recommend using a unique password to safeguard your records.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5 text-xs font-bold text-text-slate">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full premium-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold text-text-slate">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full premium-input font-medium"
                    />
                  </div>
                  <div className="space-y-1.5 text-xs font-bold text-text-slate">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full premium-input font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border-slate/60 mt-8">
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all"
                >
                  Save New Password
                </button>
              </div>
            </form>

            {/* Security Toggles details */}
            <div className="md:col-span-5 premium-card bg-white border border-border-slate p-8 space-y-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-border-slate/60 pb-4">
                  <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">Security Protocols</h3>
                  <p className="text-[11px] font-semibold text-text-slate mt-0.5">Reinforce system access locks on your scholar account.</p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-text-navy leading-relaxed">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">Two-Factor Authentication (2FA)</p>
                      <p className="text-[10px] font-medium text-text-slate mt-0.5">Request a dynamic OTP secure key sent to your mobile phone alongside password hashes during log ins.</p>
                    </div>
                    <button
                      onClick={handleToggle2FA}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${twoFactorEnabled ? 'bg-success-green' : 'bg-surface-slate'}`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-800/5 border border-blue-800/10 rounded-xl text-[10px] font-semibold text-text-slate leading-relaxed flex gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-800 shrink-0" />
                Security systems comply with standard OAuth2 and JWT hashing algorithms to block intrusion logs.
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: Alert Channels */}
        {activeTab === 'alerts' && (
          <div className="premium-card bg-white border border-border-slate p-8 space-y-6 shadow-sm">
            <div className="border-b border-border-slate/60 pb-4">
              <h3 className="font-outfit font-extrabold text-[15px] text-navy-950">Communication Alerts</h3>
              <p className="text-[11px] font-semibold text-text-slate mt-0.5">Configure preferred alert triggers across RGU information vectors.</p>
            </div>

            <div className="space-y-5 text-xs font-semibold text-text-navy">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPref.emailAlerts}
                  onChange={(e) => setNotifPref(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                  className="w-4.5 h-4.5 accent-navy-950 rounded shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-bold">Email Transmissions & Reports</p>
                  <p className="text-[10px] font-medium text-text-slate mt-0.5">Transmit document audit decisions, guide allocations, and confirmation letters to your address.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPref.smsAlerts}
                  onChange={(e) => setNotifPref(prev => ({ ...prev, smsAlerts: e.target.checked }))}
                  className="w-4.5 h-4.5 accent-navy-950 rounded shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-bold">Cellular SMS Alerts</p>
                  <p className="text-[10px] font-medium text-text-slate mt-0.5">Transmit security code numbers, timeslot locks, and exam scheduling alerts directly via SMS cellular streams.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifPref.mockReminders}
                  onChange={(e) => setNotifPref(prev => ({ ...prev, mockReminders: e.target.checked }))}
                  className="w-4.5 h-4.5 accent-navy-950 rounded shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-bold">Syllabus Practice Practice Reminders</p>
                  <p className="text-[10px] font-medium text-text-slate mt-0.5">Trigger mock scheduling alerts in your student inbox before date deadlines.</p>
                </div>
              </label>
            </div>

            <div className="pt-6 border-t border-border-slate/60 mt-8 flex justify-end">
              <button
                onClick={handleSavePreferences}
                className="px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-blue-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
