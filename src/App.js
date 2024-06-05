import { createBrowserRouter, RouterProvider } from "react-router-dom"

import Username from "./component/Username"
import Password from "./component/Password"
import Register from "./component/Register"
import Recovery from "./component/Recovery"
import Profile from "./component/Profile"
import Reset from "./component/Reset"
import NotFound from "./component/NotFound"

// auth middleware
import { AuthorizeUser, ProtectRoute } from "./middleware/auth"

// root routers
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "/*",
    element: <NotFound></NotFound>,
  },
])
function App() {
  console.log(process.env.REACT_APP_SERVER_DOMAIN)
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
  )
}

export default App
