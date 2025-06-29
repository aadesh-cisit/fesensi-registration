import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React from "react";
import Image from "next/image";
import Countdown from "react-countdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "./button";
import { savetimer } from "@/lib/utils";

export default function FormField({
  readonly,
  label,
  optional,
  name,
  width,
  type = "text",
  placeholder,
  verify,
  value,
  sendotp,
  onChange,
  error,
  inputComponent,
  onVerifyOtp,
  children,
}: {
  readonly?: boolean;
  label?: string;
  optional?: boolean;
  name: string;
  width?: string;
  type?: string;
  placeholder: string;
  verify?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  inputComponent?: React.ReactNode;
  sendotp?: () => Promise<void>;
  onVerifyOtp?: (otp: string) => Promise<void>;
  children?: React.ReactNode;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);

  // OTP timer logic
  const OTP_DURATION = 5 * 60 * 1000; // 5 minutes in ms
  const [otpStart, setOtpStart] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("otp_request");
      return saved ? parseInt(saved) : Date.now();
    }
    return Date.now();
  });

  const handleVerifyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (sendotp) {
      setLoading(true);
      setOtpError(null);
      try {
        await sendotp();
        savetimer();
        setOtpStart(Date.now());
        setDialogOpen(true);
      } catch (err: unknown) {
        setOtpError("Failed to send OTP"+err);
      } finally {
        setLoading(false);
      }
    } else {
      setDialogOpen(true);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onVerifyOtp) {
      setLoading(true);
      setOtpError(null);
      try {
        await onVerifyOtp(otp);
        setDialogOpen(false);
        setOtp("");
      } catch (err: unknown) {
        setOtpError("Invalid OTP"+err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`flex flex-col space-y-1 ${width}`}>
      <div className="flex flex-row items-center  mb-2 gap-4 ">
        <Label htmlFor={name} className=" w-full justify-between">
          <div className="flex flex-row items-center gap-4">
            {label}
            {optional && (
              <span className="text-xs text-gray-400 ml-1">(optional)</span>
            )}
            {error && <p className="text-destructive text-sm ">{error}</p>}
          </div>
          <div className="">
            {verify && (
              <Link
                onClick={handleVerifyClick}
                href={"#"}
                className="text-sm text-blue-500 text-right"
              >
                {loading ? "Sending..." : "verify"}
              </Link>
            )}
          </div>
        </Label>
      </div>
      {children ? (
        children
      ) : inputComponent ? (
        inputComponent
      ) : (
        <Input
          readOnly={readonly}
          className="bg-indigo-50 focus-visible:border-[#] "
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
      {/* OTP Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="aspect-square">
          <DialogHeader>
            <DialogTitle className="text-center text-3xl">
              <div className="mb-4">Verify your email</div>
              <div className="text-gray-600 text-sm">
                we have sent a verification code to your email
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div
              className="flex flex-col items-center space-y-7
            "
            >
              <Image
                src={"/popupfaded.png"}
                className="w-1/3"
                height={50}
                width={50}
                alt="logo"
              />

              <InputOTP maxLength={4} className="text-xl">
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>

              {otpError && <div className="text-destructive">{otpError}</div>}
              <div className="">
                <Countdown
                  date={otpStart + OTP_DURATION}
                  renderer={({ minutes, seconds, completed }) =>
                    completed ? (
                      <Link
                        href={"#"}
                        className="text-blue-500"
                        onClick={handleVerifyClick}
                      >
                        Resend otp
                      </Link>
                    ) : (
                      <span>
                        Resend code in {String(minutes).padStart(2, "0")}:
                        {String(seconds).padStart(2, "0")}
                      </span>
                    )
                  }
                />
              </div>

              <Button className="w-full" onClick={handleOtpSubmit}>
                Verify
              </Button>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
