export enum errorText {
  SECRET = "Missing token secret in environment",
  TOKEN = "Invalid token",
  AUTH_HEADER = "Multiple authentication headers detected",
  USERNAME = "Incorrect username",
  PASSWORD = "Incorrect password",
  AUTH = "Please authenticate",
  ADMIN = "This account is unauthorized as admin",
  DATA = "Invalid data",
  ID = "No documents found, please check the id",
  PARAM = "Invalid request parameter(s)",
  DELETE = "No documents were deleted, please check the request parameter(s)",
  IMG_EXT = "Invalid image extension, only images are allowed",
}
