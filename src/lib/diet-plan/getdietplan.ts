export default function generateMealPlan(
  calorieIntake: number
): Promise<{ mainMeals: number; snacks: number }> {
  return new Promise<{ mainMeals: number; snacks: number }>(
    (resolve, reject) => {
      const { dietType } = getDietType(calorieIntake);

      switch (dietType) {
        case "Balanced":
          return resolve({
            mainMeals: 3,
            snacks: 2,
          });
        case "HighProtein":
          return resolve({
            mainMeals: 4,
            snacks: 2,
          });
        case "LowCarb":
          return resolve({
            mainMeals: 3,
            snacks: 1,
          });
        default:
          return reject(new Error("invalid diet type passed"));
      }
    }
  );
}

function getDietType(calorieIntake: number): {
  dietType: "Balanced" | "LowCarb" | "HighProtein";
} {
  if (calorieIntake >= 1600) {
    return {
      dietType: "HighProtein",
    };
  } else if (calorieIntake >= 1500 && calorieIntake < 1600) {
    return {
      dietType: "Balanced",
    };
  } else if (calorieIntake < 1500) {
    return {
      dietType: "LowCarb",
    };
  }
  throw new Error("something went wrong");
}
