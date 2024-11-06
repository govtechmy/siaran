import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

// Extend zod to add .openapi() method
extendZodWithOpenApi(z);

export * from "zod";
