// GroupID-3 (22114076_22114018_22114086) - Raman Sharma, Ayush Ranjan, and Sarvasva Gupta
// Date: October 15, 2025
// imageUtils.js - Utility functions for image download

/**
 * Download canvas as an image file
 * @param {HTMLCanvasElement} canvas - The canvas element to download
 * @param {string} filename - The filename for the downloaded image
 * @param {string} format - Image format ('png' or 'jpeg')
 */
export function downloadCanvasAsImage(
  canvas,
  filename = "maze",
  format = "png"
) {
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  try {
    // Get the canvas data as a blob
    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const quality = format === "jpeg" ? 0.95 : 1.0;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Failed to create blob from canvas");
          return;
        }

        // Create a temporary URL for the blob
        const url = URL.createObjectURL(blob);

        // Create a temporary link element and trigger download
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      mimeType,
      quality
    );
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}

/**
 * Create a high-quality canvas for printing/download
 * @param {HTMLCanvasElement} sourceCanvas - The source canvas to copy
 * @param {number} scale - Scale factor for higher resolution (default: 2)
 * @returns {HTMLCanvasElement} New canvas with higher resolution
 */
export function createHighResCanvas(sourceCanvas, scale = 2) {
  if (!sourceCanvas) return null;

  const scaledCanvas = document.createElement("canvas");
  const ctx = scaledCanvas.getContext("2d");

  // Set dimensions
  scaledCanvas.width = sourceCanvas.width * scale;
  scaledCanvas.height = sourceCanvas.height * scale;

  // Scale context
  ctx.scale(scale, scale);

  // Draw the source canvas onto the scaled canvas
  ctx.drawImage(sourceCanvas, 0, 0);

  return scaledCanvas;
}
