function getPressReleaseAttachmentPath(id: string) {
  return `press-releases/${id}/attachments`;
}

function getPressReleaseAttachmentFilePath(id: string, filename: string) {
  return `${getPressReleaseAttachmentPath(id)}/${filename}`;
}

function getPreUploadPrefix({
  userId,
  sessionId,
}: {
  userId: string;
  sessionId: string;
}) {
  return `pre-upload/${userId}/${sessionId}`;
}

function getPreUploadPath({
  userId,
  sessionId,
  filename,
}: {
  userId: string;
  sessionId: string;
  filename: string;
}) {
  return `${getPreUploadPrefix({ userId, sessionId })}/${filename}`;
}

export {
  getPressReleaseAttachmentFilePath,
  getPressReleaseAttachmentPath,
  getPreUploadPath,
  getPreUploadPrefix,
};
