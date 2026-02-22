import React from "react";
import { Box } from "lucide-react";
import { Button } from "./ui/Button";
import { useOutletContext } from "react-router";

// Define your context type if not already defined elsewhere
// You can remove this if you already have it declared globally
type AuthContext = {
  isSignedIn: boolean;
  userName?: string;
  signIn: () => Promise<any>;
  signOut: () => Promise<any>;
};

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } =
    useOutletContext<AuthContext>();

  const handleAuthClick = async () => {
    try {
      if (isSignedIn) {
        await signOut(); // FIXED: must call the function
        console.log("User signed out");
      } else {
        const result = await signIn();
        console.log("User signed in:", result);
      }
    } catch (e) {
      console.error("Authentication failed:", e);
    }
  };

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>

          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi, ${userName}` : "Signed in"}
              </span>
              <Button size="sm" onClick={handleAuthClick} className="btn">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleAuthClick} size="sm" variant="ghost">
                Log In
              </Button>
              <a href="#upload" className="cta">
                Get Started
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
