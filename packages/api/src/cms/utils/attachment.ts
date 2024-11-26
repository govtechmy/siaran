export function getPressReleaseAttachmentPath(id: string) {
  return `press-releases/${id}/attachments`;
}

export function getPressReleaseAttachmentFilePath(
  id: string,
  filename: string,
) {
  return `${getPressReleaseAttachmentPath(id)}/${filename}`;
}
