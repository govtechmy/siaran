import { Props } from "payload/components/fields/Upload";
import {
  useAllFormFields,
  useFieldType,
  useForm,
} from "payload/components/forms";
import { useAuth, useDocumentInfo } from "payload/components/utilities";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  deleteAttachment,
  deletePreUploadedFile,
  getPreUploadFileUrl,
} from "../../../../../api";
import "./index.css";

type FormAttachment = {
  file_name: string;
  file_size: number;
  file_type: string;
  url: string;
};

type PreUploadAttachment = {
  fileName: string;
  fileType: string;
  fileSize: number;
  previewUrl: string;
  uploadProgress?: number;
};

const ERR_UPLOAD_FAILED = "Upload failed. Please try again.";
const ERR_DELETE_ATTACHMENT_FAILED = "Delete failed. Please try again.";

function getRandomString() {
  const randomIntegers = window.crypto.getRandomValues(new Uint32Array(4));
  return Array.from(randomIntegers, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

// Deconstruct and parse attachment form fields (e.g. "attachments.0.url") into an array of attachments
function useFormAttachments() {
  const [formFields] = useAllFormFields();

  const attachments = Object.values(
    Object.entries(formFields).reduce((acc, [key, value]) => {
      if (!key.startsWith("attachments.")) {
        return acc;
      }

      const [, index, field] = key.split(".");
      const item = acc[index] || {};

      acc[index] = {
        ...item,
        [field]: value.initialValue,
      };

      return acc;
    }, {}),
  ) as FormAttachment[];

  const [formAttachments, setFormAttachments] = useState(attachments);
  return { formAttachments, setFormAttachments };
}

async function preUploadAttachment({
  sessionId,
  file,
  token,
  onProgress,
}: {
  sessionId: string;
  file: File;
  token: string;
  onProgress?: (progress: number) => void;
}): Promise<{ previewUrl: string }> {
  let uploadUrl: string;
  let previewUrl: string;

  try {
    const result = await getPreUploadFileUrl({
      sessionId,
      fileName: file.name,
      fileType: file.type,
      token,
    });

    uploadUrl = result.url;
    previewUrl = result.previewUrl;
  } catch (e) {
    throw new Error(e);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = (event.loaded / event.total) * 100;
        onProgress?.(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve({ previewUrl });
      } else {
        reject(new Error(ERR_UPLOAD_FAILED));
      }
    };
    xhr.onerror = () => {
      reject(new Error(ERR_UPLOAD_FAILED));
    };
    xhr.send(file);
  });
}

export function Field({ path }: Props) {
  const { token } = useAuth();
  const sessionId = useMemo(() => getRandomString(), []);
  const ref = useRef<HTMLInputElement>(null);

  const doc = useDocumentInfo();
  const form = useForm();
  const { formAttachments, setFormAttachments } = useFormAttachments(); // Current attachments
  const [attachments, setAttachments] = useState<PreUploadAttachment[]>([]); // Pre-uploaded attachments

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { value: fieldSessionId, setValue: setFieldSessionId } =
    useFieldType<string>({
      path: "sessionId",
    });
  const { setValue: setToken } = useFieldType({ path: "token" });
  const { setValue: setIsPreUploading } = useFieldType({
    path: "isPreUploading",
  });

  function clearFileInput() {
    ref.current.value = "";
  }

  async function clearAttachments() {
    const validated = await form.validateForm();

    if (validated) {
      // Convert pre-uploaded attachments to form attachments before clearing
      setFormAttachments([
        ...formAttachments,
        ...attachments.map((attachment) => ({
          url: attachment.previewUrl,
          file_name: attachment.fileName,
          file_type: attachment.fileType,
          file_size: attachment.fileSize,
        })),
      ]);

      setAttachments([]);
      localStorage.removeItem("attachments");
    }
  }

  useEffect(function setSessionContext() {
    const data = localStorage.getItem("attachments");

    if (data) {
      // Read from local storage if the user did not finish in the last session
      const parsed = JSON.parse(data) as {
        sessionId: string;
        attachments: PreUploadAttachment[];
      };

      setAttachments(parsed.attachments);
      setFieldSessionId(parsed.sessionId);
    } else {
      setFieldSessionId(sessionId);
    }

    setToken(token);
  }, []);

  useEffect(
    function setPreUploadStatus() {
      setIsPreUploading(attachments.some((a) => a.uploadProgress < 100));
    },
    [attachments],
  );

  useEffect(
    function persistPreUploadedAttachments() {
      if (attachments.length === 0) {
        localStorage.removeItem("attachments");
      } else {
        localStorage.setItem(
          "attachments",
          JSON.stringify({
            attachments,
            sessionId: fieldSessionId,
          }),
        );
      }
    },
    [attachments, fieldSessionId],
  );

  useEffect(
    function setFormSubmitListener() {
      const button = document.querySelector("form button[type=button]");
      button?.addEventListener("click", clearAttachments);

      return () => button?.removeEventListener("click", clearAttachments);
    },
    [clearAttachments],
  );

  return (
    <>
      <h3>Upload Attachment</h3>
      {/* Current attachments */}
      {doc.id &&
        formAttachments.map((attachment) => (
          <div key={attachment.url} className="attachment">
            <button
              onClick={function onDeleteAttachment() {
                setDeleteError(null);

                deleteAttachment({
                  id: doc.id as string,
                  filename: attachment.file_name,
                  token,
                }).catch((e) => {
                  setDeleteError(ERR_DELETE_ATTACHMENT_FAILED);
                  setFormAttachments([...formAttachments]);
                });

                setFormAttachments(
                  formAttachments.filter((a) => a.url !== attachment.url),
                );
              }}
            >
              Delete
            </button>
            <div className="attachment__label">
              <a
                href={attachment.url}
                aria-label="Open file in a new tab"
                target="_blank"
              >
                {attachment.file_name}
              </a>
            </div>
          </div>
        ))}
      {/* Pre-uploaded attachments */}
      {attachments.map((attachment) => (
        <div key={attachment.fileName} className="attachment">
          <button
            onClick={function onDeletePreUploadedAttachment() {
              setDeleteError(null);

              deletePreUploadedFile({
                sessionId,
                filename: attachment.fileName,
                token,
              }).catch((e) => {
                setDeleteError(ERR_DELETE_ATTACHMENT_FAILED);
                setAttachments([...attachments]);
              });

              setAttachments(
                attachments.filter((a) => a.fileName !== attachment.fileName),
              );
            }}
          >
            Delete
          </button>
          <div className="attachment__label">
            {attachment.previewUrl ? (
              <a
                href={attachment.previewUrl}
                aria-label="Preview file in a new tab"
                target="_blank"
              >
                {attachment.fileName}
              </a>
            ) : (
              attachment.fileName
            )}
            {attachment.uploadProgress < 100 &&
              ` (${attachment.uploadProgress}%)`}{" "}
            [Unpublished]
          </div>
        </div>
      ))}
      <input
        ref={ref}
        className="attachment-input"
        required={false}
        type="file"
        multiple={false}
        accept="image/*,application/pdf"
        onChange={async function createNewAttachment(e) {
          setUploadError(null);

          const files = e.target.files;

          if (files.length === 0) {
            return;
          }

          const file = files[0];

          // Ignore if the file exists.
          if (attachments.find((a) => a.fileName === file.name)) {
            clearFileInput();
            return;
          }

          // Create a new attachment
          const attachment: PreUploadAttachment = {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            uploadProgress: 0,
            previewUrl: "",
          };

          try {
            // Pre-upload attachment and track upload progress
            const { previewUrl } = await preUploadAttachment({
              sessionId,
              token,
              file,
              onProgress: (progress) => {
                // Track upload progress
                attachment.uploadProgress = progress;

                setAttachments((attachments) => [
                  ...attachments.filter(
                    (a) => a.fileName !== attachment.fileName,
                  ),
                  attachment,
                ]);
              },
            });

            attachment.previewUrl = previewUrl;

            setAttachments([...attachments, attachment]);
          } catch (e) {
            setUploadError(e.message);
          }

          clearFileInput();
        }}
      />
      <div className="error">{deleteError ?? uploadError ?? ""}</div>
    </>
  );
}
