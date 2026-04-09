import { RouterProvider } from "react-router"
import { guestRouter, userRouter } from "./router/router";

function App() {
  const user = null
  // const user = { email: 'peach@gmail.com'}
  const finalRouter = user ? userRouter : guestRouter ;
  return (
    <>
      <RouterProvider router={finalRouter}/>
    </>
  )
}

export default App