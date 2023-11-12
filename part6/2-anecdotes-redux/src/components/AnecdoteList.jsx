import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

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
  let anecdotes = useSelector(({filter, anecdotes}) => {
    if (filter.length === 0) {
      return anecdotes
    } else {
      return anecdotes.filter(anecdote => anecdote.content.includes(filter))
    }
  })
  // Because the array is frozen in strict mode, you'll need to copy the array before sorting it
  anecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)

  const dispatch = useDispatch()

  const handleVote = (anecdote) => {
    dispatch(vote(anecdote))
    dispatch(setNotification(`you voted for '${anecdote.content}'`, 5000))
  }

  return (
    anecdotes.map(anecdote =>
      <Anecdote 
        key={anecdote.id} 
        anecdote={anecdote}
        handleVote={() => handleVote(anecdote)}
      />
    )
  )
}

export default AnecdoteList