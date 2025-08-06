import React from "react"
import { Link, useNavigate } from "react-router-dom"
import RatingStars from "./RatingStars"
import { useUser } from "@clerk/clerk-react"
import { supabase } from "../supabaseClient"

const BookCard = ({ post }) => {
  const { user } = useUser()
  const navigate = useNavigate()
  const isOwner = user?.id === post?.user_id

  const {
    id,
    title,
    image_url,
    rating,
    genre,
    progress,
    created_at,
    upvotes,
  } = post

  const deletePost = async () => {
    const confirm = window.confirm("Are you sure you want to delete this post?")
    if (!confirm) return

    const { error } = await supabase.from("posts").delete().eq("id", id)
    if (error) {
      console.error("Failed to delete post:", error.message)
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 relative">
      {/* Vintage decorative border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
      
      <Link to={`/posts/${id}`} className="no-underline text-inherit block">
        <div className="p-6">
          <div className="relative mb-4">
            <img
              src={image_url}
              alt={`${title} cover`}
              className="w-full h-72 object-cover rounded-lg shadow-lg border-2 border-gray-100"
            />
            <div className="absolute top-3 right-3 bg-white bg-opacity-95 rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-md border border-gray-200">
              {genre}
            </div>
          </div>
          
          <div className="text-gray-800">
            <h2 className="text-xl font-bold mb-3 text-gray-900 font-serif leading-tight">{title}</h2>
            
            <div className="flex items-center mb-4">
              <RatingStars rating={rating} />
              <span className="ml-2 text-sm text-gray-600 font-medium">{rating}/5</span>
            </div>
            
            <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-purple-200 shadow-sm">
              {progress}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500 font-medium">{new Date(created_at).toLocaleDateString()}</span>
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-1 text-lg">❤️</span>
                <span className="font-medium">{upvotes}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="px-6 pb-6">
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-md"
            >
              Edit
            </button>
            <button
              onClick={deletePost}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-md"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookCard
