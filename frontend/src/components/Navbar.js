// import { Link } from "react-router-dom";
// import { useLogout } from "../hooks/useLogout";
// import { useAuthContext } from "../hooks/useAuthContext";

// const Navbar = () => {
//   const { logout } = useLogout();
//   const { user } = useAuthContext();

//   const handleclick = () => {
//     logout();
//   };
//   return (
//     <header>
//       <div className="container">
//         <Link to="/">
//           <h1>Workout Buddy</h1>
//         </Link>
//         <nav>
//           {user && (
//             <div>
//               <span>{user.email}</span>
//               <button onClick={handleclick}>Log out</button>
//             </div>
//           )}
//           {!user && (
//             <div>
//               <Link to="/login">Login </Link>
//               <Link to="/signup">Signup </Link>
//             </div>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Navbar;



// added user profile feature to the page
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [displayUsername, setDisplayUsername] = useState('');

  useEffect(() => {
    const fetchNavbarProfile = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const json = await response.json();

        if (response.ok) {
          // Fall back to the email prefix if they haven't chosen a username yet
          setDisplayUsername(json.username || user.email.split('@')[0]);
        }
      } catch (err) {
        console.error("Error updating navbar profile name:", err);
      }
    };

    fetchNavbarProfile();
  }, [user]); // Re-runs whenever the auth state changes (login/logout)

  const handleclick = () => {
    logout();
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Workout Buddy</h1>
        </Link>
        <nav>
          {user && (
            <div className="nav-profile-section">
              <Link to="/profile" className="avatar-link">
                <div className="avatar-circle">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </Link>
              {/* Displays real-time username dynamically */}
              <span className="username-text">@{displayUsername}</span>
              <button onClick={handleclick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login </Link>
              <Link to="/signup">Signup </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;