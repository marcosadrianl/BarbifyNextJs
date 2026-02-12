"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2, AlertCircle } from "lucide-react";

type VerificationStatus = "loading" | "success" | "pending" | "error";

export default function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plan, setPlan] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const planParam = searchParams.get("plan");
    const preapprovalId =
      searchParams.get("preapproval_id") || searchParams.get("subscription_id");

    setPlan(planParam);

    // Si tenemos el preapproval_id, verificar y activar la suscripción
    if (preapprovalId && planParam) {
      verifySubscription(preapprovalId, planParam);
    } else {
      // Si no hay preapproval_id, asumir éxito (fallback al comportamiento anterior)
      setVerificationStatus("success");
    }
  }, [searchParams]);

  const verifySubscription = async (preapprovalId: string, plan: string) => {
    try {
      const response = await fetch("/api/mp/verify-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preapproval_id: preapprovalId,
          plan: plan,
        }),
      });

      const data = await response.json();

      if (data.success && data.status === "active") {
        setVerificationStatus("success");
      } else if (data.status === "pending") {
        setVerificationStatus("pending");
        setErrorMessage(
          data.message ||
            "Tu pago está siendo procesado. Recibirás una confirmación pronto.",
        );
      } else {
        setVerificationStatus("error");
        setErrorMessage(
          data.message || "Hubo un problema verificando tu suscripción.",
        );
      }
    } catch (error) {
      console.error("Error verificando suscripción:", error);
      setVerificationStatus("error");
      setErrorMessage(
        "Error verificando tu suscripción. Por favor contacta a soporte.",
      );
    }
  };

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            {verificationStatus === "loading" && (
              <>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl">
                  Verificando suscripción...
                </CardTitle>
              </>
            )}
            {verificationStatus === "success" && (
              <>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">
                  ¡Suscripción exitosa!
                </CardTitle>
              </>
            )}
            {verificationStatus === "pending" && (
              <>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                </div>
                <CardTitle className="text-2xl">Procesando pago...</CardTitle>
              </>
            )}
            {verificationStatus === "error" && (
              <>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl">
                  Problema con la suscripción
                </CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationStatus === "loading" && (
              <p className="text-muted-foreground">
                Estamos activando tu suscripción al plan <strong>{plan}</strong>
                . Esto solo tomará unos segundos...
              </p>
            )}
            {verificationStatus === "success" && (
              <>
                <p className="text-muted-foreground">
                  Tu suscripción al plan <strong>{plan}</strong> ha sido
                  activada correctamente.
                </p>
                <p className="text-sm text-muted-foreground">
                  Ya puedes disfrutar de todas las funcionalidades de tu plan.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/clients")}
                    className="w-full"
                  >
                    Ir a Dashboard
                  </Button>
                </div>
              </>
            )}
            {verificationStatus === "pending" && (
              <>
                <p className="text-muted-foreground">{errorMessage}</p>
                <p className="text-sm text-muted-foreground">
                  Te enviaremos un correo cuando tu suscripción esté activa.
                </p>
                <div className="pt-4">
                  <Button
                    onClick={() => router.push("/clients")}
                    className="w-full"
                  >
                    Volver al Dashboard
                  </Button>
                </div>
              </>
            )}
            {verificationStatus === "error" && (
              <>
                <p className="text-muted-foreground">{errorMessage}</p>
                <div className="pt-4 space-y-2">
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    Reintentar verificación
                  </Button>
                  <Button
                    onClick={() => router.push("/account/subscription")}
                    className="w-full"
                  >
                    Ir a Suscripción
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
