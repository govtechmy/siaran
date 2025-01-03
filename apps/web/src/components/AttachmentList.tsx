import { Link } from "@/components/Link";
import FileDocument from "@/icons/file-document";
import FileImage from "@/icons/file-image";
import FilePDF from "@/icons/file-pdf";
import { cn } from "@/lib/ui/utils";
import type { Attachment } from "@repo/api/cms/types";

type Props = {
  attachments: Attachment[];
  className?: string;
};

export default function Attachments({ attachments, className }: Props) {
  return (
    <div
      className={cn(
        "w-full",
        "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4",
        "gap-[.5rem]",
        className,
      )}
    >
      {attachments.map(
        (
          {
            url,
            file_type: fileType,
            file_name: fileName,
            file_size: fileSize,
          },
          index,
        ) => (
          <Link
            key={index}
            href={url}
            target="_blank"
            download={fileName}
            aria-label={fileName}
            rel="noopener noreferrer"
            className={cn(
              "border border-gray-outline-200",
              "rounded-[.5rem]",
              "h-fit w-full lg:max-w-[12.5rem]",
              "p-[.5rem]",
              "flex items-center gap-[.375rem]",
            )}
          >
            <Icon fileType={fileType} className="shrink-0" />
            <div
              className={cn(
                "w-fit",
                "flex flex-1 flex-row items-center lg:flex-col lg:items-start",
              )}
            >
              <p
                className={cn(
                  "flex-1",
                  "overflow-hidden",
                  "line-clamp-2 lg:line-clamp-1",
                  "text-xs text-black-900",
                  "break-all",
                )}
              >
                {fileName}
              </p>
              {fileSize > 0 && (
                <p
                  className={cn(
                    "flex flex-row items-center",
                    "sm:ml-[.75rem] lg:ml-0",
                    "text-right text-xs text-gray-dim-500",
                    "whitespace-nowrap",
                  )}
                >
                  {formatFileSize(fileSize)}
                </p>
              )}
            </div>
          </Link>
        ),
      )}
    </div>
  );
}

function Icon({
  fileType,
  className,
}: {
  fileType: string;
  className?: string;
}) {
  switch (fileType) {
    case "application/pdf":
    case "pdf":
      return <FilePDF className={className} />;
    case "image/jpeg":
    case "image/png":
    case "png":
    case "jpg":
    case "jpeg":
      return <FileImage className={className} />;
    default:
      return <FileDocument className={className} />;
  }
}

function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} bytes`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
