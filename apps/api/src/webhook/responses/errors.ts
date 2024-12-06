const invalidCredential = {
  code: "invalid_credential",
  message: "Unauthorized: Invalid credential",
};

const invalidUser = {
  code: "invalid_user",
  message: "Unauthorized: Invalid user",
};

const invalidToken = {
  code: "invalid_token",
  message: "Unauthorized: Invalid token or the token has expired",
};

const accessDenied = {
  code: "access_denied",
  message: "Forbidden: Access denied",
};

const notFound = {
  code: "not_found",
  message: "Not found",
};

const invalidPressRelease = {
  code: "invalid_press_release",
  message: "Not Found: Invalid press release",
};

const internalServerError = {
  code: "internal_server_error",
  message: "Internal server error",
};

export {
  invalidCredential,
  invalidUser,
  invalidToken,
  accessDenied,
  notFound,
  invalidPressRelease,
  internalServerError,
};
