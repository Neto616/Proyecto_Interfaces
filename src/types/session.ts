import "express-session";

declare module "express-session" {
  interface SessionData {
    usuario?: any; // o el tipo real de tu usuario
  }
}
