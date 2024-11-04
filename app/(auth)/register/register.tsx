"use client";
import React, { useState }  from "react";
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
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { useNewMemberReg } from "@/lib/useNewMemberReg";

const schema = z.object({
  Email: z.string().email({ message: "Invalid email address" }),
  Password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  Member_Id: z.string().min(1, { message: "Member ID is required" }),
  PhoneNumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number" }),
});

type FormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { registerNewUser: registerNewMember } = useNewMemberReg();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });


  
  const onSubmit = async (data: FormData) => {

    registerNewMember(data);



    
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Join WorshipLink</h1>
        <p className="text-gray-600">Create your account to get started</p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  {...register("Email")}
                  placeholder="Email"
                  className="pl-10"
                />
                {errors.Email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Email.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  {...register("Password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.Password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Password.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  {...register("Member_Id")}
                  placeholder="Member ID"
                  className="pl-10"
                />
                {errors.Member_Id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.Member_Id.message}
                  </p>
                )}
              </div>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  {...register("PhoneNumber")}
                  placeholder="Phone Number"
                  className="pl-10"
                />
                {errors.PhoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.PhoneNumber.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default RegisterPage;
