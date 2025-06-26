
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";

export default function EmailVerified() {
  const handleContinue = () => {
    console.log("Continue clicked");
  };

  const handleClose = () => {
    console.log("Close clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm text-center p-6 relative">
        
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Verify your email
        </h2>

        
        <div className="flex justify-center mb-6">
          <Image
            src="/Vector (1).png" // ✅ Correct path if image is in /public
            alt="Verified Icon"
            width={200}
            height={140}
            priority
          />
        </div>

       
        <p className="text-gray-600 mb-6">Your email is now verified</p>


        <Button
          onClick={handleContinue}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}