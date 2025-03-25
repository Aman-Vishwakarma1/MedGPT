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

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      chatbotInput.value = "";
      getBotResponse(userMessage);
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", sender);
    messageElement.innerHTML = `<p><strong>${
      sender === "user" ? "You" : "Dr. Aman Vishwakarma"
    }:</strong> ${message}</p>`;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    const apiKey = "API-KEY";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const medicalPrompt = `
      You are a highly experienced medical doctor with 20+ years of expertise. 
      Only respond to medical science-related queries, such as diseases, symptoms, treatments, medical procedures, and general healthcare advice. 
      If the user asks about something unrelated to medicine, politely decline to answer and encourage them to ask a medical question.
    `;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: medicalPrompt }, { text: userMessage }],
            },
          ],
        }),
      });

      const data = await response.json();
      let botMessage =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm not sure how to respond.";

      // Ensure the response is medical-related
      if (
        botMessage.toLowerCase().includes("i'm not sure") ||
        !isMedicalResponse(botMessage)
      ) {
        botMessage =
          "I'm here to answer medical-related questions. Please ask about health, diseases, treatments, or medical procedures.";
      }

      appendMessage("bot", botMessage);
    } catch (error) {
      console.error("Error fetching bot response:", error);
      appendMessage("bot", "Sorry, something went wrong. Please try again.");
    }
  }

  function isMedicalResponse(response) {
    const medicalKeywords = [
      "disease",
      "symptoms",
      "treatment",
      "doctor",
      "medicine",
      "surgery",
      "health",
      "infection",
      "therapy",
      "diagnosis",
      "prescription",
      "injury",
      "pain",
      "hospital",
      "patient",
      "illness",
      "virus",
      "bacteria",
      "vaccine",
      "cancer",
      "blood pressure",
      "cardiology",
      "neurology",
      "orthopedic",
      "pediatrics",
      "dermatology",
      "gastroenterology",
    ];

    return medicalKeywords.some((keyword) =>
      response.toLowerCase().includes(keyword)
    );
  }
});
