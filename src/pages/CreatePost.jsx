  import { useState } from "react"
  import { useUser } from "@clerk/clerk-react"
  import { supabase } from "../supabaseClient"
  import { useNavigate } from "react-router-dom"
  
  export default function CreatePost() {
    const { isSignedIn, user } = useUser()
    const navigate = useNavigate()
  
    const [title, setTitle] = useState("")
    const [review, setReview] = useState("")
    const [rating, setRating] = useState(0)
    const [progress, setProgress] = useState("Haven't Started")
    const [genre, setGenre] = useState("")
    const [imageUrl, setImageUrl] = useState("")
  
    const handleSubmit = async (e) => {
      e.preventDefault()
  
      if (!isSignedIn) {
        alert("You must be signed in to create a post!")
        return
      }
  
      const { error } = await supabase.from("posts").insert({
        title,
        review,
        rating,
        progress,
        genre,
        image_url: imageUrl,
        upvotes: 0,
        user_id: user.id,
      })
  
      if (error) {
        console.error("Error creating post:", error.message)
      } else {
        navigate("/") // go to home page after submission
      }
    }
  
    return (
      <div style={{ padding: "20px" }}>
        <h2>Create a New Book Post</h2>
        {!isSignedIn ? (
          <p>Please sign in to create a post.</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "500px" }}>
            <input
              type="text"
              placeholder="Title of Book"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Book Review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <input
              type="number"
              placeholder="Rating (1–5)"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
            />
            <select value={progress} onChange={(e) => setProgress(e.target.value)}>
              <option>Haven't Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <input
              type="text"
              placeholder="Genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button type="submit">Create Post</button>
          </form>
        )}
      </div>
    )
  } 