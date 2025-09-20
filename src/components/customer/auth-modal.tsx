'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCustomer } from './customer-context';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    acceptsMarketing: false,
  });
  const [errors, setErrors] = useState<string[]>([]);

  const { state, login, register, recoverPassword } = useCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    try {
      if (mode === 'login') {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setErrors(result.errors.map((err: any) => err.message));
        }
      } else if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setErrors(['Passwords do not match']);
          return;
        }

        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          acceptsMarketing: formData.acceptsMarketing,
        });

        if (result.success) {
          onClose();
          resetForm();
        } else {
          setErrors(result.errors.map((err: any) => err.message));
        }
      } else if (mode === 'forgot') {
        const result = await recoverPassword(formData.email);
        if (result.success) {
          setErrors(['Password reset email sent! Check your inbox.']);
          setTimeout(() => {
            setMode('login');
            setErrors([]);
          }, 3000);
        } else {
          setErrors(result.errors.map((err: any) => err.message));
        }
      }
    } catch (error) {
      setErrors(['An unexpected error occurred. Please try again.']);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      acceptsMarketing: false,
    });
    setErrors([]);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'forgot':
        return 'Reset Password';
      default:
        return 'Sign In';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {getTitle()}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {mode === 'login' && 'Welcome back! Sign in to your account'}
            {mode === 'register' && 'Create a new account to get started'}
            {mode === 'forgot' && 'Enter your email to reset your password'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field - not shown in forgot mode */}
          {mode !== 'forgot' && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
          )}

          {/* Confirm Password Field - only in register mode */}
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
          )}

          {/* Additional fields for registration */}
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="marketing"
                  type="checkbox"
                  checked={formData.acceptsMarketing}
                  onChange={(e) => handleInputChange('acceptsMarketing', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="marketing" className="text-sm">
                  I want to receive marketing emails about new products and offers
                </Label>
              </div>
            </>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={state.isLoading}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'login' ? 'Signing in...' : mode === 'register' ? 'Creating account...' : 'Sending reset email...'}
              </>
            ) : (
              getTitle()
            )}
          </Button>

          {/* Mode Switch Links */}
          <div className="space-y-2">
            <Separator />
            
            {mode === 'login' && (
              <div className="text-center space-y-2">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('forgot')}
                  className="text-sm"
                >
                  Forgot your password?
                </Button>
                <div className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setMode('register')}
                    className="p-0 h-auto text-sm font-medium"
                  >
                    Sign up
                  </Button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('login')}
                  className="p-0 h-auto text-sm font-medium"
                >
                  Sign in
                </Button>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setMode('login')}
                  className="p-0 h-auto text-sm font-medium"
                >
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
