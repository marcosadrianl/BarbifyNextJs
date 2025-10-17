import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongoose";
import Clients from "@/models/Clients";

/**
 * GET /api/clients/[id]
 * Fetch a client by ID
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const client = await Clients.findById(id);

    if (!client) {
      return NextResponse.json(
        { message: "Client not found", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clients/[id]
 * Update a client by ID
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    const updatedClient = await Clients.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clients/[id]
 * Delete a client by ID
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedClient = await Clients.findByIdAndDelete(params.id);

    if (!deletedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/clients/[id]
 * Partially update a client by ID
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    const updatedClient = await Clients.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedClient) {
      return NextResponse.json(
        { message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}
