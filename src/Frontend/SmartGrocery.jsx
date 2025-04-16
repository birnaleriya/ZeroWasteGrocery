// import React, { useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import { useEffect } from "react";
// import {  query, onSnapshot } from "firebase/firestore";


// const SmartGrocery = () => {
//     const [groceryImage, setGroceryImage] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [expiryDates, setExpiryDates] = useState({});
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [expiringSoon, setExpiringSoon] = useState([]);
//     const [recommendedRecipes, setRecommendedRecipes] = useState([]);

//     const handleFileChange = (e) => {
//         setGroceryImage(e.target.files[0]);
//     };

//     const handleExpiryDateChange = (item, date) => {
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: date,
//         }));
//     };

//     // const handleExtractItems = async () => {
//     //     if (!groceryImage) return alert("Please upload a grocery image first.");

//     //     const data = new FormData();
//     //     data.append("image", groceryImage);

//     //     try {
//     //         const res = await fetch("http://127.0.0.1:5000/extract-items", {
//     //             method: "POST",
//     //             body: data,
//     //         });
//     //         const json = await res.json();
//     //         setExtractedItems(json.grocery_items || []);
//     //     } catch (err) {
//     //         console.error("Error extracting items:", err);
//     //         setExtractedItems(["Error extracting items"]);
//     //     }
//     // };
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
//             const items = json.grocery_items || [];
//             setExtractedItems(items);
    
//             // Set default expiry to 1 month from now
//             const defaultExpiryDates = {};
//             const today = new Date();
//             const oneMonthLater = new Date(today.setMonth(today.getMonth() + 1));
    
//             items.forEach((item) => {
//                 // Clone new date for each to avoid reference issues
//                 const newExpiry = new Date();
//                 newExpiry.setMonth(newExpiry.getMonth() + 1);
//                 defaultExpiryDates[item] = newExpiry.toISOString().split("T")[0];
//             });
    
//             setExpiryDates(defaultExpiryDates);
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
    
//     // useEffect(() => {
//     //     const today = new Date();
//     //     const soon = [];
    
//     //     Object.entries(expiryDates).forEach(([item, dateStr]) => {
//     //         if (dateStr) {
//     //             const expiry = new Date(dateStr);
//     //             const diffTime = expiry.getTime() - today.getTime();
//     //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     //             if (diffDays <= 7 && diffDays >= 0) {
//     //                 soon.push({ item, daysLeft: diffDays });
//     //             }
//     //         }
//     //     });
    
//     //     setExpiringSoon(soon);
//     // }, [expiryDates]);
//     useEffect(() => {
//         if (!user || !user.uid) return;
    
//         const q = query(collection(db, "users", user.uid, "expiryItems"));
    
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const today = new Date();
//             const soonItems = [];
    
//             snapshot.forEach((doc) => {
//                 const data = doc.data();
//                 const expiryDate = new Date(data.expiryDate);
    
//                 const diffTime = expiryDate.getTime() - today.getTime();
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//                 if (diffDays <= 7 && diffDays >= 0) {
//                     soonItems.push({
//                         name: data.name,
//                         daysLeft: diffDays,
//                     });
//                 }
//             });
    
//             setExpiringSoon(soonItems);
//         });
    
//         return () => unsubscribe();
//     }, [user]);
    
//     return (
//         <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
//             {/* Title */}
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
//                 🧾 Smart Grocery List Extractor
//             </h1>
//             {/* {expiringSoon.length > 0 && (
//     <div className="max-w-2xl mx-auto mt-6 bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg shadow mb-4">
//         <h4 className="text-lg font-semibold mb-2">⚠️ Items Expiring Soon</h4>
//         <ul className="list-disc pl-5">
//             {expiringSoon.map((item, index) => (
//                 <li key={index}>
//                     <strong>{item.item}</strong> will expire in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//                 </li>
//             ))}
//         </ul>
//     </div>
// )} */}
// {expiringSoon.length > 0 && (
//   <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md">
//     <h4 className="text-lg font-bold mb-2">🕒 Items Expiring Soon</h4>
    
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         const selected = expiringSoon
//           .filter((_, idx) => document.getElementById(`select-${idx}`).checked)
//           .map((item) => item.name);

//         // Call your expiry endpoint with selected ingredients
//         fetch("http://127.0.0.1:5000/expiry", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ expiry_items: selected }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log("Recipes received:", data);
//             setRecommendedRecipes(data.recipes || []); // update state to show recipes
//           })
          
//           .catch((err) => console.error("Error:", err));
//       }}
//     >
//       <ul className="list-none pl-1 mb-4">
//         {expiringSoon.map((item, idx) => (
//           <li key={idx} className="flex items-center gap-2 mb-2">
//             <input
//               type="checkbox"
//               id={`select-${idx}`}
//               className="form-checkbox h-4 w-4 text-yellow-600"
//             />
//             <label htmlFor={`select-${idx}`}>
//               <strong>{item.name}</strong> expires in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//             </label>
//           </li>
//         ))}
//       </ul>

//       <button
//         type="submit"
//         className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
//       >
//         🍽 Get Recipes with Selected Items
//       </button>
//     </form>
//     {recommendedRecipes.length > 0 && (
//   <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
//     <h4 className="text-lg font-semibold mb-2">🍴 Recommended Recipes</h4>
//     <ul className="list-disc pl-5">
//     {recommendedRecipes.map((recipe, idx) => (
//   <li key={idx} className="mb-4">
//     <p className="font-semibold">🥘 {recipe.recipe_name} (⏱ {recipe.time_to_cook} mins)</p>
//     <p><strong>Using:</strong> {recipe.item}</p>
//     <p><strong>Instructions:</strong> {recipe.instructions}</p>
//     <p><strong>Extras:</strong> {recipe.additional_ingredients.join(", ")}</p>
//   </li>
// ))}

//     </ul>
//   </div>
// )}

//   </div>
// )}


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
// import React, { useState } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc } from "firebase/firestore";
// import { useEffect } from "react";
// import {  query, onSnapshot } from "firebase/firestore";


// const SmartGrocery = () => {
//     const [groceryImage, setGroceryImage] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [expiryDates, setExpiryDates] = useState({});
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [expiringSoon, setExpiringSoon] = useState([]);
//     const [recommendedRecipes, setRecommendedRecipes] = useState([]);
//     const [listening, setListening] = useState(false);
//     const [recognitionResult, setRecognitionResult] = useState("");
    
//     const handleFileChange = (e) => {
//         setGroceryImage(e.target.files[0]);
//     };

//     const handleExpiryDateChange = (item, date) => {
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: date,
//         }));
//     };
//     const startVoiceRecognition = () => {
//         if (!('webkitSpeechRecognition' in window)) {
//             alert("Speech recognition not supported in this browser.");
//             return;
//         }
    
//         const recognition = new window.webkitSpeechRecognition();
//         recognition.lang = "en-US";
//         recognition.continuous = false;
//         recognition.interimResults = false;
    
//         recognition.start();
//         setListening(true);
    
//         recognition.onresult = (event) => {
//             const speechText = event.results[0][0].transcript;
//             setRecognitionResult(speechText);
//             console.log("Heard:", speechText);
//             parseAndSaveItem(speechText);
//             setListening(false);
//         };
    
//         recognition.onerror = (e) => {
//             console.error("Speech recognition error", e);
//             setListening(false);
//         };
    
//         recognition.onend = () => {
//             setListening(false);
//         };
//     };
    
//     const parseAndSaveItem = async (speechText) => {
//         const pattern = /add\s+(.+?)\s+expiry\s+date\s+(.+)/i;
//         const match = speechText.match(pattern);
//         if (!match) {
//             alert("Couldn't understand the command. Try: 'Add milk expiry date April 18'");
//             return;
//         }
    
//         const item = match[1].trim().toLowerCase();
//         const dateString = match[2].trim();
//         const parsedDate = new Date(dateString);
    
//         if (isNaN(parsedDate.getTime())) {
//             alert("Couldn't parse the expiry date.");
//             return;
//         }
    
//         const formattedDate = parsedDate.toISOString().split("T")[0];
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: formattedDate,
//         }));
    
//         if (!user?.uid) return;
    
//         try {
//             await addDoc(collection(db, "users", user.uid, "expiryItems"), {
//                 name: item,
//                 expiryDate: formattedDate,
//             });
//             alert(`✅ Saved "${item}" with expiry date ${formattedDate}`);
//         } catch (err) {
//             console.error("Error saving via voice:", err);
//             alert("Failed to save item.");
//         }
//     };
    
//     // const handleExtractItems = async () => {
//     //     if (!groceryImage) return alert("Please upload a grocery image first.");

//     //     const data = new FormData();
//     //     data.append("image", groceryImage);

//     //     try {
//     //         const res = await fetch("http://127.0.0.1:5000/extract-items", {
//     //             method: "POST",
//     //             body: data,
//     //         });
//     //         const json = await res.json();
//     //         setExtractedItems(json.grocery_items || []);
//     //     } catch (err) {
//     //         console.error("Error extracting items:", err);
//     //         setExtractedItems(["Error extracting items"]);
//     //     }
//     // };
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
//             const items = json.grocery_items || [];
//             setExtractedItems(items);
    
//             // Set default expiry to 1 month from now
//             const defaultExpiryDates = {};
// items.forEach((item) => {
//     const newExpiry = new Date();
//     newExpiry.setMonth(newExpiry.getMonth() + 1);
//     defaultExpiryDates[item] = newExpiry.toISOString().split("T")[0];
// });

    
//             items.forEach((item) => {
//                 // Clone new date for each to avoid reference issues
//                 const newExpiry = new Date();
//                 newExpiry.setMonth(newExpiry.getMonth() + 1);
//                 defaultExpiryDates[item] = newExpiry.toISOString().split("T")[0];
//             });
    
//             setExpiryDates(defaultExpiryDates);
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
    
//             // ✅ Clear the extractedItems and expiryDates after saving
//             setExtractedItems([]);
//             setExpiryDates({});
//         } catch (err) {
//             console.error("Error saving to Firestore:", err);
//             alert("Failed to save expiry dates.");
//         }
//     };
    
//     // useEffect(() => {
//     //     const today = new Date();
//     //     const soon = [];
    
//     //     Object.entries(expiryDates).forEach(([item, dateStr]) => {
//     //         if (dateStr) {
//     //             const expiry = new Date(dateStr);
//     //             const diffTime = expiry.getTime() - today.getTime();
//     //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     //             if (diffDays <= 7 && diffDays >= 0) {
//     //                 soon.push({ item, daysLeft: diffDays });
//     //             }
//     //         }
//     //     });
    
//     //     setExpiringSoon(soon);
//     // }, [expiryDates]);
//     useEffect(() => {
//         if (!user || !user.uid) return;
    
//         const q = query(collection(db, "users", user.uid, "expiryItems"));
    
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const today = new Date();
//             const soonItems = [];
    
//             snapshot.forEach((doc) => {
//                 const data = doc.data();
    
//                 // 🔧 Ensure parsing date correctly (force start of day)
//                 const expiryDate = new Date(data.expiryDate + "T00:00:00");
    
//                 const diffTime = expiryDate.getTime() - today.getTime();
//                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
//                 if (diffDays <= 7 && diffDays >= 0) {
//                     soonItems.push({
//                         name: data.name,
//                         daysLeft: diffDays,
//                     });
//                 }
//             });
    
//             setExpiringSoon(soonItems);
//         });
    
//         return () => unsubscribe();
//     }, [user]);
    
    
//     return (
//         <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
//             {/* Title */}
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
//                 🧾 Smart Grocery List Extractor
//             </h1>
//             {/* {expiringSoon.length > 0 && (
//     <div className="max-w-2xl mx-auto mt-6 bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg shadow mb-4">
//         <h4 className="text-lg font-semibold mb-2">⚠️ Items Expiring Soon</h4>
//         <ul className="list-disc pl-5">
//             {expiringSoon.map((item, index) => (
//                 <li key={index}>
//                     <strong>{item.item}</strong> will expire in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//                 </li>
//             ))}
//         </ul>
//     </div>
// )} */}
// {expiringSoon.length > 0 && (
//   <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md">
//     <h4 className="text-lg font-bold mb-2">🕒 Items Expiring Soon</h4>
    
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         const selected = expiringSoon
//           .filter((_, idx) => document.getElementById(`select-${idx}`).checked)
//           .map((item) => item.name);

//         // Call your expiry endpoint with selected ingredients
//         fetch("http://127.0.0.1:5000/expiry", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ expiry_items: selected }),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             console.log("Recipes received:", data);
//             setRecommendedRecipes(data.recipes || []); // update state to show recipes
//           })
          
//           .catch((err) => console.error("Error:", err));
//       }}
//     >
//       <ul className="list-none pl-1 mb-4">
//         {expiringSoon.map((item, idx) => (
//          <li key={idx} className="flex items-center gap-2 mb-2">
//          <input type="checkbox" id={`select-${idx}`} className="form-checkbox h-4 w-4 text-yellow-600" />
//          <label htmlFor={`select-${idx}`}>
//            <strong>{item.name}</strong> expires in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//          </label>
//        </li>
       
//         ))}
//       </ul>

//       <button
//         type="submit"
//         className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
//       >
//         🍽 Get Recipes with Selected Items
//       </button>
//     </form>
//     {recommendedRecipes.length > 0 && (
//   <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
//     <h4 className="text-lg font-semibold mb-2">🍴 Recommended Recipes</h4>
//     <ul className="list-disc pl-5">
//     {recommendedRecipes.map((recipe, idx) => (
//   <li key={idx} className="mb-4">
//     <p className="font-semibold">🥘 {recipe.recipe_name} (⏱ {recipe.time_to_cook} mins)</p>
//     <p><strong>Using:</strong> {recipe.item}</p>
//     <p><strong>Instructions:</strong> {recipe.instructions}</p>
//     <p><strong>Extras:</strong> {recipe.additional_ingredients.join(", ")}</p>
//   </li>
// ))}

//     </ul>
//   </div>
// )}

//   </div>
// )}


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
//             <div className="text-center mt-8">
//     <button
//         onClick={startVoiceRecognition}
//         className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//     >
//         🎙️ {listening ? "Listening..." : "Add via Voice"}
//     </button>

//     {recognitionResult && (
//         <p className="mt-2 text-sm text-gray-600 italic">
//             🗣️ Heard: "{recognitionResult}"
//         </p>
//     )}
// </div>

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
// import React, { useState, useEffect } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
// import Fuse from "fuse.js";


// const SmartGrocery = () => {
//     const [groceryImage, setGroceryImage] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [expiryDates, setExpiryDates] = useState({});
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [expiringSoon, setExpiringSoon] = useState([]);
//     const [recommendedRecipes, setRecommendedRecipes] = useState([]);
//     const [listening, setListening] = useState(false);
//     const [recognitionResult, setRecognitionResult] = useState("");
    
//     const handleFileChange = (e) => {
//         setGroceryImage(e.target.files[0]);
//     };

//     const handleExpiryDateChange = (item, date) => {
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: date,
//         }));
//     };
//     const findClosestMatch = (target, items) => {
//         const fuse = new Fuse(items, {
//             includeScore: true,
//             threshold: 0.4, // Adjust as needed (0 = exact, 1 = loose)
//         });
    
//         const result = fuse.search(target);
//         return result.length > 0 ? result[0].item : target;
//     };
    
//     // CRITICAL FIX: Adjust date for timezone offset before saving to Firebase
//     const adjustDateForTimezone = (dateString) => {
//         const date = new Date(dateString);
        
//         // Add timezone offset to counteract the timezone effect when the date is used
//         const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
//         const adjustedDate = new Date(date.getTime() + timezoneOffset);
        
//         // Format as YYYY-MM-DD
//         return adjustedDate.toISOString().split('T')[0];
//     };
    
//     const startVoiceRecognition = () => {
//         if (!('webkitSpeechRecognition' in window)) {
//             alert("Speech recognition not supported in this browser.");
//             return;
//         }
    
//         const recognition = new window.webkitSpeechRecognition();
//         recognition.lang = "en-US";
//         recognition.continuous = false;
//         recognition.interimResults = false;
    
//         recognition.start();
//         setListening(true);
    
//         recognition.onresult = (event) => {
//             const speechText = event.results[0][0].transcript;
//             setRecognitionResult(speechText);
//             parseAndSaveItem(speechText);
//             setListening(false);
//         };
    
//         recognition.onerror = (e) => {
//             console.error("Speech recognition error", e);
//             setListening(false);
//         };
    
//         recognition.onend = () => {
//             setListening(false);
//         };
//     };
    
    
    
//     // const parseAndSaveItem = async (speechText) => {
//     //     const pattern = /add\s+(.+?)\s+expiry\s+date\s+(.+)/i;
//     //     const match = speechText.match(pattern);
//     //     if (!match) {
//     //         alert("Couldn't understand the command. Try: 'Add milk expiry date April 18'");
//     //         return;
//     //     }
    
//     //     const item = match[1].trim().toLowerCase();
//     //     const dateString = match[2].trim();
//     //     const currentYear = new Date().getFullYear();
    
//     //     const hasYear = /\b\d{4}\b/.test(dateString);
//     //     const finalDateString = hasYear ? dateString : `${dateString} ${currentYear}`;
    
//     //     const parsedDate = new Date(finalDateString);
//     //     if (isNaN(parsedDate.getTime())) {
//     //         alert("Couldn't parse the expiry date.");
//     //         return;
//     //     }
    
//     //     // Format date to YYYY-MM-DD
//     //     const year = parsedDate.getFullYear();
//     //     const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
//     //     const day = String(parsedDate.getDate()).padStart(2, '0');
//     //     const formattedDate = `${year}-${month}-${day}`;
    
//     //     console.log("✅ Manually formatted date:", formattedDate);
    
//     //     if (!user?.uid) return;
    
//     //     try {
//     //         await addDoc(collection(db, "users", user.uid, "expiryItems"), {
//     //             name: item,
//     //             expiryDate: formattedDate,
//     //         });
    
//     //         alert(`✅ Saved "${item}" with expiry date ${formattedDate}`);
//     //         fetchExpiringItems();
    
//     //         // ✅ Remove the item from the extracted list if it was there
//     //         setExtractedItems((prevItems) => prevItems.filter((i) => i.toLowerCase() !== item));
    
//     //         // ✅ Also remove its expiry date from the expiryDates state if present
//     //         setExpiryDates((prevDates) => {
//     //             const updated = { ...prevDates };
//     //             delete updated[item];
//     //             return updated;
//     //         });
    
//     //     } catch (err) {
//     //         console.error("❌ Firebase save error:", err);
//     //         alert("Failed to save item.");
//     //     }
//     // };
//     const parseAndSaveItem = async (speechText) => {
//         const pattern = /add\s+(.+?)\s+expiry\s+date\s+(.+)/i;
//         const match = speechText.match(pattern);
//         if (!match) {
//             alert("Couldn't understand the command. Try: 'Add milk expiry date April 18'");
//             return;
//         }
    
//         const item = match[1].trim().toLowerCase();
//         const dateString = match[2].trim();
//         const currentYear = new Date().getFullYear();
    
//         const hasYear = /\b\d{4}\b/.test(dateString);
//         const finalDateString = hasYear ? dateString : `${dateString} ${currentYear}`;
    
//         const parsedDate = new Date(finalDateString);
//         if (isNaN(parsedDate.getTime())) {
//             alert("Couldn't parse the expiry date.");
//             return;
//         }
    
//         const year = parsedDate.getFullYear();
//         const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
//         const day = String(parsedDate.getDate()).padStart(2, '0');
//         const formattedDate = `${year}-${month}-${day}`;
    
//         if (!user?.uid) return;
    
//         try {
//             await addDoc(collection(db, "users", user.uid, "expiryItems"), {
//                 name: item,
//                 expiryDate: formattedDate,
//             });
    
//             alert(`✅ Saved "${item}" with expiry date ${formattedDate}`);
//             fetchExpiringItems();
    
//             // Remove the item from extractedItems if it exists
//             setExtractedItems((prevItems) =>
//                 prevItems.filter(
//                     (extractedItem) => extractedItem.trim().toLowerCase() !== item.trim().toLowerCase()
//                 )
//             );
            
    
//             // Also remove its expiryDate from state
//             setExpiryDates((prev) => {
//                 const updated = { ...prev };
//                 delete updated[item];
//                 return updated;
//             });
    
//         } catch (err) {
//             console.error("❌ Firebase save error:", err);
//             alert("Failed to save item.");
//         }
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
//             const items = json.grocery_items || [];
//             setExtractedItems(items);
    
//             // Set default expiry to 1 month from now
//             const defaultExpiryDates = {};
//             items.forEach((item) => {
//                 const newExpiry = new Date();
//                 newExpiry.setMonth(newExpiry.getMonth() + 1);
//                 defaultExpiryDates[item] = newExpiry.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//             });
    
//             setExpiryDates(defaultExpiryDates);
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
//                     // Apply timezone adjustment before saving
//                     const adjustedDate = adjustDateForTimezone(expiryDate);
                    
//                     await addDoc(collection(db, "users", uid, "expiryItems"), {
//                         name: itemName,
//                         expiryDate: adjustedDate,
//                     });
//                 }
//             }
//             alert("Expiry dates saved to Firestore!");
    
//             // Clear the extractedItems and expiryDates after saving
//             setExtractedItems([]);
//             setExpiryDates({});
            
//             // Refresh the expiring items list
//             fetchExpiringItems();
//         } catch (err) {
//             console.error("Error saving to Firestore:", err);
//             alert("Failed to save expiry dates.");
//         }
//     };
    
//     // Separate function to fetch expiring items (can be called separately)
  
//     const fetchExpiringItems = () => {
//         if (!user || !user.uid) return;
        
//         const q = query(collection(db, "users", user.uid, "expiryItems"));
        
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);
    
//             const soonItems = [];
    
//             snapshot.forEach((doc) => {
//                 const data = doc.data();
//                 const [year, month, day] = data.expiryDate.split('-').map(Number);
//                 const expiryDate = new Date(year, month - 1, day);
//                 expiryDate.setHours(0, 0, 0, 0);
    
//                 const diffDays = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
    
//                 soonItems.push({
//                     name: data.name,
//                     expiryDate: data.expiryDate,
//                     expired: expiryDate < today,
//                     daysLeft: diffDays,
//                 });
//             });
    
//             setExpiringSoon(soonItems);
//         });
    
//         return unsubscribe;
//     };
    
//     // Set up the listener when the component mounts
//     useEffect(() => {
//         const unsubscribe = fetchExpiringItems();
        
//         // Clean up the listener when component unmounts
//         return () => {
//             if (unsubscribe) unsubscribe();
//         };
//     }, [user]);
    
//     return (
//         <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
//             {/* Title */}
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
//                 🧾 Smart Grocery List Extractor
//             </h1>
            
//             {/* Debug section - helpful for seeing what's happening */}
//             {/* <div className="max-w-2xl mx-auto mb-4 bg-white/80 p-4 rounded">
//                 <h4>Debug Info:</h4>
//                 <p>Expiring items count: {expiringSoon.length}</p>
//                 <pre>{JSON.stringify(expiringSoon, null, 2)}</pre>
//             </div> */}
            
//             {expiringSoon.length > 0 && (
//               <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md">
//                 <h4 className="text-lg font-bold mb-2">🕒 Items Expiring Soon</h4>
                
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     const selected = expiringSoon
//                       .filter((_, idx) => document.getElementById(`select-${idx}`).checked)
//                       .map((item) => item.name);
            
//                     // Call your expiry endpoint with selected ingredients
//                     fetch("http://127.0.0.1:5000/expiry", {
//                       method: "POST",
//                       headers: {
//                         "Content-Type": "application/json",
//                       },
//                       body: JSON.stringify({ expiry_items: selected }),
//                     })
//                       .then((res) => res.json())
//                       .then((data) => {
//                         console.log("Recipes received:", data);
//                         setRecommendedRecipes(data.recipes || []); // update state to show recipes
//                       })
                      
//                       .catch((err) => console.error("Error:", err));
//                   }}
//                 >
//                   {/* <ul className="list-none pl-1 mb-4">
//                     {expiringSoon.map((item, idx) => (
//                      <li key={idx} className="flex items-center gap-2 mb-2">
//                      <input type="checkbox" id={`select-${idx}`} className="form-checkbox h-4 w-4 text-yellow-600" />
//                      <label htmlFor={`select-${idx}`}>
//                        <strong>{item.name}</strong> expires in {item.daysLeft} day{item.daysLeft !== 1 && "s"}.
//                      </label>
//                    </li>
                   
//                     ))}
//                   </ul> */}
//             <ul className="list-none pl-1 mb-4">
//   {expiringSoon.map((item, idx) => (
//     <li key={idx} className="flex items-center gap-2 mb-2">
//       <label htmlFor={`select-${idx}`}>
//         <strong>{item.name}</strong> – Expiry: {item.expiryDate}
//       </label>
//       {item.expired ? (
//         <span className="text-red-500 font-bold ml-2">Expired</span>
//       ) : (
//         <input
//           type="checkbox"
//           id={`select-${idx}`}
//           className="form-checkbox h-4 w-4 text-yellow-600 ml-2"
//         />
//       )}
//     </li>
//   ))}
// </ul>

//                   <button
//                     type="submit"
//                     className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
//                   >
//                     🍽 Get Recipes with Selected Items
//                   </button>
//                 </form>
//                 {recommendedRecipes.length > 0 && (
//               <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
//                 <h4 className="text-lg font-semibold mb-2">🍴 Recommended Recipes</h4>
//                 <ul className="list-disc pl-5">
//                 {recommendedRecipes.map((recipe, idx) => (
//               <li key={idx} className="mb-4">
//                 <p className="font-semibold">🥘 {recipe.recipe_name} (⏱ {recipe.time_to_cook} mins)</p>
//                 <p><strong>Using:</strong> {recipe.item}</p>
//                 <p><strong>Instructions:</strong> {recipe.instructions}</p>
//                 <p><strong>Extras:</strong> {recipe.additional_ingredients.join(", ")}</p>
//               </li>
//             ))}
            
//                 </ul>
//               </div>
//             )}
            
//               </div>
//             )}


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
//             <div className="text-center mt-8">
//                 <button
//                     onClick={startVoiceRecognition}
//                     className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//                 >
//                     🎙️ {listening ? "Listening..." : "Add via Voice"}
//                 </button>

//                 {recognitionResult && (
//                     <p className="mt-2 text-sm text-gray-600 italic">
//                         🗣️ Heard: "{recognitionResult}"
//                     </p>
//                 )}
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
//                                         value={expiryDates[item] || ""}
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

// import React, { useState, useEffect } from "react";
// import { db } from "../firebaseConfig";
// import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
// import Fuse from "fuse.js";

// const SmartGrocery = () => {
//     const [groceryImage, setGroceryImage] = useState(null);
//     const [extractedItems, setExtractedItems] = useState([]);
//     const [expiryDates, setExpiryDates] = useState({});
//     const [expiringSoon, setExpiringSoon] = useState([]);
//     const [recommendedRecipes, setRecommendedRecipes] = useState([]);
//     const [listening, setListening] = useState(false);
//     const [recognitionResult, setRecognitionResult] = useState("");
//     const user = JSON.parse(localStorage.getItem("user"));
//     const [fuse, setFuse] = useState(null); // Store Fuse instance
//     const [selectedItems, setSelectedItems] = useState([]);



//     useEffect(() => {
//         if (extractedItems.length > 0) {
//             const fuseInstance = new Fuse(extractedItems, {
//                 includeScore: true,
//                 threshold: 0.4,
//             });
//             setFuse(fuseInstance);
//         }
//     }, [extractedItems]);

//     const handleFileChange = (e) => {
//         setGroceryImage(e.target.files[0]);
//     };

//     const handleExpiryDateChange = (item, date) => {
//         setExpiryDates((prev) => ({
//             ...prev,
//             [item]: date,
//         }));
//     };

//     const adjustDateForTimezone = (dateString) => {
//         const date = new Date(dateString);
//         const timezoneOffset = date.getTimezoneOffset() * 60000;
//         const adjustedDate = new Date(date.getTime() + timezoneOffset);
//         return adjustedDate.toISOString().split('T')[0];
//     };
//     const handleCheckboxChange = (item) => {
//         setSelectedItems((prevSelected) => {
//           if (prevSelected.includes(item)) {
//             return prevSelected.filter(i => i !== item); // Remove if already selected
//           } else {
//             return [...prevSelected, item]; // Add if not selected
//           }
//         });
//       };
      
//     const startVoiceRecognition = () => {
//         if (!('webkitSpeechRecognition' in window)) {
//             alert("Speech recognition not supported in this browser.");
//             return;
//         }

//         const recognition = new window.webkitSpeechRecognition();
//         recognition.lang = "en-US";
//         recognition.continuous = false;
//         recognition.interimResults = false;

//         recognition.start();
//         setListening(true);

//         recognition.onresult = (event) => {
//             const speechText = event.results[0][0].transcript;
//             setRecognitionResult(speechText);
//             parseAndSaveItem(speechText);
//             setListening(false);
//         };

//         recognition.onerror = (e) => {
//             console.error("Speech recognition error", e);
//             setListening(false);
//         };

//         recognition.onend = () => {
//             setListening(false);
//         };
//     };

//     const parseAndSaveItem = async (speechText) => {
//         const pattern = /add\s+(.+?)\s+expiry\s+date\s+(.+)/i;
//         const match = speechText.match(pattern);
//         if (!match) {
//             alert("Couldn't understand the command. Try: 'Add milk expiry date April 18'");
//             return;
//         }

//         let item = match[1].trim().toLowerCase();
//         const dateString = match[2].trim();
//         const currentYear = new Date().getFullYear();
//         const hasYear = /\b\d{4}\b/.test(dateString);
//         const finalDateString = hasYear ? dateString : `${dateString} ${currentYear}`;
//         const parsedDate = new Date(finalDateString);

//         if (isNaN(parsedDate.getTime())) {
//             alert("Couldn't parse the expiry date.");
//             return;
//         }

//         // Apply fuzzy match
//         if (fuse) {
//             const result = fuse.search(item);
//             if (result.length > 0 && result[0].score <= 0.4) {
//                 item = result[0].item;
//             }
//         }

//         const year = parsedDate.getFullYear();
//         const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
//         const day = String(parsedDate.getDate()).padStart(2, '0');
//         const formattedDate = `${year}-${month}-${day}`;

//         if (!user?.uid) return;

//         try {
//             await addDoc(collection(db, "users", user.uid, "expiryItems"), {
//                 name: item,
//                 expiryDate: formattedDate,
//             });

//             alert(`✅ Saved "${item}" with expiry date ${formattedDate}`);
//             fetchExpiringItems();

//             setExtractedItems((prevItems) =>
//                 prevItems.filter((extractedItem) => extractedItem.toLowerCase() !== item.toLowerCase())
//             );

//             setExpiryDates((prevDates) => {
//                 const updated = { ...prevDates };
//                 delete updated[item];
//                 return updated;
//             });

//         } catch (err) {
//             console.error("❌ Firebase save error:", err);
//             alert("Failed to save item.");
//         }
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
//             const items = json.grocery_items || [];
//             setExtractedItems(items);

//             const defaultExpiryDates = {};
//             items.forEach((item) => {
//                 const newExpiry = new Date();
//                 newExpiry.setMonth(newExpiry.getMonth() + 1);
//                 defaultExpiryDates[item] = newExpiry.toISOString().split('T')[0];
//             });

//             setExpiryDates(defaultExpiryDates);
//         } catch (err) {
//             console.error("Error extracting items:", err);
//             setExtractedItems(["Error extracting items"]);
//         }
//     };
//     const handleGetRecipe = () => {
//         // Filter the checked items from expiring items list
//         const checkedItems = expiringSoon.filter(item => item.checked);
    
//         // Call the API to get recipes for the checked items
//         if (checkedItems.length > 0) {
//             handleSendToRecipeAPI(checkedItems);
//         } else {
//             alert('Please select items to get recipes!');
//         }
//     };
    
    
//     const handleSaveToFirestore = async () => {
//         if (!user || !user.uid) return alert("User not logged in.");
//         const uid = user.uid;
//         const itemsToSave = Object.entries(expiryDates);

//         try {
//             for (const [itemName, expiryDate] of itemsToSave) {
//                 if (expiryDate) {
//                     const adjustedDate = adjustDateForTimezone(expiryDate);
//                     await addDoc(collection(db, "users", uid, "expiryItems"), {
//                         name: itemName,
//                         expiryDate: adjustedDate,
//                     });
//                 }
//             }

//             alert("Expiry dates saved to Firestore!");
//             setExtractedItems([]);
//             setExpiryDates({});
//             fetchExpiringItems();

//         } catch (err) {
//             console.error("Error saving to Firestore:", err);
//             alert("Failed to save expiry dates.");
//         }
//     };
//     const handleSendToRecipeAPI = async (selectedItems) => {
//         try {
//             // Extract the names of the selected expiry items
//             const expiryItems = selectedItems.map(item => item.name);
    
//             // Prepare the request body
//             const requestBody = {
//                 expiry_items: expiryItems
//             };
    
//             // Send a POST request to the Flask API
//             const response = await fetch('/expiry', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(requestBody),
//             });
    
//             // Check if the response is OK
//             if (!response.ok) {
//                 throw new Error('Failed to fetch recipes');
//             }
    
//             // Parse the JSON response
//             const data = await response.json();
    
//             // Handle the recipe data here
//             if (data.recipes) {
//                 console.log('Recipe suggestions:', data.recipes);
//                 // You can now set the recipe data to the state or display it in your UI
//             } else {
//                 console.error('No recipes returned:', data.error);
//             }
//         } catch (error) {
//             console.error('Error sending request:', error);
//         }
//     };
    
//     const fetchExpiringItems = () => {
//         if (!user || !user.uid) return;
    
//         const q = query(collection(db, "users", user.uid, "expiryItems"));
    
//         const unsubscribe = onSnapshot(q, (snapshot) => {
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);
    
//             const filteredItems = [];
    
//             snapshot.forEach((doc) => {
//                 const data = doc.data();
//                 const [year, month, day] = data.expiryDate.split('-').map(Number);
//                 const expiryDate = new Date(year, month - 1, day);
//                 expiryDate.setHours(0, 0, 0, 0);
    
//                 const diffDays = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
//                 const isExpired = expiryDate < today;
//                 const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
    
//                 if (isExpired || isExpiringSoon) {
//                     filteredItems.push({
//                         name: data.name,
//                         expiryDate: data.expiryDate,
//                         expired: isExpired,
//                         daysLeft: diffDays,
//                     });
//                 }
//             });
    
//             setExpiringSoon(filteredItems);
//         });
    
//         return unsubscribe;
//     };
    

//     useEffect(() => {
//         const unsubscribe = fetchExpiringItems();
//         return () => {
//             if (unsubscribe) unsubscribe();
//         };
//     }, [user]);

//     return (
//         <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
//                 🧾 Smart Grocery List Extractor
//             </h1>
//             {/* ...Your existing UI continues... */}
           
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
//         fetch("http://127.0.0.1:5000/expiry", {
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
//   type="checkbox"
//   id={`select-${idx}`}
//   className="form-checkbox h-4 w-4 text-yellow-600 ml-2"
//   onChange={() => handleCheckboxChange(item)}
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

// export default SmartGrocery;

import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, query, onSnapshot } from "firebase/firestore";
import Fuse from "fuse.js";
import jsPDF from "jspdf";
const SmartGrocery = () => {
    const [groceryImage, setGroceryImage] = useState(null);
    const [extractedItems, setExtractedItems] = useState([]);
    const [expiryDates, setExpiryDates] = useState({});
    const [expiringSoon, setExpiringSoon] = useState([]);
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [listening, setListening] = useState(false);
    const [recognitionResult, setRecognitionResult] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const [fuse, setFuse] = useState(null); // Store Fuse instance
    const [selectedItems, setSelectedItems] = useState([]);
    const downloadRecipesAsPDF = () => {
        if (recommendedRecipes.length === 0) {
            alert("No recipes to download!");
            return;
        }
    
        try {
            const doc = new jsPDF();
            let yPos = 20;
    
            // Title
            doc.setFontSize(22);
            doc.setTextColor(0, 100, 0);
            doc.text("Your Smart Kitchen Recipes", 105, yPos, { align: "center" });
            yPos += 15;
    
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, yPos, { align: "center" });
            yPos += 15;
    
            // Selected items
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            const itemsText = doc.splitTextToSize("Using items: " + selectedItems.join(", "), 160);
            doc.text(itemsText, 20, yPos);
            yPos += itemsText.length * 6 + 5;
    
            // Recipes
            recommendedRecipes.forEach((recipe, index) => {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
    
                doc.setFontSize(16);
                doc.setTextColor(200, 0, 0);
                const recipeTitle = `${index + 1}. ${recipe.recipe_name} (${recipe.time_to_cook} mins)`;
                const wrappedTitle = doc.splitTextToSize(recipeTitle, 160);
                doc.text(wrappedTitle, 20, yPos);
                yPos += wrappedTitle.length * 6 + 2;
    
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
    
                const itemUsed = doc.splitTextToSize(`Using: ${recipe.item}`, 160);
                doc.text(itemUsed, 25, yPos);
                yPos += itemUsed.length * 6 + 2;
    
                doc.text("Instructions:", 25, yPos);
                yPos += 6;
                const splitInstructions = doc.splitTextToSize(recipe.instructions, 160);
                doc.text(splitInstructions, 30, yPos);
                yPos += splitInstructions.length * 6 + 2;
    
                doc.text("Additional ingredients:", 25, yPos);
                yPos += 6;
                const splitExtras = doc.splitTextToSize(recipe.additional_ingredients.join(", "), 160);
                doc.text(splitExtras, 30, yPos);
                yPos += splitExtras.length * 6 + 10;
            });
    
            // Footer
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("Generated by Smart Grocery App", 105, 285, { align: "center" });
    
            doc.save("smart-kitchen-recipes.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };
    
    useEffect(() => {
        if (extractedItems.length > 0) {
            const fuseInstance = new Fuse(extractedItems, {
                includeScore: true,
                threshold: 0.4,
            });
            setFuse(fuseInstance);
        }
    }, [extractedItems]);

    const handleFileChange = (e) => {
        setGroceryImage(e.target.files[0]);
    };

    const handleExpiryDateChange = (item, date) => {
        setExpiryDates((prev) => ({
            ...prev,
            [item]: date,
        }));
    };

    const adjustDateForTimezone = (dateString) => {
        const date = new Date(dateString);
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + timezoneOffset);
        return adjustedDate.toISOString().split('T')[0];
    };
    
    const handleCheckboxChange = (item) => {
        setSelectedItems((prevSelected) => {
          if (prevSelected.includes(item.name)) {
            return prevSelected.filter(i => i !== item.name); // Remove if already selected
          } else {
            return [...prevSelected, item.name]; // Add if not selected
          }
        });
    };
      
    const startVoiceRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.start();
        setListening(true);

        recognition.onresult = (event) => {
            const speechText = event.results[0][0].transcript;
            setRecognitionResult(speechText);
            parseAndSaveItem(speechText);
            setListening(false);
        };

        recognition.onerror = (e) => {
            console.error("Speech recognition error", e);
            setListening(false);
        };

        recognition.onend = () => {
            setListening(false);
        };
    };

    const parseAndSaveItem = async (speechText) => {
        const pattern = /add\s+(.+?)\s+expiry\s+date\s+(.+)/i;
        const match = speechText.match(pattern);
        if (!match) {
            alert("Couldn't understand the command. Try: 'Add milk expiry date April 18'");
            return;
        }

        let item = match[1].trim().toLowerCase();
        const dateString = match[2].trim();
        const currentYear = new Date().getFullYear();
        const hasYear = /\b\d{4}\b/.test(dateString);
        const finalDateString = hasYear ? dateString : `${dateString} ${currentYear}`;
        const parsedDate = new Date(finalDateString);

        if (isNaN(parsedDate.getTime())) {
            alert("Couldn't parse the expiry date.");
            return;
        }

        // Apply fuzzy match
        if (fuse) {
            const result = fuse.search(item);
            if (result.length > 0 && result[0].score <= 0.4) {
                item = result[0].item;
            }
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        if (!user?.uid) return;

        try {
            await addDoc(collection(db, "users", user.uid, "expiryItems"), {
                name: item,
                expiryDate: formattedDate,
            });

            alert(`✅ Saved "${item}" with expiry date ${formattedDate}`);
            fetchExpiringItems();

            setExtractedItems((prevItems) =>
                prevItems.filter((extractedItem) => extractedItem.toLowerCase() !== item.toLowerCase())
            );

            setExpiryDates((prevDates) => {
                const updated = { ...prevDates };
                delete updated[item];
                return updated;
            });

        } catch (err) {
            console.error("❌ Firebase save error:", err);
            alert("Failed to save item.");
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
            const items = json.grocery_items || [];
            setExtractedItems(items);

            const defaultExpiryDates = {};
            items.forEach((item) => {
                const newExpiry = new Date();
                newExpiry.setMonth(newExpiry.getMonth() + 1);
                defaultExpiryDates[item] = newExpiry.toISOString().split('T')[0];
            });

            setExpiryDates(defaultExpiryDates);
        } catch (err) {
            console.error("Error extracting items:", err);
            setExtractedItems(["Error extracting items"]);
        }
    };
    
    const handleGetRecipes = async () => {
        if (selectedItems.length === 0) {
            alert('Please select items to get recipes!');
            return;
        }
        
        try {
            const response = await fetch("http://127.0.0.1:5000/expiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ expiry_items: selectedItems }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch recipes');
            }
            
            const data = await response.json();
            console.log("Recipes received:", data);
            setRecommendedRecipes(data.recipes || []);
        } catch (error) {
            console.error("Error getting recipes:", error);
            alert("Failed to get recipes. Please try again.");
        }
    };
    
    const handleSaveToFirestore = async () => {
        if (!user || !user.uid) return alert("User not logged in.");
        const uid = user.uid;
        const itemsToSave = Object.entries(expiryDates);

        try {
            for (const [itemName, expiryDate] of itemsToSave) {
                if (expiryDate) {
                    const adjustedDate = adjustDateForTimezone(expiryDate);
                    await addDoc(collection(db, "users", uid, "expiryItems"), {
                        name: itemName,
                        expiryDate: adjustedDate,
                    });
                }
            }

            alert("Expiry dates saved to Firestore!");
            setExtractedItems([]);
            setExpiryDates({});
            fetchExpiringItems();

        } catch (err) {
            console.error("Error saving to Firestore:", err);
            alert("Failed to save expiry dates.");
        }
    };
    
    const fetchExpiringItems = () => {
        if (!user || !user.uid) return;
    
        const q = query(collection(db, "users", user.uid, "expiryItems"));
    
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
    
            const filteredItems = [];
    
            snapshot.forEach((doc) => {
                const data = doc.data();
                const [year, month, day] = data.expiryDate.split('-').map(Number);
                const expiryDate = new Date(year, month - 1, day);
                expiryDate.setHours(0, 0, 0, 0);
    
                const diffDays = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));
                const isExpired = expiryDate < today;
                const isExpiringSoon = diffDays >= 0 && diffDays <= 7;
    
                if (isExpired || isExpiringSoon) {
                    filteredItems.push({
                        name: data.name,
                        expiryDate: data.expiryDate,
                        expired: isExpired,
                        daysLeft: diffDays,
                    });
                }
            });
    
            setExpiringSoon(filteredItems);
        });
    
        return unsubscribe;
    };

    useEffect(() => {
        const unsubscribe = fetchExpiringItems();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [user]);

    return (
        <div className="relative bg-gradient-to-br from-orange-100 via-amber-200 to-rose-100 min-h-screen py-16 px-6 overflow-hidden">
            <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
                🧾 Smart Grocery List Extractor
            </h1>
            {/* ...Your existing UI continues... */}
           
            {expiringSoon.length > 0 && (
                <div className="max-w-2xl mx-auto mt-6 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-bold mb-2">🕒 Items Expiring Soon</h4>
                    
                    <ul className="list-none pl-1 mb-4">
                        {expiringSoon.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2 mb-2">
                                <label htmlFor={`select-${idx}`} className="flex items-center">
                                    <strong>{item.name}</strong> – Expiry: {item.expiryDate}
                                </label>
                                {item.expired ? (
                                    <span className="text-red-500 font-bold ml-2">Expired</span>
                                ) : (
                                    <input
                                        type="checkbox"
                                        id={`select-${idx}`}
                                        className="form-checkbox h-4 w-4 text-yellow-600 ml-2"
                                        onChange={() => handleCheckboxChange(item)}
                                        checked={selectedItems.includes(item.name)}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleGetRecipes}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded"
                    >
                        🍽 Get Recipes with Selected Items
                    </button>
                    
                    {recommendedRecipes.length > 0 && (
                        <div className="mt-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
                            <h4 className="text-lg font-semibold mb-2">🍴 Recommended Recipes</h4>
                            <ul className="list-disc pl-5">
                                {recommendedRecipes.map((recipe, idx) => (
                                    <li key={idx} className="mb-4">
                                        <p className="font-semibold">🥘 {recipe.recipe_name} (⏱ {recipe.time_to_cook} mins)</p>
                                        <p><strong>Using:</strong> {recipe.item}</p>
                                        <p><strong>Instructions:</strong> {recipe.instructions}</p>
                                        <p><strong>Extras:</strong> {recipe.additional_ingredients.join(", ")}</p>
                                    </li>
                                ))}
                            </ul>
                            <button
                                    onClick={downloadRecipesAsPDF}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-full flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-9 3h14a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2h9z" />
                                    </svg>
                                    PDF
                                </button>
                        </div>
                    )}
                </div>
            )}

            {/* Decoration Images Left */}
            <div className="absolute top-32 left-10 flex flex-col gap-8 z-0">
                <img src="/sg1.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
                <img src="/sg2.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
            </div>

            {/* Decoration Images Right */}
            <div className="absolute top-32 right-10 flex flex-col gap-8 z-0">
                <img src="/sg3.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg -rotate-2" />
                <img src="/sg4.jpg" alt="Decoration" className="w-60 h-40 object-cover rounded-lg rotate-2" />
            </div>

            {/* Upload Box */}
            <div className="relative z-10 max-w-3xl mx-auto bg-gradient-to-br from-rose-50 via-orange-50 to-lime-50 rounded-2xl p-8 shadow-xl backdrop-blur-md">
                <h2 className="text-2xl font-semibold text-center mb-6 text-rose-600">
                    Upload Your Grocery Receipt Image
                </h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full mb-6 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-100 file:text-rose-700 hover:file:bg-rose-200"
                />

                <div className="flex justify-center">
                    <button
                        onClick={handleExtractItems}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
                    >
                        🛒 Extract Items
                    </button>
                </div>
            </div>
            
            <div className="text-center mt-8">
                <button
                    onClick={startVoiceRecognition}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    🎙️ {listening ? "Listening..." : "Add via Voice"}
                </button>

                {recognitionResult && (
                    <p className="mt-2 text-sm text-gray-600 italic">
                        🗣️ Heard: "{recognitionResult}"
                    </p>
                )}
            </div>

            {/* Extracted Items */}
            {extractedItems.length > 0 && (
                <div className="mt-12 max-w-5xl mx-auto">
                    <h3 className="text-3xl font-bold text-center text-rose-700 mb-6">
                        Extracted Items
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {extractedItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-yellow-100 rounded-2xl shadow-lg border border-white/30 backdrop-blur-md hover:scale-105 transition-transform duration-300"
                            >
                                <h4 className="font-bold text-lg text-gray-900">{item}</h4>
                                <label className="block text-sm mt-2 text-gray-600">
                                    Expiry Date:
                                    <input
                                        type="date"
                                        value={expiryDates[item] || ""}
                                        onChange={(e) => handleExpiryDateChange(item, e.target.value)}
                                        className="mt-1 block w-full p-1 text-sm border rounded-md focus:ring-rose-400 focus:border-rose-400"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleSaveToFirestore}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl shadow-lg transition duration-200"
                        >
                            💾 Save Expiry Dates
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SmartGrocery;