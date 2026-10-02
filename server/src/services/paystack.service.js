export async function initializeTransaction(email, amount, reference, callbackUrl, metadata = {}) {
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, amount: Math.round(amount * 100), reference, callback_url: callbackUrl, metadata }),
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || "Paystack init failed");
  return data.data;
}

export async function verifyTransaction(reference) {
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!data.status) throw new Error(data.message || "Verification failed");
  return data.data;
}