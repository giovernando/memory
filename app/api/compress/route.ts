import { NextRequest, NextResponse } from "next/server";
import { compressImageToWebP } from "@/app/actions/compressImage";

export const runtime = "nodejs"; // Required for Node-specific Sharp native binary modules

/**
 * POST /api/compress
 * API Route that accepts a multipart/form-data file, processes it,
 * and outputs either metadata JSON or a direct binary file stream.
 * 
 * Headers: Content-Type: multipart/form-data
 * Form Body:
 *   - file: [File Object] (Required)
 *   - quality: [Number between 1-100] (Optional, default is 80)
 *   - maxWidth: [Number in pixels] (Optional, default is 1200)
 * 
 * Query Param:
 *   - ?download=true : returns raw binary .webp stream for direct browser downloads
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Berkas tidak ditemukan. Pastikan Anda mengunggah berkas dengan kata kunci (key) bernama 'file'." 
        },
        { status: 400 }
      );
    }

    // Parse custom parameters from multipart body if available
    const qualityParam = formData.get("quality");
    const maxWidthParam = formData.get("maxWidth");

    const quality = qualityParam ? parseInt(qualityParam as string) : 80;
    const maxWidth = maxWidthParam ? parseInt(maxWidthParam as string) : 1200;

    // Call our core Sharp optimizer
    const result = await compressImageToWebP(file, file.name, { quality, maxWidth });

    if (!result.success || !result.buffer) {
      return NextResponse.json(
        { success: false, error: result.error || "Gagal mengolah gambar menggunakan Sharp." },
        { status: 500 }
      );
    }

    // Check if client requested a raw binary download/stream
    const searchParams = req.nextUrl.searchParams;
    const isDownload = searchParams.get("download") === "true";

    if (isDownload) {
      return new NextResponse(result.buffer, {
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": `attachment; filename="${result.fileName}"`,
          "Content-Length": String(result.buffer.length),
        },
      });
    }

    // Default response: Return rich metrics JSON
    const bytesSaved = result.originalSize - (result.compressedSize || 0);
    const savingPercent = ((bytesSaved / result.originalSize) * 100).toFixed(1);

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      mimeType: "image/webp",
      originalSize: `${(result.originalSize / 1024).toFixed(1)} KB`,
      compressedSize: `${(result.compressedSize / 1024).toFixed(1)} KB`,
      savings: {
        bytesSaved,
        percentSaved: `${savingPercent}%`,
      },
      dimensions: {
        width: result.width,
        height: result.height,
      },
      base64: result.base64,
    });

  } catch (err: any) {
    console.error("API Route compress failed:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Terjadi kesalahan internal saat kompresi." },
      { status: 500 }
    );
  }
}
