import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../supabaseClient"
import RatingStars from "../components/RatingStars"
import { useUser } from "@clerk/clerk-react"

const EditPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isSignedIn } = useUser()

  const [post, setPost] = useState(null)
  const [title, setTitle] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [progress, setProgress] = useState("")
  const [genre, setGenre] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !data) {
        setError("Post not found.")
        return
      }

      if (data.user_id !== user?.id) {
        setError("You are not authorized to edit this post.")
        return
      }

      setPost(data)
      setTitle(data.title)
      setReview(data.review)
      setRating(data.rating)
      setProgress(data.progress)
      setGenre(data.genre)
      setImageUrl(data.image_url)
    }

    if (isSignedIn) fetchPost()
  }, [id, user, isSignedIn])

  const handleUpdate = async (e) => {
    e.preventDefault()

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        review,
        rating,
        progress,
        genre,
        image_url: imageUrl,
      })
      .eq("id", id)

    if (error) {
      alert("Failed to update post.")
      console.error(error)
    } else {
      navigate(`/post/${id}`) 
    }
  }

  if (!isSignedIn) return <div className="text-center mt-10">Please sign in to edit a post.</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>
  if (!post) return <div className="text-center mt-10 text-gray-500">Loading post...</div>

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Book Post</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of Book"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Book Review"
          className="w-full border border-gray-300 p-2 rounded h-24"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <RatingStars rating={rating} setRating={setRating} editable={true} />
        </div>

        <select
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded"
          required
        >
          <option value="">Select Progress</option>
          <option value="Haven’t Started">Haven’t Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          placeholder="Genre (e.g., Romance, Sci-Fi)"
          className="w-full border border-gray-300 p-2 rounded"
          required
        />

        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL of Book"
          className="w-full border border-gray-300 p-2 rounded"
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default EditPost
