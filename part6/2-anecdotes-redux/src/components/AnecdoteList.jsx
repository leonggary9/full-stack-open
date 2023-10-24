import { useSelector, useDispatch } from 'react-redux'
import { voteFor } from '../reducers/anecdoteReducer'

const Anecdote = ({anecdote, handleVote}) => {
  return (
    <>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleVote}>vote</button>
      </div>
    </>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state)
  anecdotes.sort((a, b) => b.votes - a.votes)

  const dispatch = useDispatch()

  return (
    anecdotes.map(anecdote =>
      <Anecdote 
        key={anecdote.id} 
        anecdote={anecdote}
        handleVote={() => dispatch(voteFor(anecdote.id))}
      />
    )
  )
}

export default AnecdoteList