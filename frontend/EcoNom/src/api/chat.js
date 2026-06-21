export async function callAI(type, data = {}) {
  const res = await fetch("http://127.0.0.1:10000/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
      data
    })
  });

  return await res.json();
}