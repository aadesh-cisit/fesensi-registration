// "use client"

// import React from "react"
// import { z } from "zod"
// import FormField from "../ui/form_field"




// interface PersonalDetailsProps {
//     form: {
//         fullName: string;
//         email: string;
//         password: string;
//         confirmPassword: string;
//         contactNumber: string;
//         department: string;
//         designation: string;
//     };
//     errors: { [key: string]: string };
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const Personal_Details: React.FC<PersonalDetailsProps> = ({ form, errors, onChange }) => {
//     return (

//         <form className="space-y-4" onSubmit={e => e.preventDefault()}>
//             <FormField
//                 label="Full Name"
//                 name="fullName"
//                 placeholder="Enter your full name"
//                 value={form.fullName}
//                 onChange={onChange}
//                 error={errors.fullName}
//             />
//             <FormField
//                 label="Email"
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={onChange}
//                 error={errors.email}
//             />
//             <FormField
//                 label="Create Password"
//                 name="password"
//                 type="password"
//                 placeholder="Create a password"
//                 value={form.password}
//                 onChange={onChange}
//                 error={errors.password}
//             />
//             <FormField
//                 label="Confirm Password"
//                 name="confirmPassword"
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={form.confirmPassword}
//                 onChange={onChange}
//                 error={errors.confirmPassword}
//             />
//             <FormField
//                 label="Contact Number"
//                 name="contactNumber"
//                 placeholder="Enter your contact number"
//                 value={form.contactNumber}
//                 onChange={onChange}
//                 error={errors.contactNumber}
//             />
//             <FormField
//                 label="Department"
//                 name="department"
//                 optional={true}
//                 placeholder="Enter your department"
//                 value={form.department}
//                 onChange={onChange}
//                 error={errors.department}
//             />
//             <FormField
//                 label="Designation"
//                 name="designation"
//                 optional={true}
//                 placeholder="Enter your designation"
//                 value={form.designation}
//                 onChange={onChange}
//                 error={errors.designation}
//             />
//         </form>
//     )
// }

// export default Personal_Details
 
  //---- popup1------
// import { Button } from "@/components/ui/button";

// export default function Home() {
//   const handleVerifyClick = () => {
//     console.log("Verify clicked");
//   };

//   const handleContinueClick = () => {
//     console.log("Continue without verifying clicked");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white rounded-xl shadow-md w-full max-w-md p-6 border border-gray-200">
//         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
//           Your email is not verified
//         </h2>
//         <p className="text-sm sm:text-base text-gray-500 mb-6">
//           Do you wish to continue without verifying your email?
//         </p>

//         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//           <Button
//             onClick={handleVerifyClick}
//             className="w-full sm:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90"
//           >
//             Verify
//           </Button>

//           <Button
//             onClick={handleContinueClick}
//             variant="outline"
//             className="w-full sm:w-1/2 text-blue-700 border-blue-200 hover:bg-blue-50"
//           >
//             Continue
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

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

// import Image from "next/image";

// export default function RegistrationComplete() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <div className="text-center">
        
//         <div className="flex justify-center mb-6">
//           <Image
//             src="/Vector (1).png" 
//             alt="Verified"
//             width={200}
//             height={120}
//             priority
//           />
//         </div>

//         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
//           Your registration is complete. Let the journey begin!
//         </h2>

//         <p className="text-sm sm:text-base text-gray-500">
//           Check your email for further details
//         </p>
//       </div>
//     </div>
//   );
// }

