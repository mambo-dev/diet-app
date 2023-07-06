## simple break down of how the app works

DIET PLAN ALGORITHMS
Once a user creates a profile with their height, weight, age, gender, activity level which are used to calculate the basic metabolic rate
For male the formula for calculating the basic metabolic rate –
(10 _ (weight in kg)) + (6.25 _ (height in cm)) – (5 \* age in years) + 5
For females
(10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) – 161

The activity level comes in when calculating the required calorie intake of a person
So if you live a sedentary lifestyle your calorie intake should be less else if its more active it should be more, and the recommended calorie intake will be calculated by assigining a multiplier to each activity level with sedentary being the least and extra active being the most
Sedentary = 1.2
Lightly active = 1.375
moderately active = 1.55
very active = 1.725
extra active = 1.9
Bmr that we got before _ the activity Level multiplier
To get the macro nutrients we take the calorie intake recommended and also the desired percentages given by user each gram of carbohydrates and proteins provides around 4 calories, while each gram of fat provides around 9 calories, the function will convert the absolute amounts of each macronutrient back to grams by dividing by their respective calorie-per-gram values.
// carbohydrates
(Carbohydrate percentage / 100) _ calorieIntake / 4;
// proteins
(Protein percentage / 100) _ calorieIntake / 4;
// fats
(Fat percentage / 100) _ calorieIntake / 9;
After getting that we now assign you a diet plan
If calorie intake is greater than or equal to 1600 - High-Protein Plan:
If calorie intake is greater than or equal to 1500 and less than 1600 – balanced plan
If calorie intake is less than 1500 - Low-Carb Plan:
Then for the no of meals or meal structure we give based on the plan we have calculated
// meal structure

1. Balanced: mainMeals: 3, snacks: 2,
2. LowCarb: mainMeals: 3 , snacks: 1,
3. HighProtein: mainMeals: 4, snacks: 2,
   // save all results in the diet plan table

// sample output of a diet plan
Balanced Plan:

Daily Calorie Intake: 1500 calories
Macronutrient Breakdown: 40% carbohydrates, 30% proteins, 30% fats
Meal Structure: 3 main meals, 2 snacks

Low-Carb Plan:

Daily Calorie Intake: 1400 calories
Macronutrient Breakdown: 20% carbohydrates, 40% proteins, 40% fats
Meal Structure: 3 main meals, 1 snack
High-Protein Plan:

Daily Calorie Intake: 1600 calories
Macronutrient Breakdown: 30% carbohydrates, 45% proteins, 25% fats
Meal Structure: 4 main meals, 2 snacks

// how to create meal plan template for a user
Create a template let user add foods they take for the week then take all foods in the users meal plan and generate a shopping list
// track the weeks so week one from when user requested a meal plan template ie week one eat this week two eat this …. Question should we let user see past meal plans or at the end of the week let user decide whether to save that meal plan
