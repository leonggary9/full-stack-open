import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = "http://localhost:3000/api/diaries";

const getAllEntries = async () => {
  const r = await axios.get<DiaryEntry[]>(baseUrl);
  return r.data;
}

const createEntry = async (obj: NewDiaryEntry) => {
  const r = await axios.post<DiaryEntry>(baseUrl, obj)
  return r.data
}

export default {
  getAllEntries,
  createEntry
}

