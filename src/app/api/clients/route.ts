import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

    // Obtener session del usuario
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // asegurate que en tu authorize devolviste id: user._id (como string u ObjectId)
    const userId = String(session.user.id);
    console.log("userID es", userId);

    // params de paginación / búsqueda
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const search = (searchParams.get("search") || "").trim();

    const skip = (page - 1) * limit;

    // Query base: SOLO clientes del usuario autenticado
    const baseQuery: any = { clientFromUserId: userId };

    // Si hay búsqueda, combinamos con $and para respetar owner + filtro
    const query = search
      ? {
          $and: [
            baseQuery,
            {
              $or: [
                { clientName: { $regex: search, $options: "i" } },
                { clientLastName: { $regex: search, $options: "i" } },
              ],
            },
          ],
        }
      : baseQuery;

    const clients = await Clients.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Clients.countDocuments(query);

    return NextResponse.json({
      data: clients,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Error fetching clients: " + (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 *
 * @param  request
 * @returns NextResponse Json response with created client data
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
  interface MongoDuplicateKeyError extends Error {
    code: number;
    keyValue: Record<string, string>;
  }

  try {
    const data = await request.json();
    const BarbifyClients = new Clients(data);
    const savedClient = await BarbifyClients.save();

    return NextResponse.json(savedClient);
  } catch (error: unknown) {
    console.error("Error in POST /api/clients:", error);

    // Detectar error por clave duplicada
    if ((error as MongoDuplicateKeyError).code === 11000) {
      const { keyValue } = error as MongoDuplicateKeyError;
      const duplicateKey = Object.keys(keyValue)[0];
      const duplicateValue = keyValue[duplicateKey];
      return NextResponse.json(
        {
          error: `Duplicated value for ${duplicateKey}: ${duplicateValue}`,
          field: duplicateKey,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error occurred" },
      { status: 500 }
    );
  }
}
