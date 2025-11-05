// app/login/page.tsx
import LoginForm from "@/components/logInForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            href="/signup"
            className="text-[#43553b] font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
