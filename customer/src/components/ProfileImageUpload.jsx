import React, { useRef, useState } from "react";

export default function ProfileImageUpload({ user, onUpdate }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      onUpdate?.(data.user);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Display either uploaded image or initials
  const hasAvatar = user?.avatar;
  const initials = user?.name
    ? user.name
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  return (
    <div onClick={triggerFilePicker} style={{ cursor: "pointer", position: "relative", width: "100%", height: "100%" }}>
      {hasAvatar ? (
        <img
          src={user.avatar}
          alt="Profile"
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: "2px solid #ccc" }}
        />
      ) : (
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "100%", height: "100%", borderRadius: "50%",
          background: "#e0e0e0", color: "#333", fontWeight: 600, fontSize: "2rem"
        }}>
          {initials}
        </span>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {uploading && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "rgba(0,0,0,0.5)", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.9rem"
        }}>
          Uploading...
        </div>
      )}
    </div>
  );
}