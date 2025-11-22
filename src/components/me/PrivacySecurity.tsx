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
    <div className="flex flex-col h-full bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#333] bg-black">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex-1">
          <h2 className="text-base text-white">Privacy & Security</h2>
          <p className="text-xs opacity-90 mt-0.5 text-gray-400">Protect your account</p>
        </div>
        <Shield className="w-6 h-6 text-[#00ff88]" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-4 bg-black">
        {/* Security */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Security</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-[#00ff88]" />
                <div className="text-left">
                  <p className="text-sm text-white">Change Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Last changed 2 months ago</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500 mt-0.5">Extra layer of security</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={setTwoFactor}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#00ff88]" />
                <div className="text-left">
                  <p className="text-sm text-white">Active Sessions</p>
                  <p className="text-xs text-gray-500 mt-0.5">Manage your devices</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>

        {/* Privacy */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Privacy</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">Profile Visibility</p>
                  <p className="text-xs text-gray-500 mt-0.5">Who can see your profile</p>
                </div>
              </div>
              <Switch
                checked={profileVisibility}
                onCheckedChange={setProfileVisibility}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-[#00ff88]" />
                <div>
                  <p className="text-sm text-white">Activity Visibility</p>
                  <p className="text-xs text-gray-500 mt-0.5">Share your rides publicly</p>
                </div>
              </div>
              <Switch
                checked={activityVisibility}
                onCheckedChange={setActivityVisibility}
              />
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm text-white">Location Sharing</p>
                  <p className="text-xs text-gray-500 mt-0.5">Share location in posts</p>
                </div>
              </div>
              <Switch
                checked={locationSharing}
                onCheckedChange={setLocationSharing}
              />
            </div>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="text-left">
                <p className="text-sm text-white">Blocked Users</p>
                <p className="text-xs text-gray-500 mt-0.5">Manage blocked accounts</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Data Management</h3>
          <Card className="divide-y divide-[#333] border border-[#333] bg-[#1a1a1a]">
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="text-left">
                <p className="text-sm text-white">Download Your Data</p>
                <p className="text-xs text-gray-500 mt-0.5">Export all your information</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            
            <button className="p-4 flex items-center justify-between w-full hover:bg-[#2a2a2a] transition-colors">
              <div className="text-left">
                <p className="text-sm text-white">Data Usage</p>
                <p className="text-xs text-gray-500 mt-0.5">See how we use your data</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </Card>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-sm text-red-500 mb-3">Danger Zone</h3>
          <Card className="p-4 border border-red-900/50 bg-red-950/10">
            <h4 className="text-sm mb-2 text-red-400">Delete Account</h4>
            <p className="text-xs text-gray-400 mb-3">
              Once you delete your account, there is no going back. All your data will be permanently deleted.
            </p>
            <Button variant="outline" className="w-full border-red-900 text-red-500 hover:bg-red-950/30 bg-transparent">
              Delete My Account
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
