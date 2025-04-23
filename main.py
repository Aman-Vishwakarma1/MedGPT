# import tensorflow as tf
# import numpy as np
# from PIL import Image
# import sys
# # Load the model
# model = tf.keras.models.load_model('./my_parkinson_model_tf-1.h5')  # Change to your actual .h5 filename

# image_path0 = sys.argv[1]

# # Function to load and preprocess an image
# def load_and_preprocess_image(img_path, target_size=(224, 224)):
#     img = Image.open(img_path).convert("RGB")        # Ensure 3 channels
#     img = img.resize(target_size)                    # Resize to model's expected input
#     img_array = np.array(img) / 255.0                # Normalize pixel values to [0, 1]
#     img_array = np.expand_dims(img_array, axis=0)    # Add batch dimension
#     return img_array

# # Example image path (change this to your actual image file)
# image_path = image_path0

# # Load and preprocess image
# input_data = load_and_preprocess_image(image_path0)

# # Predict
# predictions = model.predict(input_data)

# # Output predictions
# print("Predictions:", predictions)


import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO
import sys

# Load the model
model = tf.keras.models.load_model('./my_parkinson_model_tf-1.h5')  # Change to your actual .h5 filename

# Function to preprocess the image
def preprocess_image(img, target_size=(224, 224)):
    img = img.convert("RGB")
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

# Read image from stdin (in binary format)
image_data = sys.stdin.buffer.read()

# Decode image (in binary format)
img = Image.open(BytesIO(image_data))

# Preprocess the image
input_data = preprocess_image(img)

# Predict
predictions = model.predict(input_data)

# Output predictions
print("Predictions:", predictions[0][0])
