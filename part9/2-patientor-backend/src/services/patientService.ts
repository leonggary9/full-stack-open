import patientsData from '../../data/patients';
import { NewPatientEntry, Patient, PatientMasked } from '../types';
import { v1 as uuid } from 'uuid';

const allPatients = patientsData as Patient[];

const getPatients = (): Patient[] => {
  return allPatients;
};

const getPatientsMasked = (): PatientMasked[] => {
  return allPatients.map(({id, dateOfBirth, name, gender, occupation}) => ({
    id,
    dateOfBirth,
    name,
    gender,
    occupation
  }));
};

const addPatient = (patient: NewPatientEntry): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const id = uuid() as string;
  const newPatient = {
    id,
    ...patient
  };
  allPatients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsMasked,
  addPatient
};