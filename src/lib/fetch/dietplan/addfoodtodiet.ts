import { ServerResponse } from "../../type";

export default async function add_food_to_diet(
  nix_id: string,
  access_token: string
): Promise<boolean | undefined> {
  try {
    const body = {
      id: nix_id,
    };
    const res = await fetch(
      `http://localhost:3000/api/food/add-food-to-diet-plan`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Cookie: `access_token=${access_token}`,
        },
        body: JSON.stringify(body),
        credentials: "include",
      }
    );

    const data = (await res.json()) as ServerResponse<boolean>;
    console.log(JSON.stringify(body));
    if (data.error && !data.data) {
      console.log(data.error);
      throw new Error("so wrong");
      // if (data.error instanceof z.ZodError) {
      //   const errors = data.error.map((error) => {
      //     console.log(error.code);
      //     if (error.code === "invalid_type") {
      //       return {
      //         message: "Oops sorry this is not you fault tho",
      //       };
      //     }
      //     return {
      //       message: error.message,
      //     };
      //   });

      //   throw new Error(JSON.stringify(errors));
      // }

      // if (data.error instanceof Array) {
      //   throw new Error(JSON.stringify(data.error));
      // }

      // throw new Error(data.error ?? "something unexpected happened");
    }
    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
