interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface ExerciseValues {
  exerciseHours: number[];
  target: number;
}

const parseExerciseArgs = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  const argSize = args.length;
  const target = args[argSize - 1];
  const exerciseHours = args.slice(2, argSize-1);
  if (!isNaN(Number(target)) && exerciseHours.every((hr) => !isNaN(Number(hr)))) {
    return {
      exerciseHours: exerciseHours.map(hr => Number(hr)),
      target: Number(target)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }

};

export const exerciseCalculator = (exerciseHours: number[], target: number): Result => {
    const periodLength = exerciseHours.length;
    const trainingDays = exerciseHours.filter(h => h !== 0).length;
    const totalTrainingHours = exerciseHours.reduce((total, hrs) => total + hrs, 0);
    const average = totalTrainingHours/periodLength;
    const success = (average >= target);
    let rating: number;
    let ratingDescription: string;
    switch (true) {
      case average >= target: 
        rating = 3;
        ratingDescription = 'excellent';
        break;
      case average >= 0.75*target:
        rating = 2;
        ratingDescription = 'decent';
        break;
      case average >= 0.5*target: 
        rating = 1;
        ratingDescription = 'could be better';
        break;
      default:
        rating = 0;
        ratingDescription = 'poor';
        break;
    }
    
    const result: Result = {periodLength, trainingDays, target, average, success, rating, ratingDescription};
    return result;
  };

  // console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2))

  try {
    const { exerciseHours, target } = parseExerciseArgs(process.argv);
    console.log(exerciseCalculator(exerciseHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }