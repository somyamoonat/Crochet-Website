"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  StitchDivider,
  Container,
} from "@/components/ui";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (!result || result.error) {
        setError("Invalid email or password. Please verify your credentials.");
        setIsLoading(false);
        return;
      }

      // Successful sign in: determine target URL
      const isAdmin = email.trim().toLowerCase().startsWith("admin") || email.trim().toLowerCase().includes("admin@");
      const targetUrl = searchParams.get("callbackUrl") || (isAdmin ? "/admin" : "/account");

      // Full navigation ensures the session cookie is active on the destination page
      window.location.href = targetUrl;
    } catch (err) {
      console.error("Sign in error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[90vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Container size="sm">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-brand-primary transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Boutique
          </Link>
        </div>

        <Card className="border border-[#E7DED0] bg-white/95 shadow-[0_10px_35px_-10px_rgba(43,36,32,0.1)]">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-1">
              <span className="font-handwriting text-3xl font-bold text-brand-primary">
                Handcrafted with Love
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-brand-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-stone-600 text-sm max-w-sm mx-auto">
              Sign in to your Crochet Diary account to view orders and saved addresses.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Friendly Guest Checkout Note */}
            <div className="rounded-2xl bg-[#FAF3EA] border border-[#ECDCCB] p-3.5 text-xs text-stone-700 flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-brand-primary shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-brand-text">Shopping as a guest?</strong> No password needed! Guest checkout is always available during checkout.
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 text-center border-t border-stone-100 pt-5">
            <p className="text-xs text-stone-600">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-semibold text-brand-primary hover:underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        <StitchDivider variant="loops" color="muted" className="my-8" />
      </Container>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <main className="min-h-[70vh] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-primary border-t-transparent" />
        </main>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
