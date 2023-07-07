interface IMacroNutrient {
  calorie_intake: number;
  carbohydrate_percentage: number;
  proteins_percentage: number;
  fats_percentage: number;
}

export default function generate_macro_nutrients({
  calorie_intake,
  carbohydrate_percentage,
  proteins_percentage,
  fats_percentage,
}: IMacroNutrient): Promise<{
  carbohydrates: number;
  proteins: number;
  fats: number;
}> {
  return new Promise<{
    carbohydrates: number;
    proteins: number;
    fats: number;
  }>((resolve, reject) => {
    if (
      carbohydrate_percentage + proteins_percentage + fats_percentage !==
      100
    ) {
      reject(new Error("percentage should add up to 100"));
    }
    //calorie intake of carbo and proteins  is 4 calories per gram
    const carbohydrates =
      ((carbohydrate_percentage / 100) * calorie_intake) / 4;

    const proteins = ((proteins_percentage / 100) * calorie_intake) / 4;

    //calorie intake of fats  is 9 calories per gram
    const fats = ((fats_percentage / 100) * calorie_intake) / 9;

    return resolve({
      carbohydrates,
      fats,
      proteins,
    });
  });
}
