import { useState } from 'react';
import { Mail, ArrowRight, Check, User, AlertCircle, ChevronLeft, BookOpen, Bike, Users, BarChart, Eye, EyeOff } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { publicAnonKey } from '../utils/supabase/info';
import { API_BASE } from '../utils/api';
import { Logo } from './ui/Logo';

type AuthMode = 'login' | 'register';
type RegisterStep = 'contact' | 'profile' | 'password' | 'complete';

interface AuthPageProps {
  onAuthSuccess: (userData: any, accessToken?: string) => void;
}

// Predefined avatar options
const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Coco',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
];

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const { language, setLanguage } = useLanguage();
  const t = getTranslation(language).auth;
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('contact');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form fields
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle login
  const handleLogin = async () => {
    if (!contact || !password) return;

    // Validate format
    if (!isValidEmail(contact)) {
      setError(language === 'zh-CN' ? '请输入有效的邮箱地址，例如：user@example.com' : 'Please enter a valid email address, e.g.: user@example.com');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: contact,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.warn('Login failed:', data.error);
        // Provide user-friendly error messages
        if (data.error.includes('Invalid login credentials') || data.error.includes('Invalid')) {
          setError(language === 'zh-CN' ? '用户名或密码错误，请检查后重试' : 'Invalid credentials. Please check and try again.');
        } else {
          setError(data.error || (language === 'zh-CN' ? '登录失败，请重试' : 'Login failed. Please try again.'));
        }
        setIsLoading(false);
        return;
      }

      if (data.success && data.user && data.accessToken) {
        onAuthSuccess(data.user, data.accessToken);
      } else {
        setError(language === 'zh-CN' ? '服务器响应异常' : 'Invalid response from server');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(language === 'zh-CN' ? '网络错误，请检查连接后重试' : 'Network error. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  // Handle registration steps
  const handleRegisterNext = async () => {
    if (registerStep === 'contact' && contact) {
      // Validate format before proceeding
      if (!isValidEmail(contact)) {
        setError(language === 'zh-CN' ? '请输入有效的邮箱地址，例如：user@example.com' : 'Please enter a valid email address, e.g.: user@example.com');
        return;
      }

      setError(null);
      setRegisterStep('profile');
    } else if (registerStep === 'profile' && username) {
      setRegisterStep('password');
    } else if (registerStep === 'password' && password) {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: contact,
            password,
            username,
            avatar: selectedAvatar,
            contactType: 'email'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Signup error:', data.error);
          // Provide user-friendly error messages
          if (data.error.includes('email') || data.error.includes('Email')) {
            setError(language === 'zh-CN' ? '邮箱格式无效或已被使用，请使用其他邮箱' : 'Email format is invalid or already in use. Please use another email.');
          } else if (data.error.includes('User already registered')) {
            setError(language === 'zh-CN' ? '该账号已注册，请直接登录' : 'This account is already registered. Please login directly.');
          } else {
            setError(data.error || (language === 'zh-CN' ? '注册失败，请重试' : 'Registration failed. Please try again.'));
          }
          setIsLoading(false);
          return;
        }

        if (data.success && data.user) {
          setRegisterStep('complete');
          
          // Auto-login after registration
          setTimeout(async () => {
            try {
              const loginResponse = await fetch(`${API_BASE}/signin`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify({
                  email: contact,
                  password
                })
              });

              const loginData = await loginResponse.json();

              if (loginData.success && loginData.user && loginData.accessToken) {
                onAuthSuccess(loginData.user, loginData.accessToken);
              }
            } catch (err) {
              console.error('Auto-login error:', err);
              // If auto-login fails, user can still login manually
              setError(language === 'zh-CN' ? '注册成功！请手动登录' : 'Registration successful! Please login manually.');
            }
          }, 2000);
        } else {
          setError(language === 'zh-CN' ? '服务器响应异常' : 'Invalid response from server');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Signup error:', err);
        setError(language === 'zh-CN' ? '网络错误，请检查连接后重试' : 'Network error. Please check your connection and try again.');
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: 'demo-user-' + Math.random().toString(36).substr(2, 9),
        email: 'guest@besv.com',
        name: 'Guest Rider',
        username: 'guest_rider',
        avatar: avatarOptions[0],
        location: 'San Francisco, CA',
      };
      const mockToken = 'mock-jwt-token-' + Date.now();
      onAuthSuccess(mockUser, mockToken);
      setIsLoading(false);
    }, 800);
  };

  const resetRegistration = () => {
    setRegisterStep('contact');
    setContact('');
    setPassword('');
    setUsername('');
    setSelectedAvatar(avatarOptions[0]);
    setShowPassword(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col h-screen max-w-md w-full mx-auto shadow-xl bg-background relative">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex gap-1 bg-card/80 backdrop-blur-sm rounded-lg p-1 shadow-md border border-border">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                language === 'en'
                  ? 'bg-primary text-black font-bold'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('zh-CN')}
              className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                language === 'zh-CN'
                  ? 'bg-primary text-black font-bold'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              简体中文
            </button>
          </div>
        </div>

        {/* Header with Logo */}
        <div className="pt-12 pb-8 px-6 flex flex-col items-center">
            <div className="mb-4">
                <Logo className="w-48 h-auto" variant="light" />
            </div>
          <p className="text-center text-sm text-muted-foreground">
            {language === 'zh-CN' ? 'BESV电动自行车伴侣' : 'BESV Electric Bike Companion'}
          </p>
        </div>

        {/* Auth Content */}
        <div className="flex-1 px-6 pb-8 overflow-auto flex flex-col">
          <Card className="p-6 bg-card border-border shadow-lg flex-1 flex flex-col">
            
            {/* LOGIN PAGE */}
            {authMode === 'login' && (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-foreground">
                    {language === 'zh-CN' ? '欢迎回来' : 'Welcome Back'}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'zh-CN' ? '请登录您的账户' : 'Please login to your account'}
                  </p>
                </div>

                <div className="space-y-4 flex-1">
                  {/* Contact Input */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {language === 'zh-CN' ? '邮箱地址' : 'Email Address'}
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="h-11 pl-10 bg-secondary border-border"
                        />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {language === 'zh-CN' ? '密码' : 'Password'}
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={language === 'zh-CN' ? '请输入密码' : 'Enter your password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-secondary border-border pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80 mt-2">
                      {language === 'zh-CN' ? '忘记密码？' : 'Forgot password?'}
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button
                    onClick={handleLogin}
                    className="w-full h-12 bg-primary text-black hover:bg-primary/90 mt-6 text-base font-bold"
                    disabled={!contact || !password || isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    ) : (
                      <>
                        {language === 'zh-CN' ? '登录' : 'Login'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
                </div>

                {/* Guest Login */}
                <div className="mt-4 text-center">
                  <button 
                    onClick={handleDemoLogin}
                    className="text-xs text-muted-foreground hover:text-primary underline"
                  >
                    {language === 'zh-CN' ? '游客试用 (无需登录)' : 'Try as Guest (No Login Required)'}
                  </button>
                </div>

                {/* Switch to Register */}
                <div className="pt-6 mt-auto border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    {language === 'zh-CN' ? '还没有账户？' : "Don't have an account?"}
                  </p>
                  <Button
                    onClick={() => {
                      setAuthMode('register');
                      resetRegistration();
                      setError(null);
                    }}
                    variant="outline"
                    className="w-full h-12 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary font-bold"
                  >
                    {language === 'zh-CN' ? '创建新账户' : 'Create New Account'}
                  </Button>
                </div>
              </div>
            )}

            {/* REGISTER PAGE */}
            {authMode === 'register' && (
              <div className="space-y-4 flex-1 flex flex-col">
                {/* Header with Back Button */}
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => {
                      if (registerStep === 'contact') {
                        setAuthMode('login');
                        resetRegistration();
                      } else {
                        const steps: RegisterStep[] = ['contact', 'profile', 'password', 'complete'];
                        const currentIndex = steps.indexOf(registerStep);
                        if (currentIndex > 0) {
                          setRegisterStep(steps[currentIndex - 1]);
                        }
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="text-xl font-bold">
                    {language === 'zh-CN' ? '注册账户' : 'Create Account'}
                  </h2>
                </div>

                {/* Registration Progress */}
                <div className="flex items-center justify-between mb-6 px-2">
                  {['contact', 'profile', 'password', 'complete'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                          registerStep === step
                            ? 'bg-primary text-black font-bold'
                            : index < ['contact', 'profile', 'password', 'complete'].indexOf(registerStep)
                            ? 'bg-primary/50 text-black'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {index < ['contact', 'profile', 'password', 'complete'].indexOf(registerStep) ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 3 && (
                        <div
                          className={`w-8 h-0.5 ${
                            index < ['contact', 'profile', 'password', 'complete'].indexOf(registerStep)
                              ? 'bg-primary'
                              : 'bg-secondary'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Step 1: Contact Info */}
                  {registerStep === 'contact' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'zh-CN' ? '联系方式' : 'Contact Information'}
                      </h3>
                      
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          {language === 'zh-CN' ? '邮箱地址' : 'Email Address'}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                            type="email"
                            placeholder="your@email.com"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="h-11 pl-10 bg-secondary border-border"
                            />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Profile Setup (Username & Avatar) */}
                  {registerStep === 'profile' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'zh-CN' ? '个人资料' : 'Profile Details'}
                      </h3>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          {language === 'zh-CN' ? '用户名' : 'Username'}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder={language === 'zh-CN' ? '请输入用户名' : 'Enter your username'}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="h-11 pl-10 bg-secondary border-border"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground mb-3 block">
                          {language === 'zh-CN' ? '选择头像' : 'Choose Avatar'}
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {avatarOptions.map((avatar, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedAvatar(avatar)}
                              className={`aspect-square rounded-full overflow-hidden border-3 transition-all ${
                                selectedAvatar === avatar
                                  ? 'border-primary ring-2 ring-primary/30 scale-110'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Set Password */}
                  {registerStep === 'password' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">
                        {language === 'zh-CN' ? '安全设置' : 'Security'}
                      </h3>
                      <div>
                        <label className="text-sm text-muted-foreground mb-2 block">
                          {language === 'zh-CN' ? '创建密码' : 'Create Password'}
                        </label>
                        <div className="relative mb-3">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={language === 'zh-CN' ? '至少8个字符' : 'At least 8 characters'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 bg-secondary border-border pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${password.length >= 8 ? 'bg-green-500' : 'bg-secondary'}`}>
                              {password.length >= 8 && <Check className="w-3 h-3 text-black" />}
                            </div>
                            {language === 'zh-CN' ? '至少8个字符' : 'At least 8 characters'}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-secondary'}`}>
                              {/[A-Z]/.test(password) && <Check className="w-3 h-3 text-black" />}
                            </div>
                            {language === 'zh-CN' ? '包含大写字母' : 'Contains uppercase letter'}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-secondary'}`}>
                              {/[0-9]/.test(password) && <Check className="w-3 h-3 text-black" />}
                            </div>
                            {language === 'zh-CN' ? '包含数字' : 'Contains number'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Complete */}
                  {registerStep === 'complete' && (
                    <div className="py-12 text-center h-full flex flex-col justify-center">
                      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Check className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {language === 'zh-CN' ? '注册完成！' : 'Registration Complete!'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'zh-CN' ? '欢迎来到Blitz，正在跳转...' : 'Welcome to Blitz. Redirecting to app...'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons for Register */}
                {registerStep !== 'complete' && (
                  <div className="mt-4">
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-500">{error}</p>
                      </div>
                    )}
                    <Button
                      onClick={handleRegisterNext}
                      className="w-full h-12 bg-primary text-black hover:bg-primary/90 font-bold text-base"
                      disabled={
                        (registerStep === 'contact' && !contact) ||
                        (registerStep === 'profile' && !username) ||
                        (registerStep === 'password' && (!password || password.length < 8)) ||
                        isLoading
                      }
                    >
                      {isLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                      ) : (
                        <>
                          {registerStep === 'password' 
                            ? (language === 'zh-CN' ? '完成' : 'Complete')
                            : (language === 'zh-CN' ? '继续' : 'Continue')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-muted-foreground">
            <p>{language === 'zh-CN' ? '继续即表示您同意我们的' : 'By continuing, you agree to our'}</p>
            <p className="mt-1">
              <button className="text-primary hover:underline">
                {language === 'zh-CN' ? '服务条款' : 'Terms of Service'}
              </button>
              {' & '}
              <button className="text-primary hover:underline">
                {language === 'zh-CN' ? '隐私政策' : 'Privacy Policy'}
              </button>
            </p>
          </div>

          {/* Setup Link */}
          <Card className="mt-4 p-4 border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => setShowSetupGuide(true)}>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {language === 'zh-CN' ? '首次使用？' : 'First time here?'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'zh-CN' 
                    ? '查看设置向导，快速上手'
                    : 'Check the setup guide to get started'}
                </p>
                <span className="inline-block mt-2 text-xs text-primary font-medium">
                  {language === 'zh-CN' ? '打开设置向导 →' : 'Open Setup Guide →'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Setup Guide Modal */}
      <Dialog open={showSetupGuide} onOpenChange={setShowSetupGuide}>
        <DialogContent className="max-w-md bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-primary">
              {language === 'zh-CN' ? '欢迎使用 BESV 伴侣' : 'Welcome to BESV Companion'}
            </DialogTitle>
            <DialogDescription>
              {language === 'zh-CN' ? '您的智能骑行生活助手' : 'Your smart riding assistant'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {language === 'zh-CN' ? '创建账户' : 'Create Account'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh-CN' 
                    ? '注册并完善个人资料，设置您的头像和偏好。'
                    : 'Register and complete your profile with avatar and preferences.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-2">
                  <Bike className="w-4 h-4" />
                  {language === 'zh-CN' ? '连接自行车' : 'Connect Bike'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh-CN' 
                    ? '通过蓝牙连接您的 BESV 智能自行车，实时查看电量和状态。'
                    : 'Connect your BESV smart bike via Bluetooth to see real-time battery and status.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-2">
                  <BarChart className="w-4 h-4" />
                  {language === 'zh-CN' ? '记录骑行' : 'Track Rides'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh-CN' 
                    ? '开始骑行，记录您的里程、卡路里和碳减排量。'
                    : 'Start riding to track your distance, calories, and carbon savings.'}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">4</div>
              <div>
                <h3 className="font-medium mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {language === 'zh-CN' ? '加入社区' : 'Join Community'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'zh-CN' 
                    ? '分享您的骑行故事��结识志同道合的朋友。'
                    : 'Share your riding stories and meet like-minded friends.'}
                </p>
              </div>
            </div>
          </div>

          <Button onClick={() => setShowSetupGuide(false)} className="w-full bg-primary text-black font-bold">
            {language === 'zh-CN' ? '开始体验' : 'Get Started'}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}