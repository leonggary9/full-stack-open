import { useNotificationValue } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const notificationMsg = useNotificationValue()
  
  if (!notificationMsg) return null

  return (
    <div style={style}>
      {notificationMsg}
    </div>
  )
}

export default Notification
