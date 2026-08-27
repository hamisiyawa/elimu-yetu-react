const API_URL = `${import.meta.env.VITE_API_URL}/api/payments`;

export const initiatePayment = async (materialId, phone, token) => {
  const response = await fetch(`${API_URL}/initiate`, {
    method:  "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ materialId, phone }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to start payment");
  return data; // { purchaseId, message }
};

export const checkPaymentStatus = async (purchaseId, token) => {
  const response = await fetch(`${API_URL}/${purchaseId}/status`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to check payment status");
  return data; // { status }
};