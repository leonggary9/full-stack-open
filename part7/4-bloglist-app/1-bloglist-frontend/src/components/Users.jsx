import {
  Link
} from 'react-router-dom'

const Users = ({ users }) => {

  if (!users) return null

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map(u =>
              <tr key={u.name}>
                <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
                <td>{u.blogs.length}</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>

  )
}

export default Users