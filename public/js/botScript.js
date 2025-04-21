document.addEventListener("DOMContentLoaded", function () {
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotIcon = document.getElementById("chatbot-icon");
  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  if (sendBtn) sendBtn.addEventListener("click", sendMessage);
  if (chatbotInput) {
    chatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  async function sendMessage() {
    const promptText = chatbotInput.value.trim();
    chatbotInput.value = "";
    if (promptText) {
      appendMessage("user", promptText);
      try {
        const response = await fetch("/image/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: promptText,
          }),
        });

        const { message } = await response.json();
        appendMessage("bot", message);
      } catch (error) {
        console.error("Error:", error);
        appendMessage("bot", "Sorry, something went wrong.");
      }
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);

    const formattedMessage =
      sender === "bot" ? formatMessage(message) : message;

    messageElement.innerHTML = `<p><strong>${
      sender === "user" ? "You" : "DR. VCET"
    }:</strong> ${formattedMessage}</p>`;

    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function formatMessage(message) {
    // Convert bold **text**
    message = message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Convert italic *text*
    message = message.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Convert bullet points * Item
    message = message.replace(
      /(^|\n)\* (.*?)(?=\n|$)/g,
      "$1<ul><li>$2</li></ul>"
    );
    message = message.replace(/<\/ul>\s*<ul>/g, ""); // Remove duplicate ULs

    // Convert numbered lists 1. Item
    message = message.replace(
      /(^|\n)\d+\.\s(.*?)(?=\n|$)/g,
      "$1<ol><li>$2</li></ol>"
    );
    message = message.replace(/<\/ol>\s*<ol>/g, ""); // Merge adjacent OLs

    // Convert new lines to <br>
    message = message.replace(/\n/g, "<br>");

    return message;
  }
});
