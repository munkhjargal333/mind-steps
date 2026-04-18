'use client';

import { useState } from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthContext';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

interface LoginFormProps {
  onError: (error: string | null) => void;
}

export function LoginForm({ onError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    onError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      // Error handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2 group">
        <Label htmlFor="email" className="font-serif text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors">
          И-мэйл хаяг
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-none border-2 border-foreground/20 focus-visible:border-foreground focus-visible:ring-0 font-serif bg-transparent h-12 text-base px-4"
          placeholder="уншигч@газет.мн"
          required
        />
      </div>

      <div className="space-y-2 group">
        <Label htmlFor="password" className="font-serif text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-foreground transition-colors">
          Нууц үг
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-none border-2 border-foreground/20 focus-visible:border-foreground focus-visible:ring-0 font-serif bg-transparent h-12 text-base px-4 pr-12"
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-0 top-0 h-full px-4 text-foreground/40 hover:text-foreground transition-colors border-l-2 border-transparent focus-within:border-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full rounded-none border-2 border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground font-serif font-black uppercase tracking-widest h-14 group transition-all"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin" />
            Баталгаажуулж байна...
          </span>
        ) : (
          <span className="flex items-center">
            Нэвтрэх
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </Button>
    </form>
  );
}