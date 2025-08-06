import React from "react"
import { FaStar } from "react-icons/fa"

const RatingStars = ({ rating, setRating, editable = false }) => {
  const handleClick = (value) => {
    if (editable && setRating) {
      setRating(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          size={24}
          className={`cursor-pointer transition-colors duration-200 ${
            value <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => handleClick(value)}
        />
      ))}
    </div>
  )
}

export default RatingStars
