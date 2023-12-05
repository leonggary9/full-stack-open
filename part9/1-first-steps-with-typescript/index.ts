import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { exerciseCalculator } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
}); 

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  if (!isNaN(height) && !isNaN(weight)) {
    res.json({
      weight: weight,
      height: height,
      bmi: calculateBmi(height, weight)
    });
  } else {
    res.status(400).json({
      error: 'malformatted parameters'
    });
  }
}); 

app.post('/exercises', (req, res) => {
  console.log('request body', req.body);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const exerciseHours: number[] = req.body.daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const target: number = req.body.target;

  if (!exerciseHours || !target) {
    res.status(400).json({
      error: 'parameters missing'
    });
  }

  if (!isNaN(Number(target)) && exerciseHours.every((hr) => !isNaN(Number(hr)))) {
    res.json(exerciseCalculator(exerciseHours, target));
  } else {
    res.status(400).json({
      error: 'malformatted parameters'
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});