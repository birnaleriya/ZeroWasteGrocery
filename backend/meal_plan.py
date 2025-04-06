import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import ast
import re
import json
from PIL import Image
import pytesseract
from langchain_google_genai import GoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_core.output_parsers import StrOutputParser

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Check for API key
if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY not found in environment variables. Please add it to your .env file.")

# Initialize Gemini model
gemini = GoogleGenerativeAI(model="gemini-1.5-pro")

def calculate_days_to_expiry(expiry_dates):
    """Calculate days until expiry for each item."""
    today = datetime.today().date()
    return {item: (datetime.strptime(date, "%Y-%m-%d").date() - today).days for item, date in expiry_dates.items()}

prompt_template_items = PromptTemplate(
    input_variables=["extracted_text"],
    template="""
    this is the text extracted from a grocery bill using pytesseract: {extracted_text}.
    Extract the list of grocery items from this.
    Write the names of the grocery items used for food only in a readable format with full name.
    Write these items as a list, like: ['Item 1 Name', 'Item 2 Name', 'Item 3 Name', ...] with no preamble.
    """
)

# Create prompt templates
# prompt_template_meal = PromptTemplate(
#     input_variables=["age", "weight", "height", "gender", "diet_type", "allergies", "health_conditions", "health_goal", "cuisine", "item_list", "days_to_expiry"],
#     template="""
#     1. You are an AI nutritionist. Generate a 7-day meal plan (4 meals per day) based on the following details:
#     - Age: {age}
#     - Weight: {weight} kg
#     - Height: {height} cm
#     - Gender: {gender}
#     - Dietary Preferences: {diet_type}
#     - Allergies: {allergies}
#     - Health Conditions: {health_conditions}
#     - Health Goal: {health_goal}
#     - Preferred Cuisine: {cuisine}
#     - Available Ingredients: {item_list}
#     - Time Until Expiry (Days): {days_to_expiry}
    
#     2. The plan should be optimized to minimize food waste by prioritizing items that expire soon.
#     3. Strictly do not repeat the exact same meals on consecutive days.
#     4. Double check your responses before finalizing the meal plan.
#     5. Output the plan in JSON format with days (monday, tuesday, wednesday, etc.) as keys and each day containing 4 meals (breakfast, lunch, snacks, dinner).
#     6. Make sure that the response does not contain any preamble. Return JSON text only, no markdown formatting, no triple backticks, no explanations.
#     """
# )
# update prompt_template_meal: ❗


# prompt_template_meal = PromptTemplate(
#     input_variables=["age", "weight", "height", "gender", "diet_type", "allergies", "health_conditions", "health_goal", "cuisine", "item_list", "days_to_expiry"],
#     template="""
#     1. You are an AI nutritionist. Generate a 7-day meal plan (4 meals per day) based on the following details:
#     - Age: {age}
#     - Weight: {weight} kg
#     - Height: {height} cm
#     - Gender: {gender}
#     - Dietary Preferences: {diet_type}
#     - Allergies: {allergies}
#     - Health Conditions: {health_conditions}
#     - Health Goal: {health_goal}
#     - Preferred Cuisine: {cuisine}
#     - Available Ingredients: {item_list}
#     - Time Until Expiry (Days): {days_to_expiry}
    
#     2. The plan should be optimized to minimize food waste by prioritizing items that expire soon.
#     3. Strictly do not repeat the exact same meals on consecutive days.
#     4. Double check your responses before finalizing the meal plan.
#     5. Output the plan in JSON format with days (monday, tuesday, wednesday, etc.) as keys and each day containing 4 meals (breakfast, lunch, snacks, dinner).
#     6. Make sure that the response does not contain any preamble. Return JSON text only, no markdown formatting, no triple backticks, no explanations.
#     """ 
# )
prompt_template_meal = PromptTemplate(
    input_variables=["age", "weight", "height", "gender", "diet_type", "allergies", "health_conditions", "health_goal", "cuisine", "item_list", "days_to_expiry"],
    template="""
    1. You are an AI nutritionist. Generate a 7-day meal plan (4 meals per day) based on the following details:
    - Age: {age}
    - Weight: {weight} kg
    - Height: {height} cm
    - Gender: {gender}
    - Dietary Preferences: {diet_type}
    - Allergies: {allergies}
    - Health Conditions: {health_conditions}
    - Health Goal: {health_goal}
    - Preferred Cuisine: {cuisine}
    - Available Ingredients: {item_list}
    - Time Until Expiry (Days): {days_to_expiry}

    2. The plan should be optimized to minimize food waste by prioritizing items that expire soon.
    3. Strictly do not repeat the exact same meals on consecutive days.
    4. Double-check your responses before finalizing the meal plan.
    5. For each meal (breakfast, lunch, snacks, dinner), provide both the recipe name and the **detailed step-by-step cooking instructions**.
    6. Output the plan in JSON format with days (monday, tuesday, wednesday, etc.) as keys and each day containing 4 meals (breakfast, lunch, snacks, dinner). For each meal, include:
       - "recipe_name": (name of the dish)
       - "instructions": (step-by-step preparation instructions)
    7. Make sure that the response does not contain any preamble. Return JSON text only, no markdown formatting, no triple backticks, no explanations.
    """
)

prompt_template_recipe = PromptTemplate(
    input_variables=["meal", "item_list", "days_to_expiry"],
    template="""
    1. You are an AI nutritionist. Generate a recipe based on the following details:
    - Meal: {meal}
    - Items: {item_list}
    - Time until expiry: {days_to_expiry}
    2. The recipe should be optimized to minimize food waste by prioritizing items that expire soon. If absolutely needed, include items not available in the items list as well, while specifying them.
    3. Double check your responses before finalizing the meal recipe.
    4. Output the plan in JSON format with "recipes" array containing recipe_name, ingredients (item, quantity, note) and instructions, all for each recipe.
    5. Make sure that the response does not contain any preamble. Return JSON text only.
    """ )

# Create chains
chain_items = prompt_template_items | gemini | StrOutputParser()
chain_meal = prompt_template_meal | gemini | StrOutputParser()
chain_recipe = prompt_template_recipe | gemini | StrOutputParser()

@app.route("/extract-items", methods=["POST"])
def extract_items():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    image_file = request.files['image']
    image = Image.open(image_file)

    # OCR using pytesseract
    extracted_text = pytesseract.image_to_string(image)

    # LLM processing
    result = chain_items.invoke(input={"extracted_text": extracted_text})

    try:
        grocery_list = ast.literal_eval(result)
    except Exception as e:
        return jsonify({"error": "Failed to parse LLM response", "llm_output": result}), 500
    return jsonify({"grocery_items": grocery_list})
# @app.route("/generate-recipe", methods=["POST"])
# def generate_recipe():
#     try:
#         data = request.json
#         meal = data.get("meal", "Lunch")
#         ingredients = data.get("ingredients", [])
#         expiry_dates = data.get("expiry_dates", {})

#         today = datetime.date.today()

#         days_to_expiry = {
#             item: (datetime.date.fromisoformat(expiry_dates[item]) - today).days
#             for item in ingredients if item in expiry_dates
#         }

#         result = chain_recipe.invoke({
#             "meal": meal,
#             "item_list": ingredients,
#             "days_to_expiry": days_to_expiry
#         })

#         recipe_json = json.loads(result)
#         return jsonify(recipe_json)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
@app.route('/generate-recipe', methods=['POST'])
def generate_recipe():
    try:
        # Handle FormData
        ingredients_raw = request.form.get('ingredients')
        expiry_dates_raw = request.form.get('expiry_dates')

        # Convert JSON strings to Python dict/lists
        ingredients = json.loads(ingredients_raw) if ingredients_raw else []
        expiry_dates = json.loads(expiry_dates_raw) if expiry_dates_raw else {}

        # Dummy example recipe generation
        recipes = [
            {
                "recipe_name": "Quick Mixed Veggie Stir Fry",
                "ingredients": [
                    {"item": "Carrot", "quantity": "1 cup", "note": "sliced"},
                    {"item": "Bell Pepper", "quantity": "1 cup", "note": "diced"},
                    {"item": "Soy Sauce", "quantity": "2 tbsp", "note": "to taste"},
                ],
                "instructions": "Heat oil in a pan, sauté all veggies, add sauce, stir for 5 minutes, and serve hot."
            },
            {
                "recipe_name": "Simple Fried Rice",
                "ingredients": [
                    {"item": "Cooked Rice", "quantity": "2 cups", "note": "leftover"},
                    {"item": "Vegetables", "quantity": "1 cup", "note": "chopped"},
                    {"item": "Egg", "quantity": "1", "note": "optional"},
                ],
                "instructions": "Stir-fry veggies, add rice and egg, season with spices, cook for 7 minutes."
            }
        ]

        return jsonify({"recipes": recipes})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
        
# @

@app.route('/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    """API endpoint to generate a meal plan from text or image upload."""
    try:
        # Try to get data from form (for image upload + form fields)
        if request.content_type.startswith('multipart/form-data'):
            age = request.form.get('age')
            weight = request.form.get('weight')
            height = request.form.get('height')
            gender = request.form.get('gender')
            diet_type = request.form.get('diet_type')
            allergies = request.form.get('allergies')
            health_conditions = request.form.get('health_conditions')
            health_goal = request.form.get('health_goal')
            cuisine = request.form.get('cuisine')
            grocery_image = request.files.get('grocery_image')

            item_list = []
            expiry_dates = {}

            if grocery_image:
                image = Image.open(grocery_image)
                extracted_text = pytesseract.image_to_string(image)

                # Extract grocery items using LLM chain
                items_result = chain_items.invoke(input={"extracted_text": extracted_text})
                try:
                    item_list = ast.literal_eval(items_result)
                except Exception:
                    item_list = []

                # Optional: extract expiry dates (using regex YYYY-MM-DD)
                lines = extracted_text.splitlines()
                for line in lines:
                    match = re.match(r"(.*?)(\d{4}-\d{2}-\d{2})", line)
                    if match:
                        item = match.group(1).strip().lower()
                        date = match.group(2).strip()
                        expiry_dates[item] = date

        else:
            # JSON POST body fallback (as in original version)
            data = request.json
            age = data.get('age')
            weight = data.get('weight')
            height = data.get('height')
            gender = data.get('gender')
            diet_type = data.get('diet_type')
            allergies = data.get('allergies')
            health_conditions = data.get('health_conditions')
            health_goal = data.get('health_goal')
            cuisine = data.get('cuisine')
            item_list = data.get('item_list', [])
            expiry_dates = data.get('expiry_dates', {})

        # Calculate days to expiry
        days_to_expiry = calculate_days_to_expiry(expiry_dates)

        # Generate meal plan from Gemini
        result = chain_meal.invoke(input={
            "age": age,
            "weight": weight,
            "height": height,
            "gender": gender,
            "diet_type": diet_type,
            "allergies": allergies,
            "health_conditions": health_conditions,
            "health_goal": health_goal,
            "cuisine": cuisine,
            "item_list": item_list,
            "days_to_expiry": days_to_expiry
        })

        # Clean and parse JSON output
        cleaned = re.sub(r"^```json|```$", "", result.strip(), flags=re.IGNORECASE).strip("`\n ")
        meal_plan = json.loads(cleaned)

        return jsonify(meal_plan), 200, {'Content-Type': 'application/json'}

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)