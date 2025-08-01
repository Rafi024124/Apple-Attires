'use client';
import axios from 'axios';
import { useState } from 'react';
import {  signIn } from "next-auth/react"
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
  
    try {
       const response= await signIn("credentials", {email, password, callbackUrl: '/',redirect: false,})
       if(response.ok){
        router.push('/');
        form.reset();
       }
       else{
        alert("Authentication Failed");
       }
    } catch (error) {
        console.log(error);
        
    }
    
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name='email'
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        name='password'
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
