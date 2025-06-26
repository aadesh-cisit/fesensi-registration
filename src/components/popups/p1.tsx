import { Button } from "@/components/ui/button";

export default function Home() {
  const handleVerifyClick = () => {
    console.log("Verify clicked");
  };

  const handleContinueClick = () => {
    console.log("Continue without verifying clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Your email is not verified
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6">
          Do you wish to continue without verifying your email?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            onClick={handleVerifyClick}
            className="w-full sm:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
          >
            Verify
          </Button>

          <Button
            onClick={handleContinueClick}
            variant="outline"
            className="w-full sm:w-1/2 text-blue-700 border-blue-200 hover:bg-blue-50"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}