"use client";

import axios from "axios";
import { useEffect, useState } from "react";
//import { IBarbers } from "@/models/Barbers";
import mongoose, { set } from "mongoose";
import { SquareArrowUpRight, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useBarbers } from "@/lib/store/services.store";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import useTheme from "@/hooks/useTheme";

interface IBarbers {
  _id: mongoose.Types.ObjectId | Document;
  barberName: string;
  barberLastName: string;
  barberEmail: string;
  barberPhone: string;
  barberActive: boolean;
  barberRole: string;

  city: string; //Buenos Aires
  state?: string; //La Plata
  address?: string;
  postalCode?: string;

  barberLevel?: 0 | 1 | 2; // 0 = Admin, 1 = Barber, 2 = etc
  barberBirthDate?: Date;
  barberImageURL?: string;
  ownerUserId?: mongoose.Types.ObjectId | Document;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export default function NewBarber() {
  const { data: session } = useSession();
  const [barberName, setBarberName] = useState("");
  const [barberLastName, setBarberLastName] = useState("");
  const [barberEmail, setBarberEmail] = useState("");
  const [barberPhone, setBarberPhone] = useState("");
  const [barberRole, setBarberRole] = useState("Barber");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [ownerUserId, setOwnerUserId] = useState("");
  const [barberLevel, setBarberLevel] = useState<0 | 1 | 2>(1);
  const [barberBirthDate, setBarberBirthDate] = useState("");
  const [barberImageURL, setBarberImageURL] = useState("");
  const { refreshFromAPI } = useBarbers();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<"create" | null>(null);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (session?.user?.id) {
      setOwnerUserId(session.user.id);
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios
        .post("/api/users/barbers", {
          barberName,
          barberLastName,
          barberEmail,
          barberPhone,
          barberRole,
          city,
          state,
          address,
          postalCode,
          barberLevel,
          barberBirthDate,
          barberImageURL,
          ownerUserId: ownerUserId,
        })
        .then(() => {
          refreshFromAPI();
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        });
      setSuccess("Barber creado correctamente");
      setBarberName("");
      setBarberLastName("");
      setBarberEmail("");
      setBarberPhone("");
      setBarberRole("");
      setCity("");
      setState("");
      setAddress("");
      setPostalCode("");
      setBarberLevel(1);
      setBarberBirthDate("");
      setBarberImageURL("");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al crear el barber");
    } finally {
      setLoading(false);
    }
  };

  // Estilos reutilizables derivados del theme, para no repetir objetos inline
  const inputStyle = {
    backgroundColor: theme.bgCard,
    color: theme.textPrimary,
    borderColor: theme.border,
  };

  const labelStyle = {
    color: theme.textSecondary,
  };

  return (
    <div className="flex flex-col h-75 overflow-hidden">
      <div
        className="cursor-pointer p-4"
        onClick={() => {
          setOpenSection("create");
          setOpen(true);
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = theme.accentBg)
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.bg)}
      >
        <span className="flex flex-row w-full justify-between items-center">
          <span>
            <h2 style={{ color: theme.textPrimary }}>Crear Nuevo Barber</h2>
            <p className="text-xs" style={{ color: theme.textSecondary }}>
              Registrá un nuevo barber en tu cuenta. Los Barbers son tus
              compañeros de trabajo.
            </p>
          </span>
          <SquareArrowUpRight
            className="w-6 h-6"
            style={{ color: theme.textSecondary }}
          />
        </span>
      </div>

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setOpenSection(null);
          }
        }}
      >
        <DialogContent
          className="w-1/2"
          style={{
            backgroundColor: theme.bgCard,
            color: theme.textPrimary,
            borderColor: theme.border,
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2"
              style={{ color: theme.textPrimary }}
            >
              <UserPlus style={{ color: theme.primary }} />
              Crear Barber
            </DialogTitle>
            <DialogDescription style={{ color: theme.textSecondary }}>
              Completá los datos para registrar un nuevo barber
            </DialogDescription>
          </DialogHeader>

          <Card
            className="border-none shadow-none"
            style={{ backgroundColor: theme.bgCard }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <CardContent className="space-y-4 p-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name" style={labelStyle}>
                      Nombre*
                    </Label>
                    <Input
                      id="name"
                      value={barberName}
                      onChange={(e) => setBarberName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="lastname" style={labelStyle}>
                      Apellido*
                    </Label>
                    <Input
                      id="lastname"
                      value={barberLastName}
                      onChange={(e) => setBarberLastName(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="email" style={labelStyle}>
                      E-mail*
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={barberEmail}
                      onChange={(e) => setBarberEmail(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone" style={labelStyle}>
                      Teléfono*
                    </Label>
                    <Input
                      id="phone"
                      value={barberPhone}
                      onChange={(e) => setBarberPhone(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="rol" style={labelStyle}>
                      Rol*
                    </Label>
                    <Input
                      id="rol"
                      placeholder="Barber"
                      type="text"
                      value={barberRole}
                      onChange={(e) => setBarberRole(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="birthDate" style={labelStyle}>
                      Fecha de Nacimiento*
                    </Label>
                    <Input
                      id="birthDate"
                      value={barberBirthDate}
                      type="date"
                      onChange={(e) => setBarberBirthDate(e.target.value)}
                      style={inputStyle}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city" style={labelStyle}>
                      Ciudad
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="state" style={labelStyle}>
                      Localidad
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="address" style={labelStyle}>
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode" style={labelStyle}>
                      Codigo Postal
                    </Label>
                    <Input
                      id="postalCode"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-sm" style={{ color: theme.danger }}>
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm" style={{ color: theme.primary }}>
                    {success}
                  </p>
                )}
              </CardContent>

              <CardFooter className="flex justify-end gap-2 px-0">
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                  style={{ color: theme.textSecondary }}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: theme.primary,
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = theme.primaryHover;
                  }}
                  onMouseLeave={(e) => {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = theme.primary;
                  }}
                >
                  {loading ? "Creando..." : "Crear Barber"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
