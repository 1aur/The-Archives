import { Routes, Route, Navigate } from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react"

import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import EditPost from "./pages/EditPost"
import Navbar from "./components/NavBar"

function App() {
  return (
    <div>
      <Navbar />

      <Routes>
        {}
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostDetail />} />

        {}
        <Route
          path="/create"
          element={
            <SignedIn>
              <CreatePost />
            </SignedIn>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <SignedIn>
              <EditPost />
            </SignedIn>
          }
        />

        {}
        <Route
          path="/create"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />

        {}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
