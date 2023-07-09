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

export type HandleError = {
  message: string | undefined;
};

export type FoodData = {
  food_name: string;
  serving_qty: number;
  nf_calories: number;
  nf_total_fat: number;
  nf_protein: number;
  nf_total_carbohydrate: number;
  food_nix_api_id: string;
};
