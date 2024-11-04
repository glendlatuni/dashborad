/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLogin } from "@/lib/useLogin";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const { login } = useLogin();
  const onSubmit = async (e: FormData) => {
    console.log(e);

    try {
      setServerError(null);

      const result: any = await login(email, password);

      return result;
    } catch (error: any) {
      setServerError("Invalid email or password");

      // Set error untuk field-field specific
      setError("email", {
        type: "server",
        message: "Invalid email or password",
      });
      setError("password", {
        type: "server",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to WorshipLink
        </h1>
        <p className="text-gray-600">Please log in to access your account</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {serverError}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative">
                {" "}
                <Mail
                  className={`absolute left-3 transform -translate-y-1/2 text-gray-400 ${
                    errors.email ? "top-4" : "top-1/2"
                  }`}
                  size={20}
                />
                <Input
                  {...register("email")}
                  placeholder="Email"
                  className="pl-10 pr-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <Lock
                  className={`absolute left-3 transform -translate-y-1/2 text-gray-400 ${
                    errors.password ? "top-4" : "top-1/2"
                  }`}
                  size={20}
                />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10 "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Dont have an account?
            <Link href="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default LoginPage;
