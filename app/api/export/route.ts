import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/session";

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // ── Auth Guard ──────────────────────────────
    const isAuthenticated = await getSession();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ── Parse Query Params ──────────────────────
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "sales" | "stock"
    const storeId = searchParams.get("storeId") || undefined;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!type || !["sales", "stock"].includes(type)) {
      return NextResponse.json(
        { error: "Parameter 'type' harus 'sales' atau 'stock'" },
        { status: 400 }
      );
    }

    // ── Export: Penjualan ────────────────────────
    if (type === "sales") {
      const dateFilter: Record<string, Date> = {};
      if (from) dateFilter.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        dateFilter.lte = toDate;
      }

      const sales = await prisma.sale.findMany({
        where: {
          ...(storeId ? { storeId } : {}),
          ...(Object.keys(dateFilter).length > 0
            ? { saleDate: dateFilter }
            : {}),
        },
        include: {
          store: { select: { name: true } },
          product: { select: { name: true, price: true } },
        },
        orderBy: { saleDate: "desc" },
      });

      const rows = sales.map((s: any, i: number) => ({
        no: i + 1,
        tanggal: s.saleDate.toISOString(),
        cabang: s.store.name,
        produk: s.product.name,
        jumlah: s.quantitySold,
        hargaSatuan: s.product.price,
        total: s.totalAmount,
      }));

      return NextResponse.json({ data: rows });
    }

    // ── Export: Stok Produk ──────────────────────
    if (type === "stock") {
      const products = await prisma.product.findMany({
        where: storeId ? { storeId } : {},
        include: {
          store: { select: { name: true } },
        },
        orderBy: [{ store: { name: "asc" } }, { name: "asc" }],
      });

      const rows = products.map((p: any, i: number) => ({
        no: i + 1,
        cabang: p.store.name,
        produk: p.name,
        harga: p.price,
        stok: p.stockQuantity,
        status:
          p.stockQuantity === 0
            ? "Habis"
            : p.stockQuantity < 10
            ? "Hampir Habis"
            : "Tersedia",
      }));

      return NextResponse.json({ data: rows });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Export API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data" },
      { status: 500 }
    );
  }
}
