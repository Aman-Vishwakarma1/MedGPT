// const { spawn } = require("child_process");
// const path = require("path");

// const predict = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No image file uploaded" });
//   }

//   // Create a Python process
//   const pythonProcess = spawn("python", [path.join(__dirname, "../main.py")]);

//   // Send image buffer to Python through stdin as binary
//   pythonProcess.stdin.write(req.file.buffer);
//   pythonProcess.stdin.end();

//   let prediction = "";

//   pythonProcess.stdout.on("data", (data) => {
//     prediction += data.toString();
//   });

//   pythonProcess.stderr.on("data", (data) => {
//     console.error(`Python error: ${data}`);
//   });

//   pythonProcess.on("close", (code) => {
//     if (code !== 0) {
//       return res.status(500).json({ error: "Prediction failed" });
//     }

//     console.log("prediction : ", prediction);

//     res
//       .cookie("predictionData", prediction.trim(), {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "Strict",
//       })
//       .json({ prediction: prediction.trim() });
//   });
// };

const { spawn } = require("child_process");
const path = require("path");

const predict = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Create a Python process
  const pythonProcess = spawn("python", [path.join(__dirname, "../main.py")]);

  // Send image buffer to Python through stdin as binary
  pythonProcess.stdin.write(req.file.buffer);
  pythonProcess.stdin.end();

  let prediction = "";

  pythonProcess.stdout.on("data", (data) => {
    // Convert the data to string and extract the first floating-point number
    const cleanedData = data.toString();
    const match = cleanedData.match(/(\d+\.\d+)/); // Matches the first floating-point number

    if (match) {
      prediction = match[0]; // The first floating-point number
    }
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Python error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: "Prediction failed" });
    }

    // Round the prediction to 3 decimal places (if needed)
    const roundedPrediction = parseFloat(prediction).toFixed(3);

    // Determine the conclusion based on the prediction
    let conclusion = "";

    if (parseFloat(roundedPrediction) >= 0.5) {
      conclusion = "Having Parkinson's Disease (High Chances)";
    } else {
      conclusion = "Not Having Parkinson's Disease (Low Chances)";
    }

    // Send the rounded prediction and conclusion to the frontend
    res
      .cookie("predictionData", roundedPrediction, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({
        prediction: roundedPrediction,
        conclusion: conclusion,
      });
  });
};

const chat = async (req, res) => {
  const { data } = req.body;
  const predictionData = req.cookies?.predictionData;
  const apiKey = process.env.GEMINI_AI_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  let medicalPrompt = "";
  if (predictionData === undefined) {
    medicalPrompt = `You are a highly experienced medical doctor with 20+ years of expertise. 
  Only respond to medical science-related queries, such as diseases, symptoms, treatments, medical procedures, and general healthcare advice. 
  If the user asks about something unrelated to medicine, politely decline to answer and encourage them to ask a medical question.`;
  } else {
    medicalPrompt = `You are a highly experienced medical doctor with 20+ years of expertise. 
    Only respond to medical science-related queries, such as diseases, symptoms, treatments, medical procedures, and general healthcare advice. 
    If the user asks about something unrelated to medicine, politely decline to answer and encourage them to ask a medical question.
    
    The AI diagnostic model provided the following medical prediction:
    "${predictionData}"
    
    Based on this prediction, and the patient's question below, provide professional advice:
    "${predictionData}"
      `;
  }

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
