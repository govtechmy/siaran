const API_HOST = process.env.PAYLOAD_PUBLIC_WEBHOOK_API_HOST;

async function commitPreUploadedAttachments({
  pressReleaseId,
  sessionId,
  token,
}: {
  pressReleaseId: string;
  sessionId: string;
  token: string;
}) {
  const response = await fetch(
    `${API_HOST}/webhook/press-releases/${pressReleaseId}/pre-upload/${sessionId}/commit/attachments`,
    {
      method: "POST",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Commit pre-uploaded attachments failed");
  }
}

async function getPreUploadFileUrl({
  sessionId,
  fileName,
  fileType,
  token,
}: {
  sessionId: string;
  fileName: string;
  fileType: string;
  token: string;
}) {
  const response = await fetch(`${API_HOST}/webhook/pre-upload/${sessionId}`, {
    method: "POST",
    headers: {
      ["Authorization"]: `Bearer ${token}`,
      ["Content-Type"]: "application/json",
    },
    body: JSON.stringify({
      filename: fileName,
      contentType: fileType,
    }),
  });

  if (!response.ok) {
    throw new Error("Get pre-upload url failed");
  }

  const { url, previewUrl } = await response.json();
  return { url: url as string, previewUrl: previewUrl as string };
}

async function deleteAttachment({
  id,
  filename,
  token,
}: {
  id: string;
  filename: string;
  token: string;
}): Promise<void> {
  const response = await fetch(
    `${API_HOST}/webhook/press-releases/${id}/attachment/${filename}`,
    {
      method: "DELETE",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Delete attachment failed");
  }
}

async function deleteAllAttachments({
  id,
  token,
}: {
  id: string;
  token: string;
}): Promise<void> {
  const response = await fetch(
    `${API_HOST}/webhook/press-releases/${id}/attachments`,
    {
      method: "DELETE",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Delete all attachments failed");
  }
}

async function deletePreUploadedFile({
  sessionId,
  filename,
  token,
}: {
  sessionId: string;
  filename: string;
  token: string;
}): Promise<void> {
  const response = await fetch(
    `${API_HOST}/webhook/pre-upload/${sessionId}/${filename}`,
    {
      method: "DELETE",
      headers: {
        ["Authorization"]: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Delete pre-uploaded file failed");
  }
}

export {
  commitPreUploadedAttachments,
  getPreUploadFileUrl,
  deleteAttachment,
  deleteAllAttachments,
  deletePreUploadedFile,
};
