import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div>
      <h1>Welcome to Vocab App</h1>
      <p>Start building your personal dictionary.</p>
      <Link to="/signup">Sign Up</Link> | <Link to="/login">Login</Link>
    </div>
  );
}
