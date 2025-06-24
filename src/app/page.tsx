import Image from "next/image";
import { Button } from "@/components/ui/button";
export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <Button>button</Button>
      <p className="text-lg text-gray-700">This is a simple Next.js application.</p>
    </div>
  );
}