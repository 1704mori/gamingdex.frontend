"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User } from "lucide-react";
import { API_URL } from "@/lib/utils";
import { toast } from "sonner";
import { setTokenToCookie } from "@/lib/jwt";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const router = useRouter();

  useEffect(() => {
    signupForm.reset();
    loginForm.reset();
  }, [isLogin]);

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json<{
      accessToken: string;
      refreshToken: string;
    }>();

    if (result.result == "error") {
      toast.error(result.message);
      return;
    }

    let error = await setTokenToCookie(
      result.attributes?.accessToken!,
      "gd:accessToken",
    );
    if (error != "") {
      toast.error("Could not log you in this time, try again.");
      return;
    }

    error = await setTokenToCookie(
      result.attributes?.refreshToken!,
      "gd:refreshToken",
    );
    if (error != "") {
      toast.error("Could not log you in this time, try again.");
      return;
    }

    toast.success("Logged in, redirection you.");
    router.push("/");
  };

  const onSignupSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json<{
      accessToken: string;
      refreshToken: string;
    }>();

    if (result.result == "error") {
      toast.error(result.message);
      return;
    }

    await onLoginSubmit({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <main className="flex flex-col min-h-screen">
      <section className="flex-grow w-full py-20 bg-neutral-900 text-neutral-50 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? "Log In" : "Sign Up"}
              </h1>
              <p className="text-neutral-400">
                {isLogin
                  ? "Welcome back! Please log in to your account."
                  : "Create a new account to get started."}
              </p>
            </div>

            {isLogin ? (
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <Input
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="Email"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <Input
                    {...loginForm.register("password")}
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                  {loginForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Log In
                </Button>
              </form>
            ) : (
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="w-full space-y-4"
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <Input
                    {...signupForm.register("username")}
                    type="text"
                    placeholder="Username"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                  {signupForm.formState.errors.username && (
                    <p className="mt-1 text-sm text-red-500">
                      {signupForm.formState.errors.username.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <Input
                    {...signupForm.register("email")}
                    type="email"
                    placeholder="Email"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                  <Input
                    {...signupForm.register("password")}
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-neutral-800 border-neutral-700 text-neutral-100"
                  />
                  {signupForm.formState.errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Sign Up
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-neutral-400">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={toggleAuthMode}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>

            {isLogin && (
              <button className="mt-4 text-blue-500 hover:underline">
                Forgot password?
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
