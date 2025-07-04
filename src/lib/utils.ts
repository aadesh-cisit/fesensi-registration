import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function savetimer() {
  const time = Date.now();
  sessionStorage.setItem('otp_request', time.toString());
}