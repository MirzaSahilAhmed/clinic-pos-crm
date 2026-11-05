import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "PKR"): string {
  return `${currency} ${Number(amount || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(date: string | Date | null | undefined, formatStr: string = "dd/MM/yyyy"): string {
  if (!date) return "-";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "-";
    // Standard format DD/MM/YYYY
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    if (formatStr === "dd/MM/yyyy" || formatStr === "DD/MM/YYYY") {
      return `${day}/${month}/${year}`;
    }
    return d.toLocaleDateString("en-GB");
  } catch {
    return "-";
  }
}

export function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return "-";
  try {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string } | null {
  if (!weightKg || !heightCm || heightCm <= 0) return null;
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
  let category = "Normal weight";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi >= 25 && bmi < 29.9) category = "Overweight";
  else if (bmi >= 30) category = "Obesity";
  return { bmi, category };
}
