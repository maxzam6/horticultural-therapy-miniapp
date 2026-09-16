// Resize application uploads before transport; never expose a full-resolution photo by default.
export async function browserPhoto(blob) {
  if (blob.size > 5 * 1024 * 1024)
    throw new Error("原照片不能超过5MB，请选择较小照片");
  const bitmap = await createImageBitmap(blob);
  try {
    const scale = Math.min(1, 1536 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fffdf8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.85, 0.65, 0.45, 0.25]) {
      const base64 = canvas.toDataURL("image/jpeg", quality).split(",")[1];
      if (base64.length <= 900000) return base64;
    }
    throw new Error("照片压缩后仍过大，请选择较小图片");
  } finally {
    bitmap.close();
  }
}
