const padding = {
  paddingBottom: 10
}

const Anecdote = ({anecdote}) => (
  <div>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <div style={padding}>has {anecdote.votes} votes</div>
    <div style={padding}>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
  </div>
)

export default Anecdote