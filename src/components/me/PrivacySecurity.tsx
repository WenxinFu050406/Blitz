import { ArrowLeft, Lock, Eye, Shield, Key, Smartphone, ChevronRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { useState } from 'react';

interface PrivacySecurityProps {
  onBack: () => void;
}

export function PrivacySecurity({ onBack }: PrivacySecurityProps) {
  const [locationSharing, setLocationSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityVisibility, setActivityVisibility] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-base">Privacy & Security</h2>
          <p className="text-xs opacity-90 mt-0.5">Protect your account</p>
        </div>
        <Shield className="w-6 h-6" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Security */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">Security</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-cyan-600" />
                <div className="text-left">
                  <p className="text-sm">Change Password</p>
                  <p className="text-xs text-slate-500 mt-0.5">Last changed 2 months ago</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-500 mt-0.5">Extra layer of security</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-purple-600" />
                <div className="text-left">
                  <p className="text-sm">Active Sessions</p>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your devices</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </Card>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">Privacy</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm">Profile Visibility</p>
                  <p className="text-xs text-slate-500 mt-0.5">Who can see your profile</p>
                </div>
              </div>
              <Switch
                checked={profileVisibility}
                onCheckedChange={setProfileVisibility}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="text-sm">Activity Visibility</p>
                  <p className="text-xs text-slate-500 mt-0.5">Share your rides publicly</p>
                </div>
              </div>
              <Switch
                checked={activityVisibility}
                onCheckedChange={setActivityVisibility}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm">Location Sharing</p>
                  <p className="text-xs text-slate-500 mt-0.5">Share location in posts</p>
                </div>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={setLocationSharing}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm">Blocked Users</p>
                <p className="text-xs text-slate-500 mt-0.5">Manage blocked accounts</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </Card>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-sm text-slate-600 mb-3">Data Management</h3>
          <Card className="divide-y divide-slate-100 border border-slate-100">
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm">Download Your Data</p>
                <p className="text-xs text-slate-500 mt-0.5">Export all your information</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-slate-50 transition-colors">
              <div className="text-left">
                <p className="text-sm">Data Usage</p>
                <p className="text-xs text-slate-500 mt-0.5">See how we use your data</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          </Card>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm text-red-600 mb-3">Danger Zone</h3>
          <Card className="p-4 border border-red-200 bg-red-50">
            <h4 className="text-sm mb-2">Delete Account</h4>
            <p className="text-xs text-slate-600 mb-3">
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
            <Button variant="outline" className="w-full border-red-300 text-red-600 hover:bg-red-100">
              Delete My Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
