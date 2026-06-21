const API = "http://127.0.0.1:10000/ai";

export async function callAI(type, data) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      data
    })
  });

  return response.json();
}