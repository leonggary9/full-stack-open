import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addAnecdote } from "../requests"
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {

  const queryClient = useQueryClient()

  const notificationDispatch = useNotificationDispatch()

  const addAnecdoteMutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: (newNote) => {
      console.log('added', newNote)
      const notes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], notes.concat(newNote))
      notificationDispatch({
        type: "SET",
        payload: `you added ${newNote.content}`
      })
      setTimeout(() =>
        notificationDispatch({
          type: "REMOVE"
        }), 5000)
    },
    onError: () => {
      console.log('error')
      notificationDispatch({
        type: "SET",
        payload: "too short anecdote, need to be length 5 or more"
      })
      setTimeout(() =>
        notificationDispatch({
          type: "REMOVE"
        }), 5000)
    }
  })

  const onCreate = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    addAnecdoteMutation.mutate({
      content: content,
      votes: 0
    })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
