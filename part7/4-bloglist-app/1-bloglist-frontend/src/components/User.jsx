const User = ({ userProfile }) => {
  if (!userProfile) {
    return null
  }
  // console.log('rendering', userProfile)
  return (
    <>
      <h2>{userProfile.name}</h2>
      <div><strong>added blogs</strong></div>
      <ul>
        {
          userProfile.blogs.map(b => <li key={b.id}>{b.title}</li>)
        }
      </ul>
    </>
  )
}

export default User