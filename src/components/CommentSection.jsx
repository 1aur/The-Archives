import React, { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import { supabase } from "../supabaseClient"

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const { user } = useUser()

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching comments:", error)
      } else {
        setComments(data)
      }
    }

    fetchComments()
  }, [postId])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const { data, error } = await supabase.from("comments").insert([
      {
        text: newComment,
        post_id: postId,
        user_id: user.id,
        username: user.fullName || user.username || "Anonymous",
      },
    ])

    if (error) {
      console.error("Error posting comment:", error)
    } else {
      setComments([data[0], ...comments])
      setNewComment("")
    }
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Comments</h3>

      {user ? (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 italic">Sign in to leave a comment.</p>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="border-t pt-3">
              <p className="text-sm text-gray-800">{comment.text}</p>
              <div className="text-xs text-gray-500 mt-1">
                — {comment.username || "Anonymous"} ·{" "}
                {new Date(comment.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CommentSection
