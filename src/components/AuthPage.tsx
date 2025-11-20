import { useState } from 'react';
import { Mail, Phone, ArrowRight, Check, User, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';
import { getTranslation } from '../locales/translations';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { seedUsers } from '../data/seedUsers';
import { Logo } from './ui/Logo';

type AuthMode = 'login' | 'register';
type ContactType = 'email' | 'phone';
type RegisterStep = 'contact' | 'profile' | 'password' | 'complete';

interface AuthPageProps {
  onAuthSuccess: (userData: any, accessToken?: string) => void;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/server/make-server-8ab7634a`;

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
  const [contactType, setContactType] = useState<ContactType>('email');
  const [registerStep, setRegisterStep] = useState<RegisterStep>('contact');
  
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

  // Validate phone format
  const isValidPhone = (phone: string) => {
    // Simple phone validation - at least 10 digits
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
  };

  // Handle login
  const handleLogin = async () => {
    if (!contact || !password) return;

    // Validate format
    if (contactType === 'email' && !isValidEmail(contact)) {
      setError(language === 'zh-CN' ? '请输入有效的邮箱地址，例如：user@example.com' : 'Please enter a valid email address, e.g.: user@example.com');
      return;
    }

    if (contactType === 'phone' && !isValidPhone(contact)) {
      setError(language === 'zh-CN' ? '请输入有效的手机号码' : 'Please enter a valid phone number');
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
          email: contactType === 'email' ? contact : undefined,
          phone: contactType === 'phone' ? contact : undefined,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login error:', data.error);
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
      if (contactType === 'email' && !isValidEmail(contact)) {
        setError(language === 'zh-CN' ? '请输入有效的邮箱地址，例如：user@example.com' : 'Please enter a valid email address, e.g.: user@example.com');
        return;
      }

      if (contactType === 'phone' && !isValidPhone(contact)) {
        setError(language === 'zh-CN' ? '请输入有效的手机号码' : 'Please enter a valid phone number');
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
        // Check if this email belongs to a seed user
        const seedUser = seedUsers.find(user => user.email === contact);
        
        const response = await fetch(`${API_BASE}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email: contactType === 'email' ? contact : undefined,
            phone: contactType === 'phone' ? contact : undefined,
            password,
            username,
            avatar: selectedAvatar,
            contactType,
            // If this is a seed user, pass their seed data
            seedData: seedUser ? seedUser : undefined
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
                  email: contactType === 'email' ? contact : undefined,
                  phone: contactType === 'phone' ? contact : undefined,
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

  const resetRegistration = () => {
    setRegisterStep('contact');
    setContact('');
    setPassword('');
    setUsername('');
    setSelectedAvatar(avatarOptions[0]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background text-foreground">
      <div className="flex flex-col h-screen max-w-md w-full mx-auto shadow-xl bg-background">
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

        {/* Logo Header */}
        <div className="pt-12 pb-8 px-6 flex flex-col items-center">
            {/* Replaced old logo with new Blitz Logo Component */}
            <div className="mb-4">
                <Logo className="w-48 h-auto" variant="light" />
            </div>
          <p className="text-center text-sm text-muted-foreground">
            {language === 'zh-CN' ? 'BESV电动自行车伴侣' : 'BESV Electric Bike Companion'}
          </p>
        </div>

        {/* Auth Content */}
        <div className="flex-1 px-6 pb-8 overflow-auto">
          <Card className="p-6 bg-card border-border shadow-lg">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-secondary rounded-lg">
              <button
                onClick={() => {
                  setAuthMode('login');
                  resetRegistration();
                }}
                className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${
                  authMode === 'login'
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {language === 'zh-CN' ? '登录' : 'Login'}
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  resetRegistration();
                }}
                className={`flex-1 py-2 rounded-md transition-all text-sm font-medium ${
                  authMode === 'register'
                    ? 'bg-primary text-black shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {language === 'zh-CN' ? '注册' : 'Register'}
              </button>
            </div>

            {/* Login Form */}
            {authMode === 'login' && (
              <div className="space-y-4">
                {/* Contact Type Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setContactType('email')}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm flex items-center justify-center gap-2 ${
                      contactType === 'email'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    {language === 'zh-CN' ? '邮箱' : 'Email'}
                  </button>
                  <button
                    onClick={() => setContactType('phone')}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm flex items-center justify-center gap-2 ${
                      contactType === 'phone'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    {language === 'zh-CN' ? '手机' : 'Phone'}
                  </button>
                </div>

                {/* Contact Input */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {contactType === 'email' 
                      ? (language === 'zh-CN' ? '邮箱地址' : 'Email Address')
                      : (language === 'zh-CN' ? '手机号码' : 'Phone Number')}
                  </label>
                  <Input
                    type={contactType === 'email' ? 'email' : 'tel'}
                    placeholder={contactType === 'email' ? 'your@email.com' : '+1 234 567 8900'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-11 bg-secondary border-border"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {language === 'zh-CN' ? '密码' : 'Password'}
                  </label>
                  <Input
                    type="password"
                    placeholder={language === 'zh-CN' ? '请输入密码' : 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-secondary border-border"
                  />
                  <button className="text-xs text-primary hover:text-primary/80 mt-2">
                    {language === 'zh-CN' ? '忘记密码？' : 'Forgot password?'}
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  className="w-full h-11 bg-primary text-black hover:bg-primary/90 mt-6 text-base font-bold"
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
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
            )}

            {/* Register Form */}
            {authMode === 'register' && (
              <div className="space-y-4">
                {/* Registration Progress */}
                <div className="flex items-center justify-between mb-6">
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

                {/* Step 1: Contact Info */}
                {registerStep === 'contact' && (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setContactType('email')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm flex items-center justify-center gap-2 ${
                          contactType === 'email'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        {language === 'zh-CN' ? '邮箱' : 'Email'}
                      </button>
                      <button
                        onClick={() => setContactType('phone')}
                        className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all text-sm flex items-center justify-center gap-2 ${
                          contactType === 'phone'
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        {language === 'zh-CN' ? '手机' : 'Phone'}
                      </button>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        {contactType === 'email' 
                          ? (language === 'zh-CN' ? '邮箱地址' : 'Email Address')
                          : (language === 'zh-CN' ? '手机号码' : 'Phone Number')}
                      </label>
                      <Input
                        type={contactType === 'email' ? 'email' : 'tel'}
                        placeholder={contactType === 'email' ? 'your@email.com' : '+1 234 567 8900'}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="h-11 bg-secondary border-border"
                      />
                    </div>
                  </>
                )}

                {/* Step 2: Profile Setup (Username & Avatar) */}
                {registerStep === 'profile' && (
                  <div className="space-y-4">
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
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {language === 'zh-CN' ? '创建密码' : 'Create Password'}
                    </label>
                    <Input
                      type="password"
                      placeholder={language === 'zh-CN' ? '至少8个字符' : 'At least 8 characters'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 mb-3 bg-secondary border-border"
                    />
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
                )}

                {/* Step 4: Complete */}
                {registerStep === 'complete' && (
                  <div className="py-8 text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <Check className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-xl text-foreground mb-2">
                      {language === 'zh-CN' ? '注册完成！' : 'Registration Complete!'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'zh-CN' ? '欢迎来到Blitz，正在跳转...' : 'Welcome to Blitz. Redirecting to app...'}
                    </p>
                  </div>
                )}

                {/* Navigation Buttons */}
                {registerStep !== 'complete' && (
                  <>
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-500">{error}</p>
                      </div>
                    )}
                    <div className="flex gap-3 mt-6">
                      {registerStep !== 'contact' && (
                        <Button
                          onClick={() => {
                            const steps: RegisterStep[] = ['contact', 'profile', 'password', 'complete'];
                            const currentIndex = steps.indexOf(registerStep);
                            if (currentIndex > 0) {
                              setRegisterStep(steps[currentIndex - 1]);
                            }
                          }}
                          variant="outline"
                          className="flex-1 h-11 border-border hover:bg-secondary"
                        >
                          {language === 'zh-CN' ? '返回' : 'Back'}
                        </Button>
                      )}
                      <Button
                        onClick={handleRegisterNext}
                        className="flex-1 h-11 bg-primary text-black hover:bg-primary/90 font-bold"
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
                  </>
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
          <Card className="mt-4 p-4 border-primary/30 bg-primary/5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm">
                  {language === 'zh-CN' ? '首次使用？' : 'First time here?'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {language === 'zh-CN' 
                    ? '运行初始化设置创建测试用户和示例数据'
                    : 'Run the setup to create test users and sample data'}
                </p>
                <a 
                  href="/setup.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs text-primary hover:underline font-medium"
                >
                  {language === 'zh-CN' ? '打开设置向导 →' : 'Open Setup Guide →'}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}