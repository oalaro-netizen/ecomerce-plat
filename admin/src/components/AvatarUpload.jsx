import { useRef, useState } from "react";

export default function AvatarUpload({ currentUrl, userData, onUpdated }) {
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phone: userData?.phone || "",
    dob: userData?.dob ? userData.dob.slice(0, 10) : "",
    address: userData?.address || "",
  });

  const handleClick = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("phone", form.phone);
    data.append("dob", form.dob);
    data.append("address", form.address);

    try {
      const res = await fetch("/api/upload/upload", { method: "POST", body: data, credentials: "include" });
      const result = await res.json();
      onUpdated?.(result.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="avatar-upload">
      <img src={currentUrl || "/avatar-placeholder.png"} alt="avatar" onClick={handleClick}
           style={{ cursor: "pointer", width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

      <input type="text" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
      <input type="text" placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      {loading && <span>Uploading...</span>}
    </div>
  );
}
