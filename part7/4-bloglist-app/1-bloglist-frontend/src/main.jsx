import ReactDOM from 'react-dom/client'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import App from './App'
import './index.css'
import { NotificationContextProvider } from './NotificationContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserContextProvider } from './UserContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <Router>
          <App />
        </Router>
      </UserContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>
)