async function ask() {
  const input = document.getElementById("question");
  const chat = document.getElementById("chat");

  const question = input.value.trim();

  if (!question) return;

  addMessage(question, "user");

  input.value = "";

  const loading = addMessage("Thinking...", "ai", "loading");

  try {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    loading.remove();

    addMessage(data.answer, "ai");
  } catch (err) {
    loading.remove();

    addMessage("Error contacting server", "ai");
  }

  chat.scrollTop = chat.scrollHeight;
}

function addMessage(text, type, extraClass = "") {
  const chat = document.getElementById("chat");

  const msg = document.createElement("div");

  msg.className = `message ${type} ${extraClass}`;

  msg.innerText = text;

  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;

  return msg;
}
