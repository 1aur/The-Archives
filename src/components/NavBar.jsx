import { Link } from "react-router-dom"
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react"

export default function Navbar() {
  return (
    <nav style={{ padding: "10px", display: "flex", gap: "20px", alignItems: "center" }}>
      <Link to="/">🏛️ The Archives</Link>
      <Link to="/create">Create Post</Link>
      <div style={{ marginLeft: "auto" }}>
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </nav>
  )
}