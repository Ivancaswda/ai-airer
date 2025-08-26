import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import getServerUser from "@/lib/auth-server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleGeminiError(err: any) {
  if (err?.message?.includes("User location is not supported")) {
    return {
      isLocationError: true,
      message: "❌ Вы не можете пользоваться нашими функциями, потому что находитесь в недопустимой стране.",
    };
  }
  return { isLocationError: false, message: err.message };
}