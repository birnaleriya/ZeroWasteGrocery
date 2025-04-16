

import React, { useState } from "react";
import Lottie from "lottie-react";

import html2canvas from "html2canvas";
import html2pdf from 'html2pdf.js';
import jsPDF from "jspdf";
import mealAnimation from "../assets/Meal.json";
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
  const [selectedItems, setSelectedItems] = useState({});

  const [groceryImage, setGroceryImage] = useState(null);
  const [result, setResult] = useState(null);
  const [extractedItems, setExtractedItems] = useState([]);
  const [expiryDates, setExpiryDates] = useState({});
  const [loading, setLoading] = useState(false);
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
  const toggleItemSelection = (item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
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
    const selectedList = extractedItems.filter((item) => selectedItems[item]);
    data.append("item_list", JSON.stringify(selectedList));
    
    data.append("expiry_dates", JSON.stringify(expiryDates));

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/generate-meal-plan", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      setResult(json);
      setLoading(false);
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
  // const downloadPDF = () => {
  //   const element = document.getElementById("meal-plan-section");
  //   if (!element) return;
  
  //   // Temporarily force full height to capture all content
  //   element.style.height = "auto";
  //   element.style.maxHeight = "none";
  //   element.style.overflow = "visible";
  
  //   setTimeout(() => {
  //     html2pdf()
  //       .from(element)
  //       .set({
  //         margin: 0.5,
  //         filename: "meal_plan.pdf",
  //         image: { type: "jpeg", quality: 1 },
  //         html2canvas: {
  //           scale: 3, // higher scale = better quality
  //           useCORS: true,
  //           scrollY: 0, // ensures off-screen content is captured
  //         },
  //         jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  //       })
  //       .save();
  //   }, 700); // wait for UI to fully render
  // };
  
//   const downloadPDF = () => {
//     const original = document.getElementById("meal-plan-section");
//     if (!original) return;
  
//     const clone = original.cloneNode(true);
//     clone.id = "meal-plan-pdf";
  
//     // Adjust styles to prevent cut-off and preserve original look
//     // clone.style.transform = "scale(0.60)";
//     clone.style.transform = "scale(0.80)";
// clone.style.padding = "1in";

//     clone.style.transformOrigin = "top center"; // Align scaling from the horizontal center
// clone.style.margin = "0 auto"; // Center the block horizontally
// clone.style.width = "fit-content"; // Avoid overflow due to width

//     // clone.style.width = "133.33%"; // Compensate for 0.75 scale
//     // clone.style.padding = "20px";
//     clone.style.background = "white";
//     clone.style.boxSizing = "border-box";
  
//     const wrapper = document.createElement("div");
// wrapper.style.position = "fixed";
// wrapper.style.top = "-9999px";
// wrapper.style.left = "-9999px";
// wrapper.style.width = "1122px"; // A4 landscape width in pixels at 96 DPI
// wrapper.style.height = "793px"; // A4 landscape height in pixels at 96 DPI
// wrapper.style.display = "flex";
// wrapper.style.alignItems = "center"; // Vertically center
// wrapper.style.justifyContent = "center"; // (optional) horizontally center too
// wrapper.style.background = "white";

// wrapper.appendChild(clone);
// document.body.appendChild(wrapper);

//     setTimeout(() => {
//       html2pdf()
//         .from(clone)
//         .set({
//           margin: 0,
//           filename: "meal_plan.pdf",
//           image: { type: "jpeg", quality: 1 },
//           html2canvas: {
//             scale: 3,
//             useCORS: true,
//           },
//           jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
//         })
//         .save()
//         .then(() => {
//           document.body.removeChild(wrapper);
//         });
//     }, 500);
//   };
// const downloadPDF = () => {
//   const original = document.getElementById("meal-plan-section");
//   if (!original) return;

//   const clone = original.cloneNode(true);
//   clone.id = "meal-plan-pdf";

//   // Style clone
//   clone.style.transform = "scale(0.80)";
//   clone.style.transformOrigin = "top center";
//   clone.style.margin = "0 auto";
//   clone.style.width = "fit-content";
//   clone.style.padding = "0.5in";
//   clone.style.background = "white";
//   clone.style.boxSizing = "border-box";

//   // Wrapper for centering and preventing overflow
//   const wrapper = document.createElement("div");
//   wrapper.style.position = "fixed";
//   wrapper.style.top = "-9999px";
//   wrapper.style.left = "-9999px";
//   wrapper.style.width = "1122px"; // A4 landscape width (96 DPI)
//   wrapper.style.height = "793px";  // A4 landscape height
//   wrapper.style.display = "flex";
//   wrapper.style.alignItems = "center"; // vertical centering
//   wrapper.style.justifyContent = "center";
//   wrapper.style.overflow = "hidden";  // prevent overflow causing blank pages
//   wrapper.style.background = "white";

//   wrapper.appendChild(clone);
//   document.body.appendChild(wrapper);

//   setTimeout(() => {
//     html2pdf()
//       .from(clone)
//       .set({
//         margin: 0,
//         filename: "meal_plan.pdf",
//         image: { type: "jpeg", quality: 1 },
//         html2canvas: {
//           scale: 3,
//           useCORS: true,
//           scrollY: 0,
//         },
//         jsPDF: { unit: "in", format: "a4", orientation: "landscape" },
//       })
//       .save()
//       .then(() => {
//         document.body.removeChild(wrapper);
//       });
//   }, 500);
// };
const downloadPDF = () => {
  if (!result || Object.keys(result).length === 0) {
    alert("No meal plan to download!");
    return;
  }

  try {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(88, 0, 160); // Purple
    doc.text("Your Smart Meal Plan", 105, yPos, { align: "center" });
    yPos += 15;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, yPos, { align: "center" });
    yPos += 15;

    Object.entries(result).forEach(([day, meals], idx) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Day Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`${day.charAt(0).toUpperCase() + day.slice(1)}`, 20, yPos);
      yPos += 10;

      Object.entries(meals).forEach(([mealTime, mealInfo]) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        // Meal Time
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(50, 50, 150);
        doc.text(`${mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}`, 25, yPos);
        yPos += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        const wrap = (label, text) => {
          const wrapped = doc.splitTextToSize(`${label} ${text}`, 160);
          doc.text(wrapped, 30, yPos);
          yPos += wrapped.length * 6 + 2;
        };

        wrap("Recipe:", mealInfo.recipe_name);
        wrap("Instructions:", mealInfo.instructions);
        wrap("How it helps:", mealInfo.how_it_helps);
        wrap("Calories:", mealInfo.calories);

        yPos += 5;
      });

      yPos += 10;
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Generated by Smart Grocery App", 105, 285, { align: "center" });

    doc.save("smart-meal-plan.pdf");
  } catch (error) {
    console.error("Error generating meal plan PDF:", error);
    alert("Failed to generate meal plan PDF. Please try again.");
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
    <div className="w-full md:w-1/2 p-6 rounded-xl shadow-lg bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 border-2 border-amber-300 shadow-[0_0_20px_3px_rgba(251,191,36,0.5)] animate-fadeUp">

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

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-3">
  {extractedItems.map((item, idx) => (
    <div key={idx} className="p-4 bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-300 rounded-lg shadow">
      <label className="flex items-start space-x-2">
        <input
          type="checkbox"
          checked={!!selectedItems[item]}
          onChange={() => toggleItemSelection(item)}
          className="mt-1"
        />
        <div className="flex-1">
          <span className="block font-medium text-black">{item}</span>
          <input
            type="date"
            defaultValue="2025-12-31"
            onChange={(e) => handleExpiryDateChange(item, e.target.value)}
            className="mt-2 p-1 text-sm w-full border border-gray-300 rounded"
          />
        </div>
      </label>
    </div>
  ))}
</div>




  {/* Meal Plan Cards */}
  {/* {result && (
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
)} */}
{/* {result && (
  <div id="meal-plan-section" className="mt-10 space-y-10">
    <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 ">
      Your Meal Plan
    </h3>

    {Object.entries(result).map(([day, meals], idx) => (
      <div
        key={idx}
        className="pdf-page break-avoid p-6 rounded-2xl shadow-xl bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 border border-white/30 "
      >
        <h4 className="text-2xl font-bold mb-6 capitalize text-gray-900 drop-shadow">
          {day}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print-page">
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
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/80 animate-ping"></div>
                <h5 className=" font-bold font-handwritten text-3xl capitalize">
                  {mealTime}
                </h5>
                <p className="text-lg font-bold mt-2 font-serif">
                  {mealInfo.recipe_name}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.instructions}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.how_it_helps}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.calories}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
     <div className="page-break"></div>
  </div>
)} */}
{loading ? (
   <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
   <div className="w-72 h-72 rounded-full shadow-2xl animate-pulse bg-gradient-to-br from-pink-400 via-purple-300 to-yellow-300 p-2">
     <Lottie
       animationData={mealAnimation}
       loop={true}
       className="w-full h-full rounded-full"
     />
   </div>
   <p className="mt-6 text-2xl font-bold text-pink-600 animate-bounce">
     Generating your meal plan...
   </p>
 </div>

) : result && (
  <div id="meal-plan-section" className="mt-10 space-y-10">
    <h3 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 ">
      Your Meal Plan
    </h3>

    {Object.entries(result).map(([day, meals], idx) => (
      <div
        key={idx}
        className="pdf-page break-avoid p-6 rounded-2xl shadow-xl bg-gradient-to-r from-purple-300 via-pink-200 to-yellow-200 border border-white/30 "
      >
        <h4 className="text-2xl font-bold mb-6 capitalize text-gray-900 drop-shadow">
          {day}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print-page">
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
                  boxShadow:
                    "0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white/80 animate-ping"></div>
                <h5 className=" font-bold font-handwritten text-3xl capitalize">
                  {mealTime}
                </h5>
                <p className="text-lg font-bold mt-2 font-serif">
                  {mealInfo.recipe_name}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.instructions}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.how_it_helps}
                </p>
                <p className="text-lg mt-2 whitespace-pre-line font-comfortaa">
                  {mealInfo.calories}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
    <div className="page-break"></div>
  </div>
)}

{result && (
  <div className="flex justify-center mt-8">

     <button onClick={downloadPDF}

      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg text-lg transition-transform transform hover:scale-105">
   
      📄 Download Meal Plan as PDF
    </button>
  </div>
)}


</div>

  );
};

export default MealPlanForm;
