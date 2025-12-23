'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, mockAuthUtils } from '@/store/use-auth-store';
import { useToast } from '@/hooks/useToast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MessageSquare, User, Shield, Lock, Mail } from 'lucide-react';
import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

const Tabs = TabsPrimitive.Root;
const TabsList = TabsPrimitive.List;
const TabsTrigger = TabsPrimitive.Trigger;
const TabsContent = TabsPrimitive.Content;

export { Tabs, TabsList, TabsTrigger, TabsContent };

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { success, error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('form');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Clear any existing errors on mount
  useEffect(() => {
    clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    clearError();
    
    try {
      await login(data);
      success('Login successful! Redirecting...');
      router.push('/dashboard'); 
      // Navigation will be handled by the useEffect above
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid credentials';
      showError('Login failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick login function
  const handleQuickLogin = async (role: 'admin' | 'user') => {
    setIsSubmitting(true);
    clearError();
    
    let credentials: LoginFormData;
    
    if (role === 'admin') {
      credentials = {
        email: 'admin@example.com',
        password: 'password123'
      };
    } else {
      credentials = {
        email: 'user@example.com',
        password: 'password123'
      };
    }
    
    // Set form values
    setValue('email', credentials.email);
    setValue('password', credentials.password);
    
    try {
      await login(credentials);
      success(`Logged in as ${role === 'admin' ? 'Admin' : 'User'}! Redirecting...`);
      // Navigation will be handled by the useEffect above
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid credentials';
      showError('Login failed', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#128C7E] via-[#0D7A6E] to-[#075E54] p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 overflow-hidden">
        {/* Demo badge */}
        {process.env.NODE_ENV === 'development' && mockAuthUtils.isMockEnabled() && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 border-amber-200 hover:bg-amber-500/20">
              Demo Mode
            </Badge>
          </div>
        )}
        
        <CardHeader className="space-y-4 pb-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-[#128C7E] to-[#075E54] shadow-lg">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in to your WhatsApp Business dashboard
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="form" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Manual Login
              </TabsTrigger>
              <TabsTrigger value="quick" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Quick Login
              </TabsTrigger>
            </TabsList>
            
            
            <TabsContent value="form" className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="h-11"
                      {...register('email')}
                      disabled={isSubmitting || isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive px-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11"
                      {...register('password')}
                      disabled={isSubmitting || isLoading}
                    />
                    {errors.password && (
                      <p className="text-sm text-destructive px-1">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* Show store error */}
                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                    <p className="text-sm text-destructive text-center font-medium">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-linear-to-r from-[#128C7E] to-[#075E54] hover:from-[#0D7A6E] hover:to-[#054d43] text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <>
                      <LoadingSpinner size={18} className="mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => setActiveTab('quick')}
                    variant="outline"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Try Demo Accounts
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="quick" className="space-y-6">
              <div className="text-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Select a demo account to login instantly
                </p>
              </div>
              
              <div className="grid gap-4">
                {/* Admin Account */}
                <div className="border rounded-xl p-5 hover:bg-linear-to-br hover:from-purple-50 hover:to-white transition-all duration-200 cursor-pointer group border-purple-100">
                  <button
                    onClick={() => handleQuickLogin('admin')}
                    disabled={isSubmitting || isLoading}
                    className="w-full text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-linear-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-lg group-hover:text-purple-700 transition-colors">Administrator</h4>
                          <Badge className="bg-purple-500/10 text-purple-700 hover:bg-purple-500/20 border-purple-200">
                            Full Access
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">admin@example.com</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-normal">
                            <Lock className="h-3 w-3 mr-1" />
                            password123
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
                
                {/* User Account */}
                <div className="border rounded-xl p-5 hover:bg-linear-to-br hover:from-blue-50 hover:to-white transition-all duration-200 cursor-pointer group border-blue-100">
                  <button
                    onClick={() => handleQuickLogin('user')}
                    disabled={isSubmitting || isLoading}
                    className="w-full text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">Standard User</h4>
                          <Badge variant="outline" className="text-xs">
                            Limited Access
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">user@example.com</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-normal">
                            <Lock className="h-3 w-3 mr-1" />
                            password123
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
              
              {/* Show store error */}
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 border border-destructive/20">
                  <p className="text-sm text-destructive text-center font-medium">{error}</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Button
                  onClick={() => setActiveTab('form')}
                  variant="outline"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Use Custom Credentials
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Development environment info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 pt-6 border-t">
              <div className="rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-blue-900 mb-1">Development Environment</h4>
                    <p className="text-xs text-blue-700">
                      Mock authentication is enabled. You can use the demo accounts above or your own credentials.
                      In production, this will connect to your real authentication backend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}