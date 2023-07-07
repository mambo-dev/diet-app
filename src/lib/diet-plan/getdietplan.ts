export default function generateMealPlan(
  calorieIntake: number
): Promise<{
  mainMeals: number;
  snacks: number;
  description: string;
  type: "Balanced" | "LowCarb" | "HighProtein";
}> {
  return new Promise<{
    type: "Balanced" | "LowCarb" | "HighProtein";
    mainMeals: number;
    snacks: number;
    description: string;
  }>((resolve, reject) => {
    const { dietType } = getDietType(calorieIntake);

    switch (dietType) {
      case "Balanced":
        return resolve({
          type: "Balanced",
          mainMeals: 3,
          snacks: 2,
          description:
            "This meal plan is designed to provide a balanced and nutritious diet. The balanced nature of this meal plan aims to support overall health and well-being. With a focus on providing a variety of food groups, this plan can help you maintain a healthy lifestyle.",
        });
      case "HighProtein":
        return resolve({
          type: "HighProtein",
          mainMeals: 4,
          snacks: 2,
          description:
            "Protein is essential for muscle repair and growth, as well as supporting various bodily functions. By following this meal plan, you can ensure an adequate supply of protein throughout the day, helping you reach your fitness goals or maintain a protein-rich diet.",
        });
      case "LowCarb":
        return resolve({
          type: "LowCarb",
          mainMeals: 3,
          snacks: 1,
          description:
            "The LowCarb meal plan is designed for individuals who prefer or need to limit their carbohydrate intake. By reducing the number of carbohydrates consumed, this meal plan aims to help manage blood sugar levels, support weight loss goals, or address specific dietary requirements.",
        });
      default:
        return reject(new Error("invalid diet type passed"));
    }
  });
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
