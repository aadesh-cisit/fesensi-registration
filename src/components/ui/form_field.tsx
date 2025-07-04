import Link from "next/link";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { forwardRef, useImperativeHandle } from "react";
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
import { verifySchema } from "@/lib/zodSchemas";
import { ZodError } from "zod";

export type FormFieldRef = {
  isVerified: boolean;
  showEmailNotVerifiedDialog: () => void;
};

type FormFieldProps = {
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
  fullForm?: { fullName: string; email: string };
  onVerifiedChange?: (verified: boolean) => void;
};

const FormField = forwardRef<FormFieldRef, FormFieldProps>(function FormField({
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
  fullForm,
  onVerifiedChange,
}, ref) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [isVerified, setIsVerified] = React.useState(false);
  const [showVerifiedPopup, setShowVerifiedPopup] = React.useState(false);
  const [verifyFieldError, setVerifyFieldError] = React.useState<string | null>(
    null
  );
  const [verifyFieldErrors, setVerifyFieldErrors] = React.useState<string[]>(
    []
  );
  const [showEmailNotVerifiedPopup, setShowEmailNotVerifiedPopup] = React.useState(false);

  // OTP timer logic
  const OTP_DURATION = 5 * 60 * 1000;
  const [otpStart, setOtpStart] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("otp_request");
      return saved ? parseInt(saved) : Date.now();
    }
    return Date.now();
  });

  // Helper to get and set verification status in localStorage
  const getVerifiedStatus = (email: string) => {
    if (typeof window === "undefined") return false;
    const data = sessionStorage.getItem("verifiedEmails");
    if (!data) return false;
    try {
      const parsed = JSON.parse(data);
      return parsed[email] === true;
    } catch {
      return false;
    }
  };
  const setVerifiedStatus = (email: string, status: boolean) => {
    if (typeof window === "undefined") return;
    let parsed: Record<string, boolean> = {};
    const data = sessionStorage.getItem("verifiedEmails");
    if (data) {
      try {
        parsed = JSON.parse(data);
      } catch {}
    }
    parsed[email] = status;
    sessionStorage.setItem("verifiedEmails", JSON.stringify(parsed));
  };
  const lastVerifiedEmailRef = React.useRef<string | undefined>(undefined);

  useImperativeHandle(ref, () => ({
    isVerified,
    showEmailNotVerifiedDialog: () => setShowEmailNotVerifiedPopup(true),
  }), [isVerified]);

  const handleVerifyClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setVerifyFieldError(null);
    setVerifyFieldErrors([]);
    try {
      if (fullForm) {
        verifySchema.parse({
          fullName: fullForm.fullName,
          email: fullForm.email,
        });
      } else {
        verifySchema.parse({
          fullName: value,
          email: name === "email" ? value : "",
        });
      }
    } catch (err) {
      if (err instanceof ZodError) {
        setVerifyFieldErrors(err.errors.map((e) => e.message));
      } else if (err instanceof Error) {
        setVerifyFieldError(err.message);
      } else if (typeof err === "string") {
        setVerifyFieldError(err);
      } else {
        setVerifyFieldError("Validation failed");
      }
      return;
    }
    if (sendotp) {
      setLoading(true);
      setOtpError(null);
      try {
        await sendotp();
        savetimer();
        setOtpStart(Date.now());
        setDialogOpen(true);
      } catch (err: unknown) {
        let message = "Failed to send OTP";
        if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        setOtpError(message);
      } finally {
        setLoading(false);
      }
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
        setIsVerified(true);
        const currentEmail = fullForm?.email ?? value;
        if (name === "email" && currentEmail) {
          setVerifiedStatus(currentEmail, true);
        }
        if (typeof onVerifiedChange === "function") {
          onVerifiedChange(true);
        }
        setShowVerifiedPopup(true);
      } catch (err: unknown) {
        let message = "Invalid OTP";
        if (err && typeof err === "object" && "message" in err && typeof (err as { message?: unknown }).message === "string") {
          const errMsg = (err as { message: string }).message;
          // Try to extract JSON error message
          const match = errMsg.match(/\{.*\}/);
          if (match) {
            try {
              const parsed = JSON.parse(match[0]);
              if (parsed && typeof parsed.message === "string") {
                message = parsed.message;
              } else {
                message = errMsg;
              }
            } catch {
              message = errMsg;
            }
          } else {
            message = errMsg;
          }
        } else if (typeof err === "string") {
          message = err;
        }
        setOtpError(message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Notify parent when isVerified changes
  React.useEffect(() => {
    if (typeof onVerifiedChange === "function") {
      onVerifiedChange(isVerified);
    }
  }, [isVerified]);

  // On mount and when email changes, check localStorage for verification status
  React.useEffect(() => {
    const currentEmail = fullForm?.email ?? value;
    if (name === "email" && currentEmail) {
      const verified = getVerifiedStatus(currentEmail);
      setIsVerified(verified);
      if (typeof onVerifiedChange === "function") {
        onVerifiedChange(verified);
      }
    }
  }, [fullForm?.email, value, name]);

  // When resetting isVerified, notify parent
  React.useEffect(() => {
    if (isVerified) {
      const currentEmail = fullForm?.email ?? value;
      if (name === "email" && currentEmail !== undefined) {
        if (lastVerifiedEmailRef.current === undefined) {
          lastVerifiedEmailRef.current = currentEmail;
        }
        if (lastVerifiedEmailRef.current !== currentEmail) {
          setIsVerified(false);
          lastVerifiedEmailRef.current = currentEmail;
          if (typeof onVerifiedChange === "function") {
            onVerifiedChange(false);
          }
        }
      }
    }
  }, [fullForm?.email, value, name, isVerified]);

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
            {verifyFieldError && (
              <p className="text-destructive text-sm ">{verifyFieldError}</p>
            )}
            {verifyFieldErrors.length > 0 &&
              verifyFieldErrors.map((msg, i) => (
                <p key={i} className="text-destructive text-sm ">
                  {msg}
                </p>
              ))}
          </div>
          <div className="">
            {verify && (
              <Link
                onClick={handleVerifyClick}
                href={"#"}
                className="text-sm text-blue-500 text-right"
              >
                {isVerified ? "Verified" : loading ? "Sending..." : "verify"}
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

              <InputOTP
                maxLength={4}
                className="text-xl"
                value={otp}
                onChange={setOtp}
              >
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
      {/* Verified Popup */}
      {showVerifiedPopup && (
        <Dialog open={showVerifiedPopup} onOpenChange={setShowVerifiedPopup}>
          <DialogContent className="
          aspect-square">
            <DialogTitle className="text-center text-3xl">Verify your email</DialogTitle>
            <DialogDescription>
              <div className=
              "flex flex-col items-center space-y-7">
              <Image
                src={"/popup.png"}
                className="w-1/3"
                height={100}
                width={100}
                alt="verified"
              />
              your email is now verified.
              </div>
            </DialogDescription>
            <Button className="w-full" onClick={() => setShowVerifiedPopup(false)}>Continue</Button>
          </DialogContent>
        </Dialog>
      )}
      {showEmailNotVerifiedPopup && (
        <Dialog open={showEmailNotVerifiedPopup} onOpenChange={setShowEmailNotVerifiedPopup}>
          <DialogContent className="aspect-square">
            <DialogTitle className="text-center text-3xl">Email Not Verified</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center space-y-7">
                <Image
                  src={"/popup.png"}
                  className="w-1/3"
                  height={100}
                  width={100}
                  alt="not verified"
                />
                <span className="text-destructive text-center">
                  Please verify your email before proceeding.
                </span>
              </div>
            </DialogDescription>
            <Button className="w-full" onClick={() => setShowEmailNotVerifiedPopup(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
});

export default FormField;
