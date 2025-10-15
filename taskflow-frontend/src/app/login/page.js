"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { use, useState } from "react";
import { loginUser } from "@/store/slices/authSlice";

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const result = await dispatch(loginStart(formData));
    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
      console.log("Login successful");
    } else {
      console.error("Login failed:", result.payload);
    }
    console.log("Form Data:", formData);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md shadown-2xl border-0">
        <CardHeader className={"space-y-1 text-center"}>
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to your account to continue to TaskFlow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                name="email"
                onChange={handleChange}
                required
                className={"h-11"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  name="password"
                  onChange={handleChange}
                  required
                  className={"h-11 pr-10"}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  type="button"
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <Eye />
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className={
                "w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              }
            >
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account?</span>
            <Link
              href={"/register"}
              className="font-semibold text-blue-600 hover:underline"
            >
              Create One
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
