const { randomUUID, createHash } = require("node:crypto");
function parseImage(base64) {
  if (typeof base64 !== "string" || base64.length > 7 * 1024 * 1024)
    throw new Error("图片不能超过5MB");
  const bytes = Buffer.from(base64, "base64");
  let mime, extension;
  if (
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    mime = "image/png";
    extension = "png";
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    mime = "image/jpeg";
    extension = "jpg";
  } else if (
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    mime = "image/webp";
    extension = "webp";
  } else throw new Error("只支持JPEG、PNG、WebP照片");
  if (bytes.length > 5 * 1024 * 1024 || bytes.length < 16)
    throw new Error("图片大小无效");
  return {
    bytes,
    mime,
    extension,
    hash: createHash("sha256").update(bytes).digest("hex"),
    path: `private/${randomUUID()}.${extension}`,
  };
}
module.exports = { parseImage };
