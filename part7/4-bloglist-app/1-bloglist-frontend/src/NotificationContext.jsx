import { createContext, useContext, useReducer } from 'react'

const emptyNotification = {
  type: '',
  notification: ''
}

const notificationReducer = (state, action) => {
  switch (action.type) {
  case 'SET_SUCCESS':
    return {
      type: 'success',
      notification: action.payload,
    }
  case 'SET_ERROR':
    return {
      type: 'error',
      notification: action.payload,
    }
  case 'REMOVE':
    return emptyNotification
  default:
    return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, emptyNotification)
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[0]
}

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext)
  return notificationAndDispatch[1]
}

export default NotificationContext