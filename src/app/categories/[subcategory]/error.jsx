"use client";

export default function Error({ error, reset }) {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Something went wrong!</h1>
      <p>{error?.message || "Unknown error"}</p>
      <button
        onClick={() => reset()}
        style={{
          padding: "8px 16px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
