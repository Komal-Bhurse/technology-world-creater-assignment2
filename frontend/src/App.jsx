import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from "react-hot-toast";

import LoginTheme from './themes/login-theme'
import DashboardTheme from './themes/dashboard-theme'

import HomePage from './pages/home'
import UserManagementPage from './pages/user-managment'
import ErrorPage from './pages/404'

import AppTheme from "./themes/apptheme"
import SCPRegistration from "./pages/scp-registration"

function App() {

  const router = createBrowserRouter([

    {
      element: <AppTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <SCPRegistration/>
        }
      ]
    },

    {
      element: <LoginTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/login",
          element: <HomePage />
        }
      ]
    },
    {
      element: <DashboardTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/scp/dashboard",
          element: <UserManagementPage />
        }
      ]
    },
  ]);

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
          <Toaster />
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
