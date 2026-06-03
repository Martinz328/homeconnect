'use client'

import { Input } from '@/components/ui/input'

export function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4">
      <div className="w-full max-w-[340px] bg-white rounded-[12px] p-6">
        {/* Title */}
        <h1 className="font-plus-jakarta font-bold text-[22px] text-[#D4500A] text-center mb-1">
          HomeConnect Admin
        </h1>
        
        {/* Subtitle */}
        <p className="font-inter font-normal text-[14px] text-[#6C6C70] text-center mb-6">
          Sign in to manage listings.
        </p>

        {/* Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="font-inter font-medium text-[14px] text-[#1C1C1E] mb-1.5 block">
              Email
            </label>
            <Input 
              type="email"
              placeholder="admin@homeconnect.com"
              className="h-12 text-[14px] rounded-[8px]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-inter font-medium text-[14px] text-[#1C1C1E] mb-1.5 block">
              Password
            </label>
            <Input 
              type="password"
              placeholder="••••••••"
              className="h-12 text-[14px] rounded-[8px]"
            />
          </div>

          {/* Sign In Button */}
          <button 
            type="submit"
            className="w-full h-[52px] bg-[#D4500A] text-white font-inter font-semibold text-[14px] rounded-[8px] mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
