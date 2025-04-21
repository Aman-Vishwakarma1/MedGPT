// Configure multer for file uploads

// Define the POST route to handle image uploads and predictions
const predict = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Placeholder for prediction logic
  const prediction = "No Parkinson's Detected"; // Replace with actual logic

  // Send the result back to the client
  res.json({ prediction });
};

const chat = async (req, res) => {
  const { data } = req.body;

  const apiKey = process.env.GEMINI_AI_KEY;
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
            parts: [{ text: medicalPrompt }, { text: data }],
          },
        ],
      }),
    });

    const json = await response.json();
    let message =
      json?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm not sure how to respond.";

    // Simple medical filter
    if (
      message.toLowerCase().includes("i'm not sure") ||
      !isMedicalResponse(message)
    ) {
      message =
        "I'm here to answer medical-related questions. Please ask about health, diseases, treatments, or medical procedures.";
    }

    res.json({ message });
  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ message: "Something went wrong on the server." });
  }
};

// Simple medical keyword filter
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

module.exports = { predict, chat };
