'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { copy } from '@/lib/copy';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChefHat, Loader2 } from 'lucide-react';

const auth = copy.auth;
const common = copy.common;

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(auth.signInError);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('admin_profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (!profile?.is_admin) {
          setError(auth.adminOnly);
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError(auth.signInError);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-serif text-2xl">
            {common.siteName} Admin
          </CardTitle>
          <CardDescription>{auth.signIn}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{auth.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{auth.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {common.loading}
                </>
              ) : (
                auth.signIn
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
