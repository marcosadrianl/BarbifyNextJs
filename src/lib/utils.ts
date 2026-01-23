import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IUser } from "@/models/Users.type";
import { UserSubscription } from "@/types/subscription.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//checkear que si el usuario esta userActive: false, y paymentStatus: false,

function getExpirationDate(sub: UserSubscription): Date {
  // si tuvo trial, el vencimiento real es cuando termina el trial
  if (sub.trialEndDate) {
    return new Date(sub.trialEndDate);
  }

  // si no hubo trial, tomamos el inicio como referencia
  return new Date(sub.startDate);
}

const GRACE_DAYS = 60;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function canAccessContent(user: IUser): boolean {
  if (!user.userActive) return false;

  const sub = user.subscription;
  if (!sub) return false;

  const now = new Date();
  const expiration = getExpirationDate(sub);
  const graceLimit = addDays(new Date(expiration), GRACE_DAYS);

  const inGracePeriod = now <= graceLimit;

  // Plan pagos requieren pago
  const paidPlans = ["standard", "pro"];
  if (paidPlans.includes(sub.plan) && !user.paymentStatus && !inGracePeriod) {
    return false;
  }

  // Estado válido
  if (["active", "trial"].includes(sub.status)) return true;

  if (sub.status === "expired" && inGracePeriod) return true;

  return false;
}

//filtro por Tipo de PLan

type AccessLevel = "none" | "read" | "full";

const paidPlans = ["standard", "pro"] as const;

export function getAccessLevel(user: IUser): AccessLevel {
  if (!user.userActive) return "none";
  if (!user.subscription) return "none";

  const { plan, status } = user.subscription;
  const now = new Date();

  const expiration = getExpirationDate(user.subscription);
  const graceLimit = addDays(expiration, GRACE_DAYS);
  const inGrace = now <= graceLimit;

  const requiresPayment = paidPlans.includes(plan as any);

  // ACTIVE o TRIAL
  if (["active", "trial"].includes(status)) {
    if (!requiresPayment || user.paymentStatus) return "full";
    return "read";
  }

  // EXPIRED
  if (status === "expired") {
    if (inGrace) return "read";
    return "none";
  }

  return "none";
}
