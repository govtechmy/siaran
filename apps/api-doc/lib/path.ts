export function getPath(assetPath: string) {
  const basePath = process.env.BASE_PATH || "";

  // replace multiple slashes with a single slash
  return [basePath, assetPath].join("/").replace(/\/+/g, "/");
}
