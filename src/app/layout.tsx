import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "FESENSI",
  description: "AI Driven Tech Support",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >

        <style>
          {`
          .branded-bg {
            background-image: url('/bg.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          .dark .branded-bg {
            background-image: url('/bg.png');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `}
        </style>
        <div className="flex min-h-screen w-full">
         

          <div className="lg:border lg:border-gray-200 w-3/5  branded-bg flex flex-col ">
            <div className="flex flex-col  lg:p-12 gap-3 ">

              <div className="flex flex-col  text-white">
                <h1 className="text-7xl ">Welcome To </h1>
                <span className=" text-7xl font-bold " >FESENSI</span>
                <span className="font-semibold mt-5 tracking-[4px]">AI DRIVEN TECH SUPPORT</span>
              </div>
            </div>
          </div>




          <div className="w-2/5 flex flex-col justify-center items-center bg-white z-10">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
