import path from "node:path";

export function getUploadDir() {
  // Keep uploads path statically scoped for Turbopack/NFT tracing.
  return path.join(/* turbopackIgnore: true */ process.cwd(), "uploads");
}
