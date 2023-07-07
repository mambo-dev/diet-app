export default function generateMealPlan(calorieIntake: number): {
  mainMeals: number;
  snacks: number;
} {
  const { dietType } = getDietType(calorieIntake);

  switch (dietType) {
    case "Balanced":
      return {
        mainMeals: 3,
        snacks: 2,
      };
    case "HighProtein":
      return {
        mainMeals: 4,
        snacks: 2,
      };
    case "LowCarb":
      return {
        mainMeals: 3,
        snacks: 1,
      };
    default:
      throw new Error("invalid diet type passed");
  }
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
