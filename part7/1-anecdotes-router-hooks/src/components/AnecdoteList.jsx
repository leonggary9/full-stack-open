import { Link } from "react-router-dom"

const buttonMargin = {
  marginLeft: 5
}

const AnecdoteList = ({ anecdotes, vote }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id}>
        <Link to={`anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        <button onClick={() => {vote(anecdote.id)}} style={buttonMargin}>vote</button>
      </li>
      )}
    </ul>
  </div>
)

export default AnecdoteList