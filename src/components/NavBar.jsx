import { Link } from "react-router-dom"
import { useUser, UserButton, SignInButton, SignOutButton } from "@clerk/clerk-react"
import "./NavBar.css"

export default function Navbar() {
  const { isSignedIn } = useUser()

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title">The Archives</Link>
        <Link to="/create" className="navbar-link">Create Post</Link>
         </div>

      <div className="navbar-right">
      <div className="navbar-right">
  {isSignedIn ? (
    <div className="user-info">
      <UserButton afterSignOutUrl="/" />
      <SignOutButton>
        <button className="signout-button">Sign out</button>
      </SignOutButton>
    </div>
  ) : (
    <SignInButton mode="modal">
      <button className="signin-button">Sign In</button>
    </SignInButton>
  )}
</div>
      </div>
    </nav>
  )
}
