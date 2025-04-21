const predict = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  const prediction = "";
  res
    .cookie("predictionData", prediction, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "Strict",
    })
    .json({ prediction });
};

const chat = async (req, res) => {
  const { data } = req.body;
  const predictionData = req.cookies?.predictionData;
  const apiKey = process.env.GEMINI_AI_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const medicalPrompt = `You are a highly experienced medical doctor with 20+ years of expertise. 
  Only respond to medical science-related queries, such as diseases, symptoms, treatments, medical procedures, and general healthcare advice. 
  If the user asks about something unrelated to medicine, politely decline to answer and encourage them to ask a medical question.
  
  The AI diagnostic model provided the following medical prediction:
  "${predictionData}"
  
  Based on this prediction, and the patient's question below, provide professional advice:
  "${predictionData}"
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
