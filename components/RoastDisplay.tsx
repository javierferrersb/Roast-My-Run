"use client";

import { useState } from "react";

/**
 * RoastDisplay Component
 *
 * Displays the AI-generated roast with:
 * - Animated display
 * - Copy to clipboard button
 * - Share button
 * - Retry/regenerate button
 */
interface RoastDisplayProps {
  roast: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

export function RoastDisplay({
  roast,
  isLoading = false,
  onRetry,
}: RoastDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roast);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy roast:", err);
    }
  };

  const handleShare = async () => {
    const shareText = `Check out my run roast: "${roast}"`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Roast My Run",
          text: shareText,
        });
      } catch (err) {
        console.error("Failed to share:", err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <p>🔥 Generating your roast...</p>
      </div>
    );
  }

  if (!roast) {
    return null;
  }

  return (
    <div
      style={{
        padding: "2rem",
        background: "#fff8dc",
        borderRadius: "8px",
        borderLeft: "4px solid #ff6b6b",
        margin: "1.5rem 0",
        animation: "slideIn 0.3s ease-in-out",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#ff6b6b" }}>🔥 Your Roast:</h3>
      <p
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: "1.6",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {roast}
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCopyToClipboard}
          style={{
            padding: "0.5rem 1rem",
            background: copied ? "#51cf66" : "#667eea",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "📋 Copy"}
        </button>

        <button
          onClick={handleShare}
          style={{
            padding: "0.5rem 1rem",
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            transition: "background 0.2s",
          }}
        >
          🔗 Share
        </button>

        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: "0.5rem 1rem",
              background: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "background 0.2s",
            }}
          >
            🔄 Regenerate
          </button>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
