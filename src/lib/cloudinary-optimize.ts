/**
 * Dynamically injects Cloudinary transformation parameters into media URLs
 * to optimize sizes and format delivery (WebP/AVIF for images, compressed stream for videos).
 */
export function optimizeMediaUrl(
  url: string | undefined | null,
  options: { width?: number; type?: "image" | "video" } = {}
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com")) return url;
  
  // Prevent double injection if transformations are already present
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) {
    return url;
  }

  const { width, type = "image" } = options;
  let transformations = "";

  if (type === "video") {
    // Quality compression and optional resizing for preview video cards
    transformations = width ? `q_auto,w_${width}` : "q_auto";
  } else {
    // Auto-select format (AVIF/WebP) and scale width for images
    transformations = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  }

  return url.replace("/upload/", `/upload/${transformations}/`);
}
