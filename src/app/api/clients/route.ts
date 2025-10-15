import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";
import mongoose from "mongoose";

/**
 * GET /api/clients
 *
 * @param {Request} request
 * @returns {NextResponse} Json response with clients data
 *
 * @example Request URL: /api/clients?page=1&limit=10&search=John
 * @example Response: {
 *   data: Client[],
 *   total: number,
 *   page: number,
 *   totalPages: number
 * }
 *
 * @description This endpoint returns a list of clients based on the search query.
 * The results are paginated with a default limit of 10 clients per page.
 * The response includes the total number of clients that match the search query,
 * the current page number, and the total number of pages.
 */
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { clientName: { $regex: search.toLowerCase(), $options: "i" } },
            { clientLastName: { $regex: search.toLowerCase(), $options: "i" } },
          ],
        }
      : {};

    const clients = await Clients.find(query)
      .sort({ updatedAt: -1 }) // -1 para orden descendente (más reciente primero)
      .skip(skip)
      .limit(limit);

    // total de clientes que cumplen la búsqueda
    const total = await Clients.countDocuments(query);

    return NextResponse.json({
      data: clients,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching clients" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 *
 * @param  request
 * @returns NextResponse} Json response with created client data
 *
 * @example Request URL: /api/clients
 * @example Request Body: {
 *   clientName: string,
 *   clientLastName: string,
 *   clientSex: string,
 *   clientBirthdate: string,
 *   clientEmail: string,
 *   clientPhone: string,
 *   clientImage: string,
 *   clientActive: boolean,
 *   clientBaseColor: string,
 *   clientHairType: string,
 *   clientAllergies: string,
 *   clientDiseases: string,
 *   clientMedications: string,
 *   clientNotes: string,
 *   clientServices: Service[]
 * }
 * @description This endpoint creates a new client based on the request body.
 * It returns a JSON response with the created client data, or a JSON response
 * with an error message if the request failed.
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const BarbifyClients = new Clients(data);
    const savedClient = await BarbifyClients.save();

    return NextResponse.json(savedClient);
  } catch (error: unknown) {
    console.error("Error in POST /api/clients:", error);

    // Detectar error por clave duplicada
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      const duplicateKey = Object.keys((error as any).keyValue)[0];
      const duplicateValue = (error as any).keyValue[duplicateKey];
      return NextResponse.json(
        {
          error: `Duplicated value for ${duplicateKey}: ${duplicateValue}`,
          field: duplicateKey,
        },
        { status: 409 } // 409 = Conflict
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
