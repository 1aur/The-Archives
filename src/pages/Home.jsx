import React, { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import BookCard from "../components/BookCard"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [genreFilter, setGenreFilter] = useState("All")
  const [sortBy, setSortBy] = useState("newest")
  const [loading, setLoading] = useState(true)

  const genres = ["All", "Romance", "Sci-Fi", "Fantasy", "Non-Fiction", "Coming of Age", "Mystery", "Historical"]

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching posts:", error)
      } else {
        setPosts(data)
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  const filteredAndSortedPosts = posts
    .filter((post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = genreFilter === "All" || post.genre === genreFilter
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at)
      } else if (sortBy === "mostUpvotes") {
        return (b.upvotes || 0) - (a.upvotes || 0)
      } else if (sortBy === "leastUpvotes") {
        return (a.upvotes || 0) - (b.upvotes || 0)
      }
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-serif text-gray-900 leading-tight">The Archives</h1>
        <p className="text-lg text-gray-600 font-medium">Discover and share your literary journey</p>
      </div>

      <div className="bg-white bg-opacity-70 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-lg border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by book title...</label>
            <input
              type="text"
              placeholder="Enter book title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by genre</label>
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="md:w-1/4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors duration-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostUpvotes">Most Upvotes</option>
              <option value="leastUpvotes">Least Upvotes</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Discovering literary treasures...</p>
        </div>
      ) : filteredAndSortedPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search or filters to discover more stories.</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedPosts.map((post) => (
            <BookCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
