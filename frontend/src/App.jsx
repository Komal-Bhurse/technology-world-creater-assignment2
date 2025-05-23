import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store, persistor } from '@/redux/store'
import { PersistGate } from 'redux-persist/integration/react';
import { Toaster } from "react-hot-toast";

import ErrorPage from './pages/404'

import AppTheme from "./themes/apptheme"
import SCPRegistration from "./pages/scp-registration"
import SCPLogin from "./pages/scp-login"

import SCPDashboard from './pages/scp-dashboard'
import FarmerRegistration from "./pages/farmer-registration"
import Farmers from "./pages/farmers"


function App() {

  const router = createBrowserRouter([

    {
      element: <AppTheme />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <SCPRegistration/>
        },
        {
          path: "/scp/login",
          element: <SCPLogin/>
        },
        {
          path: "/scp/dashboard",
          element: <SCPDashboard/>
        },
        {
          path: "/scp/farmers/",
          element: <Farmers/>
        },
        {
          path: "/scp/farmer-registration/",
          element: <FarmerRegistration/>
        },
        {
          path: "/scp/farmer-registration/:id",
          element: <FarmerRegistration/>
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
