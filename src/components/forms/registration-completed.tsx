import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";

export default function RegistrationCompleted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-10">
      <Image src="/logo.png" alt="Logo" width={100} height={100} className="mb-6" />
      <h2 className="text-2xl font-bold mb-2 text-center">Registration Complete!</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Thank you for registering your organization. Your onboarding is now complete. You can now access your dashboard or download your registration receipt.
      </p>
      <div className="flex gap-4">
        <Button className="w-40">Go to Dashboard</Button>
        <Button variant="outline" className="w-40">Download Receipt</Button>
      </div>
    </div>
  );
} 