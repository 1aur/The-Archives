import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreatePost from "./pages/CreatePost"
import PostDetail from "./pages/PostDetail"
import Navbar from "./components/NavBar"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<PostDetail />} />
      </Routes>
    </div>
  )
}

export default App