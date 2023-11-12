import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdote'

const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: parseInt((10 * Math.random()).toFixed(0))
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    updateAnecdote(state, action) {
      const updatedAnecdote = action.payload
      return state.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
    },
    addNewAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { updateAnecdote, addNewAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const allAnecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(allAnecdotes))
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.addNew(anecdote)
    dispatch(addNewAnecdote(newAnecdote))
  }
}

export const vote = (anecdote) => {
  return async dispatch => {
    const anecdoteToUpdate = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const updatedAnecdote = await anecdoteService.update(anecdoteToUpdate)
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer