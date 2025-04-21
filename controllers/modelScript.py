import sys
import json
import random

def mock_predict():
    result = {
        "parkinson_detected": random.choice(["Yes", "No"]),
        "confidence": f"{round(random.uniform(80, 99), 2)}%"
    }
    return result

if __name__ == "__main__":
    image_path = sys.argv[1] if len(sys.argv) > 1 else None
    if not image_path:
        print(json.dumps({"error": "No image provided"}))
        sys.exit(1)

    prediction = mock_predict()
    print(json.dumps(prediction))
