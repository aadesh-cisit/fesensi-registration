
import Image from "next/image";

export default function RegistrationComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center">
        
        <div className="flex justify-center mb-6">
          <Image
            src="/Vector (1).png" 
            alt="Verified"
            width={200}
            height={120}
            priority
          />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Your registration is complete. Let the journey begin!
        </h2>

        <p className="text-sm sm:text-base text-gray-500">
          Check your email for further details
        </p>
      </div>
    </div>
  );
}

