import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import "./index.css";


import App from './App.jsx'
import MainPage from "./pages/MainPage";
import CreateRoom from "./pages/CreateRoom";
import AccessRoom from "./pages/AccessRoom";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <h1 className="display-2">Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: "/createRoom/:userId",
        element: <CreateRoom />,
      },
      {
        path: "/public/joinroom/:roomCode", // ✅ fixed
        element: <AccessRoom />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
