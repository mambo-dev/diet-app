export type AuthorizedUser = {
  user?: {
    user_id: number;
    username: string;
  };
  error?: string;
};

export type UserWithoutPassword = Omit<User, "password">;

export type DecodedToken = {
  id: number;
  iat: number;
  exp: number;
};
