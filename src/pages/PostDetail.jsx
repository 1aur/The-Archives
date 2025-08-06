import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { useUser } from "@clerk/clerk-react"

const PostDetail = () => {
  const { id } = useParams()
  const { user } = useUser()

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [upvoteCount, setUpvoteCount] = useState(0)

  useEffect(() => {
    fetchPost()
    fetchComments()
  }, [id])

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching post:", error)
    } else {
      setPost(data)
      setUpvoteCount(data.upvotes || 0)
    }
  }

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: true })

    if (error) console.error("Error fetching comments:", error)
    else setComments(data)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("You must be signed in to comment.")
      return
    }

    const { error } = await supabase.from("comments").insert({
      post_id: id,
      user_id: user.id,
      content: newComment,
    })

    if (error) {
      console.error("Error adding comment:", error)
    } else {
      setNewComment("")
      fetchComments()
    }
  }

  const handleUpvote = async () => {
    const newCount = upvoteCount + 1
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: newCount })
      .eq("id", id)

    if (error) {
      console.error("Error upvoting post:", error)
    } else {
      setUpvoteCount(newCount)
    }
  }

  if (!post) return <p className="text-center mt-10 text-gray-600">Loading post...</p>

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <p className="italic text-sm text-gray-500 mb-2">{post.genre} • {post.progress}</p>
      <img src={post.image_url} alt={post.title} className="w-full h-auto rounded mb-4" />
      <p className="mb-4">{post.review}</p>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleUpvote}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          ❤️ Upvote
        </button>
        <span className="text-gray-600">{upvoteCount} upvotes</span>
      </div>

      <hr className="my-4" />

      <div>
        <h3 className="text-lg font-semibold mb-2">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-2 rounded">
                {comment.content}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border rounded mb-2"
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Post Comment
          </button>
        </form>
      </div>
    </div>
  )
}

export default PostDetail
