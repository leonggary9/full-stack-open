import { useState } from 'react'

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Vote = ({vote}) => {
  if (vote != undefined) {
    return <p>has {vote} votes</p>
  } else {
    return <p>has 0 votes</p>
  }
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const handleNextAnecdote = () => {
    let newSelected = selected
    while (newSelected == selected) {
      newSelected = Math.floor(Math.random() * anecdotes.length)
    }
    setSelected(newSelected)
  }

  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    console.log(`current vote for ${selected} is ${newVotes[selected]}`)
    setVotes(newVotes)
  }

  const getHighestVotedAnecdote = () => {
    const maxVoteCount = Math.max(...votes)
    return votes.indexOf(maxVoteCount)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <Vote vote={votes[selected]} />
      <Button text='vote' handleClick={handleVote} />
      <Button text='next anecdote' handleClick={handleNextAnecdote} />

      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[getHighestVotedAnecdote()]}</p>
    </div>
  )
}

export default App