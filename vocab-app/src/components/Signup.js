import { useState } from 'react';
import { supabase } from '../supaBaseClient.js';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // --- Front-end password validation ---
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setMessage('Password must contain at least one uppercase letter.');
      return;
    }
    if (!/[0-9]/.test(password)) {
      setMessage('Password must contain at least one number.');
      return;
    }

    // --- Sign up with Supabase ---
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nickname } // stored in user_metadata
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Signup successful! Check your email to confirm your account.');
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
}
