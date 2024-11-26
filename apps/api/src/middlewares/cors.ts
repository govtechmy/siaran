import cors from "cors";

export default cors(
  process.env.NODE_ENV === "development"
    ? {
        origin: "*",
        methods: ["POST", "PUT", "PATCH", "DELETE", "GET"],
      }
    : undefined
);
