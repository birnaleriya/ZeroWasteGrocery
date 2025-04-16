// c:\Users\saksh\Downloads\SmartGrocery (1).jsximport React, { useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";

// const SmartGrocery = () => {
//     const [groceryImage, setGroceryImage] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [expiryDates, setExpiryDates] = useState({});
//     const user = JSON.parse(localStorage.getItem("user"));

//     const handleFileChange = (e) => {
//         setGroceryImage(e.target.files[0]);
//     };

//     const handleExpiryDateChange = (item, date) => {
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: date,
//         }));
//     };

//     const handleExtractItems = async () => {
//         if (!groceryImage) return alert("Please upload a grocery image first.");

//         const data = new FormData();
//         data.append("image", groceryImage);

//         try {
//             const res = await fetch("http://127.0.0.1:5000/extract-items", {
//                 method: "POST",
//                 body: data,
//             });
//             const json = await res.json();
//             setExtractedItems(json.grocery_items || []);
//         } catch (err) {
//             console.error("Error extracting items:", err);
//             setExtractedItems(["Error extracting items"]);
//         }
//     };

//     const handleSaveToFirestore = async () => {
//         if (!user || !user.uid) return alert("User not logged in.");
//         const uid = user.uid;

//         const itemsToSave = Object.entries(expiryDates);

//         try {
//             for (const [itemName, expiryDate] of itemsToSave) {
//                 if (expiryDate) {
//                     await addDoc(collection(db, "users", uid, "expiryItems"), {
//                         name: itemName,
//                         expiryDate,
//                     });
//                 }
//             }
//             alert("Expiry dates saved to Firestore!");
//         } catch (err) {
//             console.error("Error saving to Firestore:", err);
//             alert("Failed to save expiry dates.");
//         }
//     };

//     return (
//         <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
//             {/* Title */}
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
//                 🧾 Smart Grocery List Extractor
//             </h1>

//             {/* Decoration Images Left */}
//             <div className="absolute top-32 left-10 flex flex-col gap-8 z-0">
//                 <img src="/sg1.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
//                 <img src="/sg2.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
//             </div>

//             {/* Decoration Images Right */}
//             <div className="absolute top-32 right-10 flex flex-col gap-8 z-0">
//                 <img src="/sg3.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
//                 <img src="/sg4.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
//             </div>

//             {/* Upload Box */}
//             <div className="relative z-10 max-w-3xl mx-auto bg-gradient-to-br from-rose-50 via-orange-50 to-lime-50 rounded-2xl p-8 shadow-xl backdrop-blur-md">
//                 <h2 className="text-2xl font-semibold text-center mb-6 text-rose-600">
//                     Upload Your Grocery Receipt Image
//                 </h2>

//                 <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="w-full mb-6 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
//                 />

//                 <div className="flex justify-center">
//                     <button
//                         onClick={handleExtractItems}
//                         className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
//                     >
//                         🛒 Extract Items
//                     </button>
//                 </div>
//             </div>

//             {/* Extracted Items */}
//             {extractedItems.length > 0 && (
//                 <div className="mt-12 max-w-5xl mx-auto">
//                     <h3 className="text-3xl font-bold text-center text-rose-700 mb-6">
//                         Extracted Items
//                     </h3>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                         {extractedItems.map((item, idx) => (
//                             <div
//                                 key={idx}
//                                 className="p-4 bg-yellow-100 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md hover:scale-105 transition-transform duration-300"
//                             >
//                                 <h4 className="font-bold text-lg text-gray-900">{item}</h4>
//                                 <label className="block text-sm mt-2 text-gray-600">
//                                     Expiry Date:
//                                     <input
//                                         type="date"
//                                         onChange={(e) => handleExpiryDateChange(item, e.target.value)}
//                                         className="mt-1 block w-full p-1 text-sm border rounded-md focus:ring-rose-400 focus:border-rose-400"
//                                     />
//                                 </label>
//                             </div>
//                         ))}
//                     </div>

//                     <div className="flex justify-center mt-8">
//                         <button
//                             onClick={handleSaveToFirestore}
//                             className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg transition duration-200"
//                         >
//                             💾 Save Expiry Dates
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SmartGrocery;





// {expiringSoon.length > 0 && (
//     <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md">
//       <h4 className="text-lg font-bold mb-2">🕒 Items Expiring Soon</h4>
      
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           const selected = expiringSoon
//             .filter((_, idx) => document.getElementById(`select-${idx}`).checked)
//             .map((item) => item.name);
  
//           // Call your expiry endpoint with selected ingredients
//           fetch("http://127.0.0.1:5000/expiry", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ expiry_items: selected }),
//           })
//             .then((res) => res.json())
//             .then((data) => {
//               console.log("Recipes received:", data);
//               setRecommendedRecipes(data.recipes || []); // update state to show recipes
//             })
            
//             .catch((err) => console.error("Error:", err));
//         }}
//       >
//         {/* <ul className="list-none pl-1 mb-4">
//           {expiringSoon.map((item, idx) => (
//            <li key={idx} className="flex items-center gap-2 mb-2">
//            <input type="checkbox" id={`select-${idx}`} className="form-checkbox h-4 w-4 text-yellow-600" />
//            <label htmlFor={`select-${idx}`}>
//              <strong>{item.name}</strong> expires in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//            </label>
//          </li>
         
//           ))}
//         </ul> */}
//   <ul className="list-none pl-1 mb-4">
// {expiringSoon.map((item, idx) => (
// <li key={idx} className="flex items-center gap-2 mb-2">
// <label htmlFor={`select-${idx}`}>
// <strong>{item.name}</strong> – Expiry: {item.expiryDate}
// </label>
// {item.expired ? (
// <span className="text-red-500 font-bold ml-2">Expired</span>
// ) : (
// <input
// type="checkbox"
// id={`select-${idx}`}
// className="form-checkbox h-4 w-4 text-yellow-600 ml-2"
// />
// )}
// </li>
// ))}
// </ul>

//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
//         >
//           🍽 Get Recipes with Selected Items
//         </button>
//       </form>
//       {recommendedRecipes.length > 0 && (
//     <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
//       <h4 className="text-lg font-semibold mb-2">🍴 Recommended Recipes</h4>
//       <ul className="list-disc pl-5">
//       {recommendedRecipes.map((recipe, idx) => (
//     <li key={idx} className="mb-4">
//       <p className="font-semibold">🥘 {recipe.recipe_name} (⏱ {recipe.time_to_cook} mins)</p>
//       <p><strong>Using:</strong> {recipe.item}</p>
//       <p><strong>Instructions:</strong> {recipe.instructions}</p>
//       <p><strong>Extras:</strong> {recipe.additional_ingredients.join(", ")}</p>
//     </li>
//   ))}
  
//       </ul>
//     </div>
//   )}
  
//     </div>
//   )}


//   {/* Decoration Images Left */}
//   <div className="absolute top-32 left-10 flex flex-col gap-8 z-0">
//       <img src="/sg1.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
//       <img src="/sg2.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
//   </div>

//   {/* Decoration Images Right */}
//   <div className="absolute top-32 right-10 flex flex-col gap-8 z-0">
//       <img src="/sg3.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
//       <img src="/sg4.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
//   </div>

//   {/* Upload Box */}
//   <div className="relative z-10 max-w-3xl mx-auto bg-gradient-to-br from-rose-50 via-orange-50 to-lime-50 rounded-2xl p-8 shadow-xl backdrop-blur-md">
//       <h2 className="text-2xl font-semibold text-center mb-6 text-rose-600">
//           Upload Your Grocery Receipt Image
//       </h2>

//       <input
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//           className="w-full mb-6 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
//       />

//       <div className="flex justify-center">
//           <button
//               onClick={handleExtractItems}
//               className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
//           >
//               🛒 Extract Items
//           </button>
//       </div>
//   </div>
//   <div className="text-center mt-8">
//       <button
//           onClick={startVoiceRecognition}
//           className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//       >
//           🎙️ {listening ? "Listening..." : "Add via Voice"}
//       </button>

//       {recognitionResult && (
//           <p className="mt-2 text-sm text-gray-600 italic">
//               🗣️ Heard: "{recognitionResult}"
//           </p>
//       )}
//   </div>

//   {/* Extracted Items */}
//   {extractedItems.length > 0 && (
//       <div className="mt-12 max-w-5xl mx-auto">
//           <h3 className="text-3xl font-bold text-center text-rose-700 mb-6">
//               Extracted Items
//           </h3>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {extractedItems.map((item, idx) => (
//                   <div
//                       key={idx}
//                       className="p-4 bg-yellow-100 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md hover:scale-105 transition-transform duration-300"
//                   >
//                       <h4 className="font-bold text-lg text-gray-900">{item}</h4>
//                       <label className="block text-sm mt-2 text-gray-600">
//                           Expiry Date:
//                           <input
//                               type="date"
//                               value={expiryDates[item] || ""}
//                               onChange={(e) => handleExpiryDateChange(item, e.target.value)}
//                               className="mt-1 block w-full p-1 text-sm border rounded-md focus:ring-rose-400 focus:border-rose-400"
//                           />
//                       </label>
//                   </div>
//               ))}
//           </div>

//           <div className="flex justify-center mt-8">
//               <button
//                   onClick={handleSaveToFirestore}
//                   className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg transition duration-200"
//               >
//                   💾 Save Expiry Dates
//               </button>
//           </div>
//       </div>
//   )}
  
// </div>
// );
// };
