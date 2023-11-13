import { useState } from "react"
import { useField } from "../hooks"

const CreateNew = ({addNew}) => {

  const {resetValue: resetContent, ...content} = useField('content')
  const {resetValue: resetAuthor, ...author} = useField('author')
  const {resetValue: resetInfo, ...info} = useField('info')


  const handleSubmit = (e) => {
    e.preventDefault()
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content}/>
        </div>
        <div>
          author
          <input {...author}/>
        </div>
        <div>
          info
          <input {...info}/>
        </div>
        <button type='submit'>create</button>
      </form>
      <button onClick={() => {
          resetContent()
          resetAuthor()
          resetInfo()
        }}>reset</button>
    </div>
  )
}

export default CreateNew