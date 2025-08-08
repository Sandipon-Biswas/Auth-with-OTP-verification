
import React from 'react';

export default function Home({ user }) {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      {user ? (
        <p className="text-xl">স্বাগতম, <span className="font-semibold">{user}</span>!</p>
      ) : (
        <p>দয়া করে লগইন করুন।</p>
      )}
    </div>
  );
}
