"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccess("Account created successfully! Signing you in...");

      // Automatically sign in the user
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (signInResult?.ok) {
        router.push("/account");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
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
                Join our cozy corner
              </span>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-brand-text">
              Create an Account
            </CardTitle>
            <CardDescription className="text-stone-600 text-sm max-w-sm mx-auto">
              Save your address for quick delivery &amp; track your handmade orders.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error & Success Alerts */}
            {error && (
              <div
                role="alert"
                className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs text-red-700 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div
                role="alert"
                className="rounded-2xl bg-[#EBF2EA] border border-[#D1E0CE] p-3.5 text-xs text-[#3B4D36] flex items-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4 text-brand-secondary shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Nitika Tanted"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
              />

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
                label="Phone Number (Optional)"
                type="tel"
                autoComplete="tel"
                placeholder="10-digit mobile number"
                helperText="Used for order and delivery coordination"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                leftIcon={<Phone className="h-4 w-4" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                />

                <Input
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-3"
              >
                Create Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 text-center border-t border-stone-100 pt-5">
            <p className="text-xs text-stone-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-brand-primary hover:underline underline-offset-4"
              >
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>

        <StitchDivider variant="loops" color="muted" className="my-8" />
      </Container>
    </main>
  );
}
