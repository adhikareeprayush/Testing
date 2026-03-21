import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET() {
  const authParams = imagekit.getAuthenticationParameters();
  return NextResponse.json(authParams);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const folder = (formData.get("folder") as string) || "/farm-commerce";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: fileName || file.name,
      folder,
      useUniqueFileName: true,
      tags: ["farm-commerce"],
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      filePath: uploadResponse.filePath,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please check your ImageKit credentials." },
      { status: 500 }
    );
  }
}
