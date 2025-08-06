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

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setImageUrl(reader.result) 
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

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
      navigate("/")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center font-serif text-gray-900">Create a New Book Post</h2>
      {!isSignedIn ? (
        <p className="text-center text-gray-600">Please sign in to create a post.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
            <input
              type="text"
              placeholder="Enter the book title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Review</label>
            <textarea
              placeholder="Share your thoughts about this book..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200 h-32 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors duration-200 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reading Progress</label>
            <select 
              value={progress} 
              onChange={(e) => setProgress(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            >
              <option>Haven't Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
            <input
              type="text"
              placeholder="e.g., Romance, Sci-Fi, Fantasy..."
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200 mb-3"
            />
            <p className="text-sm text-gray-600 mb-3 text-center">OR</p>
            <input
              type="url"
              placeholder="External image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            />
          </div>
          
          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-48 rounded-lg shadow-md border border-gray-200"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-md"
          >
            Create Post
          </button>
        </form>
      )}
    </div>
  )
}
