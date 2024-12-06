import { z } from "#extensions/zod";

const filename = z.string().openapi({
  example: "Merdeka_1957_tunku_abdul_rahman.jpg",
});

const url = z.string().openapi({
  example:
    "https://upload.wikimedia.org/wikipedia/commons/6/69/Merdeka_1957_tunku_abdul_rahman.jpg",
});

const previewUrl = z.string().openapi({
  example:
    "https://upload.wikimedia.org/wikipedia/commons/6/69/Merdeka_1957_tunku_abdul_rahman.jpg",
});

const acceptedFileTypes = z
  .enum([
    "image/png",
    "image/jpeg",
    "text/plain",
    "text/markdown",
    "application/pdf",
    "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ])
  .openapi({
    description: "File type",
    example: "application/pdf",
  });

const agencies = z
  .enum([
    "ECC",
    "JWP",
    "KBS",
    "KDN",
    "KE",
    "KKD",
    "KKDW",
    "KKR",
    "KLN",
    "KPDN",
    "KPKT",
    "KPN",
    "KPWKM",
    "KWP",
    "MACC",
    "MAFS",
    "MCMC",
    "MECD",
    "MINDEF",
    "MITI",
    "MOE",
    "MOF",
    "MOH",
    "MOHE",
    "MOHR",
    "MOSTI",
    "MOT",
    "MOTAC",
    "MPIC",
    "MYCC",
    "NRECC",
    "NRES",
    "PETRA",
    "PMO",
    "SPP",
    "SSM",
  ])
  .openapi({
    example: "PMO",
  });

export { filename, url, previewUrl, acceptedFileTypes, agencies };
