"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/models/signUpSchema";
import { z } from "zod";
import FormErrors from "@/components/custom/FormErrors";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {status} = useSession();

  useEffect(()=>{
    if(status==='authenticated'){
      setIsLoading(false);
      router.push("/dashboard");
    }
    else if(status==='loading'){
      setIsLoading(true);
    }
  },[status,router]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      signIn("credentials", {
        ...data,
        redirect: false,
      });
    } catch (error) {
      console.log(error);
      toast.error("Sign Up Error!",{id:"SIGNUP_ERROR"});
    } finally {
      setIsLoading(false);
    }
  };

  const googleSigin = () => {
    setIsLoading(true);
    try {
      signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      console.log(error);
      toast.error("error while google sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative mx-auto flex flex-col items-center justify-center min-h-screen">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="text-center">
          <h1 className="font-medium text-3xl text-primary">{"Sign Up"}</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col flex-1  space-y-6">
            <div className="flex flex-col relative">
              <label htmlFor="username">username</label>
              <Input
                type="text"
                disabled={isLoading}
                placeholder="username"
                className={cn({
                  "border-red-500  focus:outline-none focus:ring-2 focus:ring-red-500":
                    errors.username,
                  "border-gray-300": !errors.username,
                })}
                {...register("username")}
                required
                aria-required="true"
              />
              {errors.username?.message && (
                <FormErrors message={errors.username?.message} />
              )}
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="email">Email</label>
              <Input
                type="text"
                disabled={isLoading}
                placeholder="Email"
                className={cn({
                  "border-red-500  focus:outline-none focus:ring-2 focus:ring-red-500":
                    errors.email,
                  "border-gray-300": !errors.email,
                })}
                {...register("email")}
                required
                aria-required="true"
              />
              {errors.email?.message && (
                <FormErrors message={errors.email?.message} />
              )}
            </div>
            <div className="flex flex-col relative">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                disabled={isLoading}
                placeholder="Password"
                className={cn({
                  "border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500":
                    errors.password,
                  "border-gray-300": !errors.password,
                })}
                {...register("password")}
                required
                aria-required="true"
              />
              {errors.password?.message && (
                <FormErrors message={errors.password.message} />
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              Sign Up
            </Button>
            <p className="text-sm">
              {"Already have an account ? "}
              <Link
                href={"/login"}
                className="text-primary underline underline-offset-2"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
        <div className="flex gap-2 items-center">
          <hr className="flex-grow  " />
          <span className="inline-block">or</span>
          <hr className="flex-grow" />
        </div>
        <Button
          type="button"
          disabled={isLoading}
          variant={"secondary"}
          className="flex gap-2"
          onClick={googleSigin}
        >
          {!isLoading ? (
            <span className="icon-[logos--google-icon] w-4 h-4"></span>
          ) : (
            <span className="animate-spin">
              <Loader2></Loader2>
            </span>
          )}
          Continue With Google
        </Button>
      </div>
    </div>
  );
}
