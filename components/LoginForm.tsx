"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (usernameRef.current) {
      usernameRef.current.focus();
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost/3rdProj/p-o-s-master/phpdata/login.php",
        { username, password }
      );

      console.log("Response:", response.data);

      if (response.data.status === "success") {
        toast({ title: "Login successful", variant: "success" });
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("fullname", response.data.fullname);
        sessionStorage.setItem("role", response.data.role);
        sessionStorage.setItem("shift", response.data.shift);
        sessionStorage.setItem("userId", response.data.id);
        localStorage.setItem("userId", response.data.id);

        if (response.data.role === 0) {
          router.push(`/admin?username=${username}`);
        } else {
          router.push(`/pos?username=${username}`);
        }
      } else {
        toast({
          title: "Login failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast({
        title: "Login failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setTimeout(() => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    }, 100); // Timeout to allow the UI to update
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      if (
        document.activeElement === usernameRef.current &&
        passwordRef.current
      ) {
        passwordRef.current.focus();
      } else {
        handleLogin();
      }
    }
  };

  return (
    <div className="w-full h-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] text-white">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6 p-9">
          <div className="grid gap-2 text-left pb-4">
            <h1 className="text-3xl font-bold text-blue-400">LOGIN</h1>
            <p className="text-balance text-blue-400">
              Enter your credentials below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                className="w-full p-2 text-black bg-white rounded-md"
                ref={usernameRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                className="w-full p-2 text-black bg-white rounded-md"
                ref={passwordRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white">
        <Image
          src="/LOGO.jpg"
          alt="Gaisano Logo"
          width={700}
          height={700}
          className="object-contain"
        />
      </div>
    </div>
  );
}
