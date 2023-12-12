import diagnosisData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const allDiagnoses = diagnosisData as Diagnosis[];

const getDiagnoses = () => {
  return allDiagnoses;
};

export default {
  getDiagnoses
};