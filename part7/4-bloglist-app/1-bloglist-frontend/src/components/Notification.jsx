import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const { type, notification } = useNotificationValue()
  switch (type) {
  case 'success':
    return (
      <div className="success">
        {notification}
      </div>
    )
  case 'error':
    return (
      <div className="error">
        {notification}
      </div>
    )
  default:
    return null
  }
}

export default Notification