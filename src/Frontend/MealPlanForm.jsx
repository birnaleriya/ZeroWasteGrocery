

import React, { useState } from "react";

const MealPlanForm = () => {
  const [formData, setFormData] = useState({
    age: 25,
    weight: 60,
    height: 165,
    gender: "female",
    diet_type: "vegetarian",
    allergies: "none",
    health_conditions: "none",
    health_goal: "weight loss",
    preferred_cuisine: "Indian",
  });
  const [groceryImage, setGroceryImage] = useState(null);
  const [result, setResult] = useState(null);
  const [extractedItems, setExtractedItems] = useState([]);
  const [expiryDates, setExpiryDates] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setGroceryImage(e.target.files[0]);
  };

  const handleExpiryDateChange = (item, date) => {
    setExpiryDates((prev) => ({
      ...prev,
      [item]: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (groceryImage) {
      data.append("grocery_image", groceryImage);
    }

    // Adding extracted items and expiry dates
    data.append("item_list", JSON.stringify(extractedItems));
    data.append("expiry_dates", JSON.stringify(expiryDates));

    try {
      const res = await fetch("http://127.0.0.1:5000/generate-meal-plan", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      console.error("Error:", err);
      setResult({ error: "Something went wrong." });
    }
  };

  const handleExtractItems = async () => {
    if (!groceryImage) return alert("Please upload a grocery image first.");

    const data = new FormData();
    data.append("image", groceryImage);

    try {
      const res = await fetch("http://127.0.0.1:5000/extract-items", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setExtractedItems(json.grocery_items || []);
    } catch (err) {
      console.error("Error extracting items:", err);
      setExtractedItems(["Error extracting items"]);
    }
  };

  return (
    <div className="p-6 bg-black ">
      
<h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 
  drop-shadow-[2px_2px_0px_rgba(255,255,255,0.3)] 
  shadow-2xl 
  transform transition-transform duration-500 ease-in-out hover:scale-105 hover:rotate-1 animate-fadeUp">
  🍽️ Generate Your Perfect Meal Plan
</h1>

  <div className="flex flex-col md:flex-row gap-6">
  {/* Left - Vertical Image Stack filling full height */}
  <div className="w-full md:w-1/2 p-6 flex flex-col h-full">
  <div className="flex flex-col h-full">
    <img
      src="/food1.png"
      alt="Dish 2"
      className="object-cover w-full h-1/2 rounded-xl shadow-xl z-10 -mt-10"
    />
    <img
      src="/fly.png"
      alt="Dish 3"
      className="object-cover w-full h-1/2 rounded-xl shadow-md -mt-36 z-0"
    />
    
  </div>
</div>





    {/* Right - Form */}
    <div className="w-full md:w-1/2 p-6 rounded-xl shadow-lg bg-gradient-to-br from-rose-50 via-orange-50 to-lime-50 backdrop-blur-md animate-fadeUp">
  <form
    onSubmit={handleSubmit}
    encType="multipart/form-data"
    className="space-y-5"
  >
    <h2 className="text-2xl font-bold text-center mb-4 font-pacifico text-rose-600">
     Personalize Your Meal Plan
    </h2>

    {[
      { label: "Age", name: "age", type: "number" },
      { label: "Weight (kg)", name: "weight", type: "number" },
      { label: "Height (cm)", name: "height", type: "number" },
      { label: "Allergies", name: "allergies" },
      { label: "Health Conditions", name: "health_conditions" },
      { label: "Health Goal", name: "health_goal" },
      { label: "Preferred Cuisine", name: "preferred_cuisine" },
    ].map(({ label, name, type = "text" }) => (
      <label key={name} className="block text-md font-medium text-black">
        {label}:
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          required
          className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:ring-rose-400 focus:border-rose-400"
        />
      </label>
    ))}

    <label className="block text-sm font-medium text-gray-700">
      Gender:
      <select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:ring-rose-400 focus:border-rose-400"
      >
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>
    </label>

    <label className="block text-sm font-medium text-gray-700">
      Diet Type:
      <select
        name="diet_type"
        value={formData.diet_type}
        onChange={handleChange}
        className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:ring-rose-400 focus:border-rose-400"
      >
        <option value="vegetarian">Vegetarian</option>
        <option value="vegan">Vegan</option>
        <option value="non-vegetarian">Non-Vegetarian</option>
      </select>
    </label>

    <label className="block text-sm font-medium text-gray-700">
      Upload Grocery List Image:
      <input
        type="file"
        name="grocery_image"
        accept="image/*"
        onChange={handleFileChange}
        required
        className="mt-2 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
      />
    </label>

    <div className="flex justify-between mt-4 gap-4">
      <button
        type="submit"
        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
      >
        🍽️ Generate Meal Plan
      </button>
      <button
        type="button"
        onClick={handleExtractItems}
        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
      >
        🛒 Extract Items
      </button>
    </div>
  </form>
</div>

  </div>

  {extractedItems.length > 0 && (
  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-4">Extracted Items:</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {extractedItems.map((item, idx) => (
        <div key={idx} className="p-4 bg-yellow-200 rounded shadow-md">
          <span className="block font-medium">{item}</span>
          <input
            type="date"
            defaultValue="2025-12-31"
            onChange={(e) => handleExpiryDateChange(item, e.target.value)}
            className="mt-2 p-1 text-sm w-full border rounded"
          />
        </div>
      ))}
    </div>
  </div>
)}


  {/* Meal Plan Cards */}
  {result && (
  <div className="mt-10 space-y-10">
    <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400">
      Your Meal Plan
    </h3>

    {Object.entries(result).map(([day, meals], idx) => (
      <div
        key={idx}
        className="p-6 rounded-2xl shadow-xl bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 border border-white/30"
      >
        <h4 className="text-2xl font-bold mb-6 capitalize text-gray-900 drop-shadow">
          {day}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(meals).map(([mealTime, mealInfo], i) => {
            const gradients = [
              "from-pink-400 to-red-400",
              "from-blue-400 to-purple-500",
              "from-green-300 to-lime-400",
              "from-yellow-300 to-orange-400",
              "from-cyan-400 to-teal-500",
              "from-indigo-400 to-fuchsia-500",
              "from-rose-400 to-pink-500",
              "from-amber-300 to-orange-500",
            ];
            const gradientClass = gradients[i % gradients.length];

            return (
              <div
                key={i}
                className={`relative p-5 rounded-xl border border-white/20 shadow-md backdrop-blur-md transition-transform transform hover:scale-105 bg-gradient-to-br ${gradientClass} text-black`}
                style={{
                  boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/80 animate-ping"></div>
                <h5 className=" font-bold font-handwritten text-3xl capitalize">{mealTime}</h5>
                <p className="text-lg font-bold mt-2 font-serif">{mealInfo.recipe_name}</p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">{mealInfo.instructions}</p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
)}


</div>

  );
};

export default MealPlanForm;
