interface PhysicalValues {
  height: number;
  weight: number;
}

const parseArgs = (args: string[]): PhysicalValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi: number = weight/((height/100)^2);
  switch (true) {
    case bmi < 18.5:
      return 'Underweight';
    case 18.5 <= bmi && bmi <= 24.9:
      return 'Normal';
    case 25 <= bmi && bmi <= 29.9:
      return 'Overweight';
    case bmi > 29.9:
      return 'Obese';
    default:
      return '';
  }
};

try {
  const { height, weight } = parseArgs(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

// console.log(calculateBmi(180, 74))