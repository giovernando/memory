"use server";

import sharp from "sharp";

/**
 * TypeScript Interfaces for Input Options and Output Payloads
 */
export interface CompressOptions {
  /**
   * Compression quality from 1 to 100.
   * Default is 80 (excellent balance of quality and file size).
   */
  quality?: number;

  /**
   * Maximum width of the compressed image in pixels.
   * Default is 1200. Will maintain original aspect ratio.
   */
  maxWidth?: number;
}

export interface CompressResult {
  success: boolean;
  /**
   * Base64 encoded string of the compressed image buffer.
   * Ideal for serializing over Next.js Server Action network boundaries.
   */
  base64?: string;
  /**
   * Raw buffer of the compressed webp image.
   * Available for server-side code (e.g. uploading to Supabase).
   */
  buffer?: Buffer;
  fileName: string;
  mimeType: string;
  originalSize: number;
  compressedSize?: number;
  width?: number;
  height?: number;
  error?: string;
}

/**
 * Core utility function to automatically compress an image, convert to WebP,
 * and optional max width resize. Designed for use in Server Actions, API Routes,
 * or background workers.
 * 
 * @param file - Input image file (can be browser File, Node Buffer, or ArrayBuffer)
 * @param originalName - Original name of the uploaded file
 * @param options - Custom compression options (quality & maxWidth)
 * @returns CompressResult containing optimized buffer, size, and dimensions
 */
export async function compressImageToWebP(
  file: File | Buffer | ArrayBuffer,
  originalName: string,
  options: CompressOptions = {}
): Promise<CompressResult> {
  try {
    let inputBuffer: Buffer;
    let originalSize = 0;

    // 1. Normalize input file to a Node.js Buffer
    if (file instanceof File) {
      originalSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      inputBuffer = Buffer.from(arrayBuffer);
    } else if (file instanceof ArrayBuffer) {
      originalSize = file.byteLength;
      inputBuffer = Buffer.from(file);
    } else if (Buffer.isBuffer(file)) {
      originalSize = file.length;
      inputBuffer = file;
    } else {
      throw new Error("Tipe input tidak didukung. Harus berupa File, Buffer, atau ArrayBuffer.");
    }

    // 2. Initialize Sharp pipeline
    let pipeline = sharp(inputBuffer);

    // 3. Retrieve metadata to check original dimensions
    const metadata = await pipeline.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    // 4. Handle Smart Resize (Only downsize if original is wider than max width)
    const maxWidth = options.maxWidth ?? 1200;
    if (originalWidth > maxWidth) {
      pipeline = pipeline.resize({
        width: maxWidth,
        fit: "inside",
        withoutEnlargement: true // Prevents upscale of smaller images
      });
    }

    // 5. Convert to webp with 80% compression quality
    const quality = options.quality ?? 80;
    const compressedBuffer = await pipeline
      .webp({ quality })
      .toBuffer();

    // 6. Get final compressed metadata for analytics
    const finalMetadata = await sharp(compressedBuffer).metadata();

    // 7. Generate optimized file name with .webp extension
    const baseName = originalName.substring(0, originalName.lastIndexOf(".")) || originalName;
    const newFileName = `${baseName}.webp`;

    return {
      success: true,
      buffer: compressedBuffer,
      base64: `data:image/webp;base64,${compressedBuffer.toString("base64")}`,
      fileName: newFileName,
      mimeType: "image/webp",
      originalSize,
      compressedSize: compressedBuffer.length,
      width: finalMetadata.width || originalWidth,
      height: finalMetadata.height || originalHeight
    };
  } catch (err: any) {
    console.error("Error compressing image via Sharp:", err);
    return {
      success: false,
      fileName: originalName,
      mimeType: "image/webp",
      originalSize: 0,
      error: err.message || "Gagal mengompresi gambar."
    };
  }
}

/**
 * NEXT.JS SERVER ACTION
 * Accepts FormData from a standard HTML/React form, extracts the image,
 * compresses it server-side using Sharp, and returns a serializable result.
 * 
 * @param formData - Form data containing the file field
 * @returns CompressResult
 */
export async function compressImageAction(formData: FormData): Promise<CompressResult> {
  const file = formData.get("file");
  const qualityStr = formData.get("quality");
  const maxWidthStr = formData.get("maxWidth");

  if (!file || !(file instanceof File)) {
    return {
      success: false,
      fileName: "unknown",
      mimeType: "image/webp",
      originalSize: 0,
      error: "Tidak ada berkas gambar yang ditemukan dalam form."
    };
  }

  // Parse custom parameters from form if available
  const quality = qualityStr ? parseInt(qualityStr as string) : undefined;
  const maxWidth = maxWidthStr ? parseInt(maxWidthStr as string) : undefined;

  return compressImageToWebP(file, file.name, { quality, maxWidth });
}
