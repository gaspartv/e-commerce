declare global {
  namespace Express {
    interface Request {
      id_user: string;
    }
  }
}

export {};
