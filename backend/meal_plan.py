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





import traceback
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


# update prompt_template_meal: ❗

# prompt_template_waste_analysis = PromptTemplate(
#     input_variables=["wasted_items"],
#     template="""
# You are a smart grocery advisor.

# The following grocery items were **wasted** by the user over the last week: {wasted_items}

# Suggest simple, actionable, and weekly-purchasing changes to reduce this waste in the future. For each item, suggest:
# - A frequency to buy (e.g., "Buy only 1 cucumber per week")
# - Storage or usage tips
# - Optional recipe suggestions to use it before expiry

# Make sure the suggestions are practical and user-friendly.
# Return the output as a list of suggestions like:
# [
#   "Buy only 2 cucumbers per week. Tip: Use them in sandwiches. Store in paper towel inside fridge.",
#   ...
# ]
# Avoid unnecessary explanations. Do not use markdown or extra symbols.
# """
# )

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
#     4. Double-check your responses before finalizing the meal plan.
#     5. For each meal (breakfast, lunch, snacks, dinner), provide both the recipe name and the **detailed step-by-step cooking instructions**.
#     6. Output the plan in JSON format with days (monday, tuesday, wednesday, etc.) as keys and each day containing 4 meals (breakfast, lunch, snacks, dinner). For each meal, include:
#        - "recipe_name": (name of the dish)
#        - "instructions": (step-by-step preparation instructions)
#     7. Make sure that the response does not contain any preamble. Return JSON text only, no markdown formatting, no triple backticks, no explanations.
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
    5. For each meal (breakfast, lunch, snacks, dinner), provide both the recipe name and the detailed step-by-step cooking instructions.
    6. Output the plan in JSON format with days (monday, tuesday, wednesday, etc.) as keys and each day containing 4 meals (breakfast, lunch, snacks, dinner). For each meal, include:
       - "recipe_name": (name of the dish)
       - "instructions": (step-by-step preparation instructions in detail)
       - "how_it_helps": (how the meal helps my dietary preferences, health conditions and goals)
       - "calories": (total calories along with how many calories each item contributes per serve)
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
prompt_template_waste_analysis = PromptTemplate(
    input_variables=["wasted_items"],
    template="""
You are a smart grocery assistant.

The following grocery items were wasted last week: {wasted_items}

For each item, provide the following details:

- **Smart shopping tips**: Provide advice on how to purchase the item better in the future, considering its product life, spoilage rate, and typical usage. (e.g., "Buy smaller packs of cucumbers as they last only a few days after purchase" or "Opt for fresh tomatoes that are used quickly, as they spoil within a week.")

- **Storage tips**: Offer detailed, item-specific storage guidance to help extend the item's shelf life and prevent spoilage. (e.g., "Wrap cucumbers in damp paper towels and store them in the fridge" or "Store tomatoes at room temperature for best flavor.")

- **Creative recipes**: Suggest practical and creative ways to use the item before it spoils, including recipes or meal ideas. For example, how to incorporate stale bread or overripe bananas into meals.

- **Extended shelf-life advice**: Provide alternative methods to keep the item fresh for a longer time (e.g., freezing, pickling, or using other preservation techniques).

Respond with a list like:
[
  "For cucumbers: \nSmart shopping tip: Cucumbers have a short shelf life, typically lasting only 3-5 days in the fridge. Buying in smaller quantities will prevent them from spoiling too quickly. \nStorage tip: Wrap cucumbers in damp paper towels and keep them in the fridge’s crisper drawer to maintain moisture. \nCreative recipe: Use cucumbers in a cucumber yogurt dip or make a refreshing cucumber salad. \nExtended shelf-life advice: Pickle cucumbers for long-term storage and use later in sandwiches or as a snack.",
  
  "For tomatoes: \nSmart shopping tip: Tomatoes ripen quickly and can spoil within a week. Buy only as many as you can use in 3-4 days, especially if you're using them fresh. \nStorage tip: Store tomatoes at room temperature away from sunlight for best flavor and to avoid spoilage. \nCreative recipe: Use overripe tomatoes in a fresh tomato sauce, tomato soup, or blend into salsa. \nExtended shelf-life advice: Freeze chopped tomatoes to use in soups or stews later.",
  
  "For bread: \nSmart shopping tip: Bread can go stale or moldy within 5-7 days, so it's better to buy smaller loaves or what you can consume in a few days. \nStorage tip: Store bread in a bread box or paper bag to keep it fresh for up to 4 days. \nCreative recipe: Use stale bread to make croutons, bread pudding, or French toast. \nExtended shelf-life advice: Freeze slices and toast as needed, reducing waste.",
  
  "For bananas: \nSmart shopping tip: Bananas ripen quickly, often within 3-5 days, so buying them when they're slightly underripe can help them last longer. \nStorage tip: Keep bananas at room temperature, away from other fruits, to avoid quick ripening. \nCreative recipe: Use overripe bananas in smoothies, banana bread, or freeze them for banana ice cream. \nExtended shelf-life advice: Freeze ripe bananas to use in smoothies or as a dessert ingredient later.",
  
  "For lettuce: \nSmart shopping tip: Lettuce can wilt and spoil in just a few days, so buy only what you will use within a few days of purchase. \nStorage tip: Store lettuce in a salad spinner or airtight container with a paper towel to absorb moisture and extend freshness. \nCreative recipe: Use lettuce in salads, wraps, or sauté it as a side dish with garlic and olive oil. \nExtended shelf-life advice: Refrigerate in an airtight container with a damp towel to extend freshness."
]

Make the suggestions practical, actionable, and easy to follow. Avoid markdown, bullet points, or unnecessary explanations.
"""
)


# Create chains
chain_items = prompt_template_items | gemini | StrOutputParser()
chain_meal = prompt_template_meal | gemini | StrOutputParser()
chain_recipe = prompt_template_recipe | gemini | StrOutputParser()
chain_waste_analysis = prompt_template_waste_analysis | gemini | StrOutputParser()

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
        
 # Add this at the top

# @app.route("/analyze-waste", methods=["POST"])
# def analyze_waste():
#     try:
#         data = request.json
#         wasted_items = data.get("wasted_items", [])

#         if not wasted_items:
#             return jsonify({"error": "No wasted items provided."}), 400

#         item_str = ", ".join(wasted_items)
#         result = chain_waste_analysis.invoke({"wasted_items": item_str})

#         print("🧠 Raw AI Output:", result)

#         try:
#             # Attempt to parse as list
#             suggestions = ast.literal_eval(result)
#             if not isinstance(suggestions, list):
#                 raise ValueError("Output is not a list")
#         except Exception as eval_err:
#             print("⚠️ literal_eval failed:", eval_err)
#             print("Fallback to splitting string output by lines.")
#             suggestions = [line.strip("- ").strip() for line in result.strip().split("\n") if line.strip()]

#         return jsonify({"suggestions": suggestions})

#     except Exception as e:
#         print("🔥 Exception in /analyze-waste route:", e)
#         traceback.print_exc()
#         return jsonify({"error": str(e)}), 500
# Create a Blueprint for waste analysis routes

prompt_template_voice = PromptTemplate(
    input_variables=["user_query"],
    template="""
You are Zero, a smart kitchen and zero-waste assistant.

The user asked: "{user_query}"

Respond in a friendly tone with plain text. 
Do not use any special characters, markdown (*, **, #, etc.), emojis, or HTML. 
Keep the formatting natural for reading aloud. 
Structure the response in short, clear sentences. Avoid long paragraphs.
Start the answer directly without greetings.

Example: 
Instead of "Here's a recipe: *Banana Bread*...", just say "You can make banana bread. Mash bananas with flour..."

Now respond to the user's question.
"""
)

chain_voice = prompt_template_voice| gemini | StrOutputParser()
@app.route('/gemini-voice', methods=['POST'])
def handle_voice_query():
    try:
        data = request.get_json()
        user_query = data.get("prompt", "")

        if not user_query:
            return jsonify({"error": "Missing prompt"}), 400

        # Run the Gemini chain
        result = chain_voice.invoke({"user_query": user_query})
        return jsonify({"reply": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# @app.route('/analyze_waste', methods=['POST'])
# def analyze_waste():
#     try:
#         data = request.json
#         wasted_items = data.get('wasted_items', [])
        
#         if not wasted_items:
#             return jsonify({"error": "No wasted items provided"}), 400
            
#         # Join the wasted items into a comma-separated string
#         wasted_items_str = ", ".join(wasted_items)
        
#         # Initialize Gemini model
        
#         # Create the prompt template
#         prompt_template_waste_analysis = PromptTemplate(
#             input_variables=["wasted_items"],
#             template="""
# You are a smart grocery assistant.

# The following grocery items were wasted last week: {wasted_items}

# For each item, provide the following details:

# - **Smart shopping tips**: Provide advice on how to purchase the item better in the future, considering its product life, spoilage rate, and typical usage. (e.g., "Buy smaller packs of cucumbers as they last only a few days after purchase" or "Opt for fresh tomatoes that are used quickly, as they spoil within a week.")

# - **Storage tips**: Offer detailed, item-specific storage guidance to help extend the item's shelf life and prevent spoilage. (e.g., "Wrap cucumbers in damp paper towels and store them in the fridge" or "Store tomatoes at room temperature for best flavor.")

# - **Creative recipes**: Suggest practical and creative ways to use the item before it spoils, including recipes or meal ideas. For example, how to incorporate stale bread or overripe bananas into meals.

# - **Extended shelf-life advice**: Provide alternative methods to keep the item fresh for a longer time (e.g., freezing, pickling, or using other preservation techniques).

# Respond with a list like:
# [
#   "For cucumbers: \nSmart shopping tip: Cucumbers have a short shelf life, typically lasting only 3-5 days in the fridge. Buying in smaller quantities will prevent them from spoiling too quickly. \nStorage tip: Wrap cucumbers in damp paper towels and keep them in the fridge’s crisper drawer to maintain moisture. \nCreative recipe: Use cucumbers in a cucumber yogurt dip or make a refreshing cucumber salad. \nExtended shelf-life advice: Pickle cucumbers for long-term storage and use later in sandwiches or as a snack.",
  
#   "For tomatoes: \nSmart shopping tip: Tomatoes ripen quickly and can spoil within a week. Buy only as many as you can use in 3-4 days, especially if you're using them fresh. \nStorage tip: Store tomatoes at room temperature away from sunlight for best flavor and to avoid spoilage. \nCreative recipe: Use overripe tomatoes in a fresh tomato sauce, tomato soup, or blend into salsa. \nExtended shelf-life advice: Freeze chopped tomatoes to use in soups or stews later.",
  
#   "For bread: \nSmart shopping tip: Bread can go stale or moldy within 5-7 days, so it's better to buy smaller loaves or what you can consume in a few days. \nStorage tip: Store bread in a bread box or paper bag to keep it fresh for up to 4 days. \nCreative recipe: Use stale bread to make croutons, bread pudding, or French toast. \nExtended shelf-life advice: Freeze slices and toast as needed, reducing waste.",
  
#   "For bananas: \nSmart shopping tip: Bananas ripen quickly, often within 3-5 days, so buying them when they're slightly underripe can help them last longer. \nStorage tip: Keep bananas at room temperature, away from other fruits, to avoid quick ripening. \nCreative recipe: Use overripe bananas in smoothies, banana bread, or freeze them for banana ice cream. \nExtended shelf-life advice: Freeze ripe bananas to use in smoothies or as a dessert ingredient later.",
  
#   "For lettuce: \nSmart shopping tip: Lettuce can wilt and spoil in just a few days, so buy only what you will use within a few days of purchase. \nStorage tip: Store lettuce in a salad spinner or airtight container with a paper towel to absorb moisture and extend freshness. \nCreative recipe: Use lettuce in salads, wraps, or sauté it as a side dish with garlic and olive oil. \nExtended shelf-life advice: Refrigerate in an airtight container with a damp towel to extend freshness."
# ]

# Make the suggestions practical, actionable, and easy to follow. Avoid markdown, bullet points, or unnecessary explanations.
# """
#         )
        
#         # Create and run the chain
#         chain_waste_analysis = prompt_template_waste_analysis | gemini | StrOutputParser()
#         response = chain_waste_analysis.invoke({"wasted_items": wasted_items_str})
        
#         # Parse the response into a list (assuming response is properly formatted)
#         suggestions = [item.strip() for item in response.strip('[]').split('",') if item.strip()]
#         suggestions = [suggestion.strip(' "') for suggestion in suggestions]
        
#         return jsonify({
#             "suggestions": suggestions,
#             "raw_response": response
#         })
    
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
@app.route('/analyze_waste', methods=['POST'])
def analyze_waste():
    try:
        data = request.json
        wasted_items = data.get('wasted_items', [])

        if not wasted_items:
            return jsonify({"error": "No wasted items provided"}), 400

        wasted_items_str = ", ".join(wasted_items)

        # Updated prompt template for JSON response
        prompt_template_waste_analysis = PromptTemplate(
            input_variables=["wasted_items"],
            template="""
You are a smart grocery assistant.

The following grocery items were wasted last week: {wasted_items}

For each item, respond with a JSON object containing the following keys:
- "item"
- "smart_shopping_tip"
- "storage_tip"
- "creative_recipe"
- "extended_shelf_life_advice"

Return a JSON array of such objects.

Example format:
[
  {{
    "item": "cucumbers",
    "smart_shopping_tip": "Buy smaller packs of cucumbers as they last only a few days after purchase.",
    "storage_tip": "Wrap cucumbers in damp paper towels and store them in the fridge’s crisper drawer.",
    "creative_recipe": "Make a cucumber yogurt dip or refreshing cucumber salad.",
    "extended_shelf_life_advice": "Pickle cucumbers to store them for longer."
  }}
]

Respond with valid JSON only. Do not include any explanation, markdown, or additional text.
"""
        )

        # Chain execution
        chain_waste_analysis = prompt_template_waste_analysis | gemini | StrOutputParser()
        response = chain_waste_analysis.invoke({"wasted_items": wasted_items_str})

        try:
            suggestions = json.loads(response)
        except json.JSONDecodeError:
            return jsonify({"error": "Failed to parse JSON from model response", "raw_response": response}), 500

        return jsonify({
            "suggestions": suggestions,
            "raw_response": response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
from flask import request, jsonify
import json
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableSequence

@app.route('/expiry', methods=['POST'])
def handle_expiry():
    try:
        data = request.get_json()

        if not data or 'expiry_items' not in data:
            return jsonify({"error": "Missing 'expiry_items' in request"}), 400

        expiry_items = data['expiry_items']
        expiry_items_str = ", ".join(expiry_items)

        # Updated Prompt Template
        prompt_template_expiry = PromptTemplate(
            input_variables=["expiry_items"],
            template="""
You are a smart kitchen assistant.

The following items are about to expire: {expiry_items}

For each item, generate:
- A creative, simple recipe idea using the item.
- Detailed cooking instructions (around 5–6 lines).
- Additional ingredients commonly found at home to combine with it.
- Estimated time to cook (as an integer, in minutes).

Respond strictly in the following JSON format:
[
  {{
    "item": "Bananas",
    "recipe_name": "Banana Pancakes",
    "instructions": "Mash 2 ripe bananas in a bowl. Add 2 eggs, a pinch of cinnamon, and mix well. Heat a non-stick pan over medium heat and pour small amounts of batter to form pancakes. Cook each side for 2–3 minutes until golden. Serve with honey or maple syrup.",
    "additional_ingredients": ["Eggs", "Cinnamon", "Honey"],
    "time_to_cook": 10
  }},
  {{
    "item": "Bread",
    "recipe_name": "Garlic Croutons",
    "instructions": "Cut stale bread into cubes. Toss with olive oil, minced garlic, and a pinch of salt. Spread on a baking sheet and toast at 180°C for 10–12 minutes until golden and crispy, turning halfway. Let cool and store in an airtight container.",
    "additional_ingredients": ["Olive Oil", "Garlic", "Salt"],
    "time_to_cook": 15
  }}
]
"""
        )

        # Invoke Gemini Chain
        chain_expiry = prompt_template_expiry | gemini | StrOutputParser()
        raw_response = chain_expiry.invoke({"expiry_items": expiry_items_str})

        # Parse strict JSON
        recipes_json = json.loads(raw_response)

        return jsonify({
            "recipes": recipes_json,
            "raw_response": raw_response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500



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