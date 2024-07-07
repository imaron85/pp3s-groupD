"use client";

import { Button } from "@ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/input-otp";

export default function Join() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-2xl w-full px-6 sm:px-8 lg:px-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Join
          </h1>
          <p className="mt-4 text-lg text-foreground">
            Enter your 6-digit code to join.
          </p>
        </div>
        <div className="mt-12">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <div className="mt-8">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 p-2 rounded-xl">
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
