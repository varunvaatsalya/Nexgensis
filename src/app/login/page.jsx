"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Package,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";

import { authService } from "@/services/auth.service";
import { setAuthToken, setAuthUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirect") || "/products";
  const sessionExpired = searchParams?.get("session_expired");

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(sessionExpired ? "Your session expired. Please log in again." : null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultUsername = process.env.NEXT_PUBLIC_DEMO_USERNAME || "emilys";
  const defaultPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "emilyspass";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: defaultUsername,
      password: defaultPassword,
    },
  });

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await authService.login({
        username: data.username.trim(),
        password: data.password,
        expiresInMins: 120,
      });

      if (response && response.accessToken) {
        setAuthToken(response.accessToken);

        const userProfile = {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          gender: response.gender,
          image: response.image,
        };
        setAuthUser(userProfile);

        toast.success(`Welcome back, ${response.firstName || response.username}!`, {
          description: "Logged in successfully.",
        });

        router.push(redirectTo);
        router.refresh();
      } else {
        throw new Error("Invalid response received from authentication server.");
      }
    } catch (err) {
      const errorMessage =
        err?.status === 400
          ? "Invalid username or password. Please verify the demo credentials below."
          : err?.message || "Authentication failed. Please try again.";
      setApiError(errorMessage);
      toast.error("Login Failed", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setValue("username", defaultUsername, { shouldValidate: true });
    setValue("password", defaultPassword, { shouldValidate: true });
    setApiError(null);
    toast.info("Demo credentials filled!");
  };

  return (
    <Card className="w-full max-w-md border-border/80 shadow-2xl backdrop-blur-xl bg-card/95">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 ring-8 ring-primary/5">
          <Package className="size-6" />
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          Admin Sign In
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Sign in to access your product inventory and catalog management dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Inline error display */}
        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
          >
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{apiError}</div>
          </div>
        )}

        {/* Demo Credentials Quick Banner */}
        <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="size-4 text-primary shrink-0" />
            <span>
              Demo: <strong className="text-foreground">{defaultUsername}</strong> / <strong className="text-foreground">{defaultPassword}</strong>
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={handleFillDemo}
            className="h-7 text-xs font-semibold text-primary hover:text-primary"
          >
            Auto-fill
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Username field */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="pl-10"
                disabled={isSubmitting}
                {...register("username")}
              />
            </div>
            {errors.username && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="size-3" />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                disabled={isSubmitting}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-destructive font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="size-3" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button with spinner + double click protection */}
          <Button
            type="submit"
            className="w-full h-10 mt-2 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/40 text-center text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="size-4 text-primary" />
          <span>Secure authentication via DummyJSON API</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-radial from-background via-background to-muted/40">
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-12 gap-3 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading login portal...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
