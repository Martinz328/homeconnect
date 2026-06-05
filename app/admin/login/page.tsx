"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminLogin } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await adminLogin(email, password);

    setIsLoading(false);

    if (result.success) {
      router.push("/admin");
      return;
    }

    setError("Invalid credentials");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] p-4">
      <div className="w-full max-w-[340px] rounded-[12px] bg-white p-6">
        <h1 className="mb-1 text-center font-jakarta text-[22px] font-bold text-[#D4500A]">
          HomeConnect Admin
        </h1>

        <p className="mb-6 text-center font-inter text-[14px] font-normal text-[#6C6C70]">
          Sign in to manage listings.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
              Email
            </label>
            <Input
              type="email"
              placeholder="admin@homeconnect.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 rounded-[8px] text-[14px]"
            />
          </div>

          <div>
            <label className="mb-1.5 block font-inter text-[14px] font-medium text-[#1C1C1E]">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 rounded-[8px] text-[14px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-[52px] w-full rounded-[8px] bg-[#D4500A] font-inter text-[14px] font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </button>

          {error && (
            <p className="text-center text-[14px] text-[#C0392B]">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
}
