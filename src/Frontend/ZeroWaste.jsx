// import React, { useState } from "react";
// import axios from "axios";

// const SmartGrocery = ({ groceryItems }) => {
//   const [itemStatus, setItemStatus] = useState({});
//   const [suggestions, setSuggestions] = useState([]);

//   const handleStatusChange = (item, status) => {
//     setItemStatus((prev) => ({ ...prev, [item]: status }));
//   };

//   const analyzeWaste = async () => {
//     const wasted = Object.entries(itemStatus)
//       .filter(([_, status]) => status === "wasted")
//       .map(([item]) => item);

//     try {
//       const res = await axios.post("http://localhost:5000/analyze-waste", {
//         wasted_items: wasted,
//       });
//       setSuggestions(res.data.suggestions);
//     } catch (err) {
//       alert("Error analyzing waste: " + err.message);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Mark Grocery Item Usage</h2>
//       <ul className="mb-6 space-y-3">
//         {groceryItems.map((item) => (
//           <li key={item} className="flex items-center justify-between">
//             <span className="font-medium">{item}</span>
//             <select
//               value={itemStatus[item] || ""}
//               onChange={(e) => handleStatusChange(item, e.target.value)}
//               className="border px-2 py-1"
//             >
//               <option value="">Select Status</option>
//               <option value="wasted">Wasted</option>
//               <option value="not_used">Not Used</option>
//               <option value="utilized">Utilized</option>
//             </select>
//           </li>
//         ))}
//       </ul>
//       <button
//         onClick={analyzeWaste}
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Analyze Waste
//       </button>

//       {suggestions.length > 0 && (
//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-2">Suggestions to Reduce Waste:</h3>
//           <ul className="list-disc pl-6">
//             {suggestions.map((tip, idx) => (
//               <li key={idx}>{tip}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SmartGrocery;
// import React, { useState } from 'react';
// import axios from 'axios';

// export default function SmartGrocery() {
//   const [image, setImage] = useState(null);
//   const [items, setItems] = useState([]);
//   const [statusMap, setStatusMap] = useState({});
//   const [solutions, setSolutions] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleImageUpload = (e) => {
//     setImage(e.target.files[0]);
//     setItems([]);
//     setSolutions([]);
//   };

//   const extractItems = async () => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('image', image);

//     try {
//       const res = await axios.post('http://localhost:5000/extract-items', formData);
//       const groceryItems = res.data.grocery_items || [];
//       setItems(groceryItems);
//       const initialMap = {};
//       groceryItems.forEach(item => {
//         initialMap[item] = 'utilized';
//       });
//       setStatusMap(initialMap);
//     } catch (error) {
//       console.error(error);
//       alert('Failed to extract items');
//     }
//     setLoading(false);
//   };

//   const handleStatusChange = (item, status) => {
//     setStatusMap({ ...statusMap, [item]: status });
//   };

//   const getWasteSolutions = async () => {
//     const wastedItems = Object.keys(statusMap).filter(item => statusMap[item] === 'wasted');
//     if (wastedItems.length === 0) return alert('No wasted items to analyze.');
  
//     try {
//       const res = await axios.post("http://localhost:5000/analyze-waste", {
//         wasted_items: wastedItems
//       });
  
//       console.log("✅ Suggestions:", res.data.suggestions);
  
//       setSolutions(res.data.suggestions || []); // ✅ this was previously using 'solutions' key incorrectly
//     } catch (error) {
//       console.error("❌ AxiosError:", error);
//       alert('Error getting suggestions');
//     }
//   };
  
//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-4">Smart Grocery Analyzer</h1>

//       <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
//       <button onClick={extractItems} disabled={!image || loading} className="bg-blue-500 text-white px-4 py-2 rounded">
//         {loading ? 'Extracting...' : 'Extract Items'}
//       </button>

//       {items.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-lg font-medium mb-2">Classify Each Item</h2>
//           <div className="grid gap-2">
//             {items.map((item, idx) => (
//               <div key={idx} className="flex justify-between items-center border rounded p-2">
//                 <span>{item}</span>
//                 <select
//                   value={statusMap[item] || 'utilized'}
//                   onChange={(e) => handleStatusChange(item, e.target.value)}
//                   className="border px-2 py-1"
//                 >
//                   <option value="utilized">Utilized</option>
//                   <option value="wasted">Wasted</option>
//                   <option value="not used">Not Used</option>
//                 </select>
//               </div>
//             ))}
//           </div>

//           <button onClick={getWasteSolutions} className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
//             Get Suggestions for Wasted Items
//           </button>
//         </div>
//       )}

//       {solutions.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-lg font-semibold mb-2">Suggestions</h2>
//           <ul className="list-disc pl-6">
//             {solutions.map((s, idx) => <li key={idx}>{s}</li>)}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState } from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import Lottie from "lottie-react";

// import mealAnimation from '../assets/Waste.json'; 

// const gradientCards = [
//     "from-pink-200 via-pink-300 to-pink-400",
//     "from-green-200 via-green-300 to-green-400",
//     "from-blue-200 via-blue-300 to-blue-400",
//     "from-yellow-200 via-yellow-300 to-yellow-400",
//     "from-purple-200 via-purple-300 to-purple-400",
//     "from-orange-200 via-orange-300 to-orange-400",
//     "from-emerald-200 via-emerald-300 to-emerald-400",
//     "from-cyan-200 via-cyan-300 to-cyan-400",
//   ];
  
//   import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
//     ResponsiveContainer
//   } from "recharts";
  
//   const lottieOptions = {
//     loop: true,
//     autoplay: true,
//     animationData: mealAnimation,
//     rendererSettings: {
//       preserveAspectRatio: 'xMidYMid slice',
//     },
//   };
// const SmartGrocery = () => {
//   const [groceryItems, setGroceryItems] = useState([]);
//   const [itemStatus, setItemStatus] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [file, setFile] = useState(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select an image to upload');
//       return;
//     }

//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append('image', file);

//     try {
//       const response = await fetch('http://localhost:5000/extract-items', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.error) throw new Error(data.error);

//       setGroceryItems(data.grocery_items);

//       const initialStatus = {};
//       data.grocery_items.forEach(item => {
//         initialStatus[item] = 'not_used';
//       });
//       setItemStatus(initialStatus);
//     } catch (error) {
//       console.error('Error extracting grocery items:', error);
//       alert('Failed to extract items from the grocery list image');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const analyzeWaste = async () => {
//   //   setIsAnalyzing(true);

//   //   try {
//   //     const wastedItems = Object.keys(itemStatus).filter(
//   //       item => itemStatus[item] === 'wasted'
//   //     );

//   //     if (wastedItems.length === 0) {
//   //       alert('Please mark at least one item as wasted before analyzing.');
//   //       setIsAnalyzing(false);
//   //       return;
//   //     }

//   //     const response = await fetch('http://localhost:5000/analyze_waste', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ wasted_items: wastedItems }),
//   //     });

//   //     const data = await response.json();

//   //     if (data.error) throw new Error(data.error);

//   //     setSuggestions(data.suggestions);
//   //   } catch (error) {
//   //     console.error('Error analyzing waste:', error);
//   //     alert('Failed to analyze waste');
//   //   } finally {
//   //     setIsAnalyzing(false);
//   //   }
//   // };
//   const analyzeWaste = async () => {
//     setIsAnalyzing(true);
  
//     try {
//       const wastedItems = Object.keys(itemStatus).filter(
//         (item) => itemStatus[item] === 'wasted'
//       );
  
//       if (wastedItems.length === 0) {
//         alert('Please mark at least one item as wasted before analyzing.');
//         setIsAnalyzing(false);
//         return;
//       }
  
//       const response = await fetch('http://localhost:5000/analyze_waste', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ wasted_items: wastedItems }),
//       });
  
//       const data = await response.json();
  
//       if (data.error) throw new Error(data.error);
  
//       // Assuming the response structure is now an array of suggestions
//       // Example format:
//       // [
//       //   { "item": "bread", "smart_shopping_tip": "...", "storage_tip": "...", "creative_recipe": "...", "extended_shelf_life_advice": "..." },
//       //   ...
//       // ]
  
//       // Set the suggestions state
//       setSuggestions(data.suggestions);
//     } catch (error) {
//       console.error('Error analyzing waste:', error);
//       alert('Failed to analyze waste');
//     } finally {
//       setIsAnalyzing(false);
//     }
//   };
  
//   const getInsightLine = () => {
//     const status = getStatusData();
//     const wasted = status.find(s => s.name === 'Wasted')?.value || 0;
//     const utilized = status.find(s => s.name === 'Utilized')?.value || 0;
//     const unused = status.find(s => s.name === 'Unused')?.value || 0;
  
//     if (wasted > utilized && wasted > unused) {
//       return "😬 More groceries went to waste than use... Time to rethink the list!";
//     } else if (utilized > wasted && utilized > unused) {
//       return "🎉 Great job! Most groceries were put to good use!";
//     } else if (unused > wasted && unused > utilized) {
//       return "🤔 Lots of unused items... maybe buy less next time?";
//     } else {
//       return "📦 Balanced usage, but there's still room to improve!";
//     }
//   };
//   const downloadPDF = async () => {
//     const element = document.getElementById('suggestions-section');
//     if (!element) return;

//     const canvas = await html2canvas(element);
//     const imgData = canvas.toDataURL('image/png');

//     const pdf = new jsPDF({
//       orientation: 'portrait',
//       unit: 'px',
//       format: 'a4',
//     });

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth - 20, pdfHeight);
//     pdf.save('waste_suggestions.pdf');
//   };

//   const handleStatusChange = (item, status) => {
//     setItemStatus(prev => ({
//       ...prev,
//       [item]: status
//     }));
//   };

//   const Button = ({ children, onClick, disabled, className, variant }) => {
//     const baseStyle = "px-4 py-2 rounded font-medium text-sm flex items-center justify-center";
//     const variantStyles = {
//       default: "bg-blue-600 text-white hover:bg-blue-700",
//       outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//     };

//     return (
//       <button 
//         className={`${baseStyle} ${variantStyles[variant || 'default']} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`}
//         onClick={onClick}
//         disabled={disabled}
//       >
//         {children}
//       </button>
//     );
//   };

//   const renderStatusButtons = (item) => {
//     const statuses = [
//       { value: 'utilized', icon: '✔️', label: 'Utilized' },
//       { value: 'wasted', icon: '❌', label: 'Wasted' },
//       { value: 'not_used', icon: '❓', label: 'Not Used' }
//     ];

//     return (
//       <div className="flex gap-2">
//         {statuses.map(status => (
//           <Button
//             key={status.value}
//             variant={itemStatus[item] === status.value ? "default" : "outline"}
//             onClick={() => handleStatusChange(item, status.value)}
//             className="flex items-center gap-1"
//           >
//             <span>{status.icon}</span>
//             <span>{status.label}</span>
//           </Button>
//         ))}
//       </div>
//     );
//   };
//   const getStatusData = () => {
//     const counts = { utilized: 0, wasted: 0, not_used: 0 };
  
//     Object.values(itemStatus).forEach(status => {
//       counts[status] += 1;
//     });
  
//     return [
//       { name: "Utilized", value: counts.utilized },
//       { name: "Wasted", value: counts.wasted },
//       { name: "Not Used", value: counts.not_used }
//     ];
//   };
  
//   const statusColors = {
//     Utilized: "#34d399",    // green
//     Wasted: "#f87171",      // red
//     "Not Used": "#fbbf24"   // yellow
//   };
  
//   return (
//     // <div className="max-w-4xl mx-auto p-4 space-y-6">
//     //   <div className="bg-white rounded-lg shadow p-6">
//     //     <h2 className="text-xl font-bold mb-4">Grocery Waste Tracker</h2>
//     //     <div className="space-y-4">
//     //       <div>
//     //         <label className="block text-sm font-medium mb-2">
//     //           Upload your grocery list image
//     //         </label>
//     //         <div className="flex items-center gap-2">
//     //           <input
//     //             type="file"
//     //             id="grocery-list"
//     //             className="hidden"
//     //             onChange={handleFileChange}
//     //             accept="image/*"
//     //           />
//     //           <label 
//     //             htmlFor="grocery-list" 
//     //             className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//     //           >
//     //             📤 Select Image
//     //           </label>
//     //           <span className="text-sm text-gray-500">
//     //             {file ? file.name : 'No image selected'}
//     //           </span>
//     //         </div>
//     //         <Button 
//     //           className="mt-2"
//     //           onClick={handleUpload}
//     //           disabled={isLoading || !file}
//     //         >
//     //           {isLoading ? (
//     //             <>⏳ Extracting Items...</>
//     //           ) : (
//     //             <>Extract Items</>
//     //           )}
//     //         </Button>
//     //       </div>

//     //       {groceryItems.length > 0 && (
//     //         <div className="mt-6">
//     //           <h3 className="text-lg font-medium mb-4">Mark item status:</h3>
//     //           <div className="space-y-4">
//     //             {groceryItems.map((item, index) => (
//     //               <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-md">
//     //                 <span className="font-medium mb-2 sm:mb-0">{item}</span>
//     //                 {renderStatusButtons(item)}
//     //               </div>
//     //             ))}
//     //           </div>

//     //           <Button 
//     //             className="mt-4"
//     //             onClick={analyzeWaste}
//     //             disabled={isAnalyzing || Object.keys(itemStatus).length === 0}
//     //           >
//     //             {isAnalyzing ? (
//     //               <>🔍 Analyzing Waste...</>
//     //             ) : (
//     //               <>Analyze Waste →</>
//     //             )}
//     //           </Button>
//     //         </div>
//     //       )}
//     //     </div>
//     //   </div>

//     //   {suggestions.length > 0 && (
//     //     <div className="bg-white rounded-lg shadow p-6" id="suggestions-section">
//     //       <h2 className="text-xl font-bold mb-4">Waste Reduction Suggestions</h2>
//     //       <ul className="list-disc pl-5 space-y-2">
//     //         {suggestions.map((suggestion, index) => (
//     //           <li key={index}>{suggestion}</li>
//     //         ))}
//     //       </ul>
//     //       <Button 
//     //         className="mt-4"
//     //         onClick={downloadPDF}
//     //         variant="outline"
//     //       >
//     //         📄 Download as PDF
//     //       </Button>
//     //     </div>
//     //   )}
//     // </div>
//     <div className="max-w-5xl mx-auto p-6 space-y-8 rounded-2xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 backdrop-blur-md shadow-xl">
//       <div className="bg-gradient-to-br from-yellow-300 via-orange-300 to-pink-400
//  rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl">
//         <h2 className="text-3xl font-extrabold text-gray-800 mb-6">🥬 Grocery Waste Tracker</h2>
        
//         <div className="space-y-6">
//           {/* File Upload */}
//           <div>
//             <label className="block text-lg font-semibold text-gray-700 mb-3">
//               Upload your grocery list image
//             </label>
//             <div className="flex flex-wrap items-center gap-4">
//               <input
//                 type="file"
//                 id="grocery-list"
//                 className="hidden"
//                 onChange={handleFileChange}
//                 accept="image/*"
//               />
//               <label 
//                 htmlFor="grocery-list" 
//                 className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-300 text-base font-medium text-gray-800 bg-gray-50 hover:bg-gray-100 transition"
//               >
//                 📤 Select Image
//               </label>
//               <span className="text-base text-gray-500 italic">
//                 {file ? file.name : 'No image selected'}
//               </span>
//             </div>
//             <Button 
//               className="mt-4 text-base px-6 py-2"
//               onClick={handleUpload}
//               disabled={isLoading || !file}
//             >
//               {isLoading ? (
//                 <>⏳ Extracting Items...</>
//               ) : (
//                 <>Extract Items</>
//               )}
//             </Button>
//           </div>

//           {/* Grocery Items with Status */}
//           <div 
//   className="relative min-h-screen bg-cover bg-center bg-no-repeat py-12 px-6"
//   style={{ backgroundImage: `url('/grocery.jpg')` }}
// >
//   <div className="bg-white/60 backdrop-blur-md max-w-2xl mx-auto p-4 rounded-2xl shadow-2xl">
//     {groceryItems.length > 0 && (
//       <div>
//         <h3 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">✅ Mark Item Status</h3>
//         <div className="space-y-5">
//           {groceryItems.map((item, index) => (
//             <div 
//               key={index} 
//               className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/80 hover:bg-white/90 p-4 rounded-xl border border-gray-300 transition shadow"
//             >
//               <span className="font-semibold text-lg text-gray-800 mb-2 sm:mb-0">{item}</span>
//               {renderStatusButtons(item)}
//             </div>
//           ))}
//         </div>
//         {/* <Button 
//           className="mt-8 bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//           onClick={analyzeWaste}
//           disabled={isAnalyzing || Object.keys(itemStatus).length === 0}
//         >
//           {isAnalyzing ? (
//             <>🔍 Analyzing Waste...</>
//           ) : (
//             <>Analyze Waste →</>
//           )}
//         </Button> */}
//         {/* <div className="flex flex-col items-center mt-8">
//   {isAnalyzing ? (
//     <div className="flex flex-col items-center">
//       <Lottie options={lottieOptions} height={200} width={200} />
//     </div>
//   ) : (
//     <button
//       className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//       onClick={analyzeWaste}
//       disabled={Object.keys(itemStatus).length === 0}
//     >
//       Analyze Waste →
//     </button>
//   )}
// </div> */}
// <div className="flex flex-col items-center mt-8">
//   {isAnalyzing ? (
//     <div className="flex flex-col items-center">
//       <Lottie
//         animationData={mealAnimation}
//         loop
//         autoplay
//         className="w-52 h-52"
//       />
//     </div>
//   ) : (
//     <button
//       className="bg-green-600 hover:bg-green-700 text-white text-lg font-medium px-8 py-3 rounded-xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
//       onClick={analyzeWaste}
//       disabled={Object.keys(itemStatus).length === 0}
//     >
//       Analyze Waste →
//     </button>
//   )}
// </div>
//       </div>
//     )}
//     {Object.keys(itemStatus).length > 0 && (
//   <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border-2 border-purple-300 mt-4">
//     <h3 className="text-3xl font-extrabold mb-6 text-purple-700 text-center tracking-wide drop-shadow-lg">
//       📊 Grocery Usage Overview
//     </h3>
//     <p className="text-center text-xl font-serif font-semibold mb-6 text-red-600 animate-bounce">
//       {getInsightLine()}
//     </p>
//     <ResponsiveContainer width="100%" height={350}>
//       <PieChart>
//         <Pie
//           data={getStatusData()}
//           cx="50%"
//           cy="50%"
//           innerRadius={80}
//           outerRadius={120}
//           fill="#ff69b4"
//           paddingAngle={5}
//           dataKey="value"
//           label={({ name, percent, value }) =>
//             `${name}: ${(percent * 100).toFixed(1)}% (${value})`
//           }
//           labelStyle={{ fontSize: '16px', fontWeight: 'bold', fill: '#333' }}
//         >
//           {getStatusData().map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={statusColors[entry.name] || getRandomBrightColor()} />
//           ))}
//         </Pie>
//         <Tooltip
//           contentStyle={{ backgroundColor: '#fff', borderColor: '#ccc' }}
//           itemStyle={{ color: '#000', fontWeight: 'bold' }}
//         />
//         <Legend
//           verticalAlign="bottom"
//           height={40}
//           wrapperStyle={{
//             fontSize: '16px',
//             fontWeight: '600',
//             color: '#444',
//           }}
//         />
//       </PieChart>
//     </ResponsiveContainer>
//   </div>
// )}

//   </div>
// </div>

//         </div>
//       </div>

//       {/* Suggestions Section */}
//       {/* {suggestions.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl" id="suggestions-section">
//           <h2 className="text-3xl font-extrabold text-gray-800 mb-6 font-Amatic SC">♻️ Waste Reduction Suggestions</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {suggestions.map((suggestion, index) => (
//               <div
//                 key={index}
//                 className={`bg-gradient-to-r ${
//                   gradientCards[index % gradientCards.length]
//                 } p-5 rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg`}
//               >
//                 <p className="text-lg font-semibold text-black font-Pacifico ">
//                   💡 {suggestion}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <Button 
//             className="mt-6  text-red-700 border-4 border-red-400 font-bold text-2xl px-6 py-2"
//             onClick={downloadPDF}
//             variant="outline"
//           >
//             📄 Download as PDF
//           </Button>
//         </div>
//       )} */}
//       {Array.isArray(suggestions) && suggestions.length > 0 && (
//   <div className="bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl" id="suggestions-section">
//     <h2 className="text-3xl font-extrabold text-gray-800 mb-6 font-Amatic SC">♻️ Waste Reduction Suggestions</h2>

//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//       {suggestions.map((suggestion, index) => (
//         <div
//           key={index}
//           className={`bg-gradient-to-r ${
//             gradientCards[index % gradientCards.length]
//           } p-5 rounded-xl shadow-md transition transform hover:scale-105 hover:shadow-lg`}
//         >
//           <h3 className="text-xl font-bold text-black mb-2 font-Pacifico">🧺 {suggestion.item}</h3>

//           <p className="text-md font-medium text-gray-800 mb-2">
//             🛒 <span className="font-semibold">Smart Shopping Tip:</span> {suggestion.smart_shopping_tip}
//           </p>

//           <p className="text-md font-medium text-gray-800 mb-2">
//             🧊 <span className="font-semibold">Storage Tip:</span> {suggestion.storage_tip}
//           </p>

//           <p className="text-md font-medium text-gray-800 mb-2">
//             🍽️ <span className="font-semibold">Creative Recipe:</span> {suggestion.creative_recipe}
//           </p>

//           <p className="text-md font-medium text-gray-800">
//             🧼 <span className="font-semibold">Extended Shelf-life Advice:</span> {suggestion.extended_shelf_life_advice}
//           </p>
//         </div>
//       ))}
//     </div>

//     <Button 
//       className="mt-6 text-red-700 border-4 border-red-400 font-bold text-2xl px-6 py-2"
//       onClick={downloadPDF}
//       variant="outline"
//     >
//       📄 Download as PDF
//     </Button>
//   </div>
// )}


//     </div>
//   );
// };

// export default SmartGrocery;


// import React, { useState, useEffect } from "react";
// import { db } from "../firebaseConfig";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ZeroWaste = () => {
//     const [expiringSoon, setExpiringSoon] = useState([]);
//     const [wastedItemsStats, setWastedItemsStats] = useState([]);
//     const [statusStats, setStatusStats] = useState([]);
//     const user = JSON.parse(localStorage.getItem("user"));
// const [markedItems, setMarkedItems] = useState([]);

//     useEffect(() => {
//         if (user?.uid) {
//             fetchExpiringItems();
//             fetchWastedItemsStats();
//         }
//     }, [user]);

//     const fetchWastedItemsStats = async () => {
//         if (!user?.uid) return;

//         try {
//             const itemsRef = collection(db, "users", user.uid, "expiryItems");
//             const itemsSnapshot = await getDocs(itemsRef);

//             const itemCounts = {};
//             const statusCounts = {
//                 used: 0,
//                 unused: 0,
//                 wasted: 0
//             };
            
//             itemsSnapshot.forEach((doc) => {
//                 const data = doc.data();
                
//                 // Count items by status
//                 const status = data.status || "unused";
//                 statusCounts[status] = (statusCounts[status] || 0) + 1;
                
//                 // Count wasted items for top 5
//                 if (data.status === "wasted") {
//                     // Track top items
//                     const itemName = data.name?.trim().toLowerCase();
//                     if (itemName) {
//                         itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
//                     }
//                 }
//             });

//             // Top 5 wasted items
//             const sortedItems = Object.entries(itemCounts)
//                 .map(([name, count]) => ({ name, count }))
//                 .sort((a, b) => b.count - a.count)
//                 .slice(0, 5);

//             // Convert status counts to array for PieChart
//             const statusStatsArray = Object.entries(statusCounts).map(([status, count]) => ({
//                 name: status.charAt(0).toUpperCase() + status.slice(1),
//                 value: count
//             }));

//             setWastedItemsStats(sortedItems);
//             setStatusStats(statusStatsArray);
//         } catch (error) {
//             console.error("Error fetching wasted items stats:", error);
//         }
//     };

//     const fetchExpiringItems = async () => {
//         if (!user?.uid) return;

//         try {
//             const itemsRef = collection(db, "users", user.uid, "expiryItems");
//             const itemsSnapshot = await getDocs(itemsRef);
            
//             const items = [];
//             itemsSnapshot.forEach((doc) => {
//                 const data = doc.data();
//                 items.push({
//                     id: doc.id,
//                     ...data
//                 });
//             });
            
//             setExpiringSoon(items);
//         } catch (error) {
//             console.error("Error fetching expiring items:", error);
//         }
//     };

//     const handleItemStatusChange = async (itemId, status) => {
//         if (!user?.uid) return alert("User not logged in.");
        
//         try {
//             const itemRef = doc(db, "users", user.uid, "expiryItems", itemId);
//             await updateDoc(itemRef, {
//                 status: status,
//                 statusUpdatedAt: new Date().toISOString()
//             });
            
//             toast.success(`Item marked as ${status}!`);

//             fetchWastedItemsStats(); // Refresh stats after update
//             fetchExpiringItems(); // Refresh items list
//         } catch (err) {
//             console.error("Error updating item status:", err);
//             alert("Failed to update item status.");
//         }
//     };

//     // Calculate saved items and waste percentages
//     const calculateStats = () => {
//         const usedItems = statusStats.find(item => item.name === "Used")?.value || 0;
//         const wastedItems = statusStats.find(item => item.name === "Wasted")?.value || 0;
//         // const totalTracked = usedItems + wastedItems;
//         const unusedItems = statusStats.find(item => item.name === "Unused")?.value || 0;
// const totalTracked = usedItems + wastedItems + unusedItems;

//         if (totalTracked === 0) return { 
//             used: { count: 0, percentage: 0 },
//             wasted: { count: 0, percentage: 0 },
//             message: ""
//         };
        
//         const usedPercentage = Math.round((usedItems / totalTracked) * 100);
//         const wastedPercentage = Math.round((wastedItems / totalTracked) * 100);
        
//         // Generate a feedback message based on percentages
//         let message = "";
//         if (wastedPercentage >= 50) {
//             message = "You're wasting too much food! Try planning your meals better.";
//         } else if (wastedPercentage >= 25) {
//             message = "Room for improvement! Try to reduce your food waste.";
//         } else if (usedPercentage >= 75) {
//             message = "Amazing job! You're a food waste warrior!";
//         } else {
//             message = "Good progress! Keep using items before they expire.";
//         }
        
//         return {
//             used: { count: usedItems, percentage: usedPercentage },
//             wasted: { count: wastedItems, percentage: wastedPercentage },
//             message
//         };
//     };

//     const stats = calculateStats();

//     // Colors for the donut chart
//     const COLORS = {
//         "Used": "#22c55e",    // Green
//         "Unused": "#3b82f6",  // Blue
//         "Wasted": "#ef4444"   // Red
//     };

//     return (
//         <div className="relative bg-gradient-to-br from-lime-100 via-teal-100 to-emerald-100 min-h-screen py-16 px-6">
//             <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600">
//                 ♻️ Zero Waste Kitchen
//             </h1>

//             {/* Status Distribution Donut Chart */}
//             {statusStats.length > 0 ? (
//                 <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
//                     <h3 className="text-xl font-bold text-center text-teal-600 mb-4">
//                         🍩 Item Status Distribution
//                     </h3>
//                     <div className="flex flex-col md:flex-row items-center justify-center">
//                         <div className="w-full md:w-1/2 h-64">
//                             <ResponsiveContainer width="100%" height="100%">
//                                 <PieChart>
//                                     <Pie
//                                         data={statusStats}
//                                         cx="50%"
//                                         cy="50%"
//                                         innerRadius={60}
//                                         outerRadius={80}
//                                         paddingAngle={5}
//                                         dataKey="value"
//                                         label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                                     >
//                                         {statusStats.map((entry, index) => (
//                                             <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
//                                         ))}
//                                     </Pie>
//                                     <Tooltip formatter={(value, name) => [value, name]} />
//                                     <Legend />
//                                 </PieChart>
//                             </ResponsiveContainer>
//                         </div>
//                         <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
//                             {stats.used.count > 0 || stats.wasted.count > 0 ? (
//                                 <div className="text-center">
//                                     <p className={`text-2xl font-bold ${
//                                         stats.wasted.percentage >= 50 ? 'text-red-600' : 
//                                         stats.wasted.percentage >= 25 ? 'text-amber-600' : 'text-green-600'
//                                     }`}>
//                                         {stats.wasted.percentage >= 50 ? '😟' : 
//                                          stats.wasted.percentage >= 25 ? '🤔' : '🎉'}
//                                         {' '}{stats.message}
//                                     </p>
//                                     <p className="text-lg mt-2">
//                                         You've used <span className="font-bold text-green-600">{stats.used.count} items</span> before they expired!
//                                     </p>
//                                     <p className="text-lg mt-1">
//                                         That's <span className="font-bold text-green-600">{stats.used.percentage}%</span> of your tracked consumption.
//                                     </p>
//                                     {stats.wasted.count > 0 && (
//                                         <p className="text-lg mt-2">
//                                             However, you've wasted <span className="font-bold text-red-600">{stats.wasted.count} items</span> 
//                                             (<span className="font-bold text-red-600">{stats.wasted.percentage}%</span>).
//                                             {stats.wasted.percentage > 20 && " Try to reduce this!"}
//                                         </p>
//                                     )}
//                                 </div>
//                             ) : (
//                                 <p className="text-center text-gray-600">
//                                     Start tracking your items to see statistics on how much you're saving!
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
//                     No status data available yet. Start tracking your items to generate statistics.
//                 </div>
//             )}

//             {/* Top 5 Wasted Items Chart */}
//             {wastedItemsStats.length > 0 ? (
//                 <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
//                     <h3 className="text-xl font-bold text-center text-red-600 mb-4">
//                         📊 Top 5 Wasted Items
//                     </h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={wastedItemsStats} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="name" angle={-45} textAnchor="end" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend verticalAlign="top" />
//                             <Bar dataKey="count" name="Times Wasted" fill="#ef4444" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                     <p className="text-center text-gray-500 text-sm mt-2">
//                         Track your food waste to reduce your environmental impact and save money
//                     </p>
//                 </div>
//             ) : (
//                 <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
//                     No waste data available yet. Start tracking your items to generate statistics.
//                 </div>
//             )}

//             {/* All Items Management */}
//             <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold text-emerald-700 mb-4">🥦 Item Status Management</h3>
                
//                 {expiringSoon.length > 0 ? (
//                     <ul className="divide-y divide-gray-200">
//                         {expiringSoon.map((item, idx) => (
//                             <li key={idx} className="flex flex-wrap items-center gap-2 py-4">
//                                 <div className="flex-1">
//                                     <strong>{item.name}</strong> – Expiry: {item.expiryDate}
//                                     {new Date(item.expiryDate) < new Date() ? (
//                                         <span className="text-red-500 font-bold ml-2">Expired</span>
//                                     ) : (
//                                         <span className="text-green-500 ml-2">
//                                             {Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
//                                         </span>
//                                     )}
//                                     {item.status && (
//                                         <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
//                                             item.status === 'used' ? 'bg-green-200 text-green-800' : 
//                                             item.status === 'wasted' ? 'bg-red-200 text-red-800' : 
//                                             'bg-gray-200 text-gray-800'
//                                         }`}>
//                                             {item.status}
//                                         </span>
//                                     )}
//                                 </div>
//                                 <div className="flex gap-2 mt-1">
//                                     <button 
//                                         onClick={() => handleItemStatusChange(item.id, 'used')}
//                                         className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
//                                     >
//                                         Used
//                                     </button>
//                                     <button 
//                                         onClick={() => handleItemStatusChange(item.id, 'unused')}
//                                         className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
//                                     >
//                                         Unused
//                                     </button>
//                                     <button 
//                                         onClick={() => handleItemStatusChange(item.id, 'wasted')}
//                                         className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
//                                     >
//                                         Wasted
//                                     </button>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 ) : (
//                     <p className="text-center text-gray-500 py-4">
//                         No items found. Add grocery items with expiry dates to start tracking.
//                     </p>
//                 )}
//             </div>
            
//             <ToastContainer position="top-right" autoClose={3000} />
//             {/* Tips Section */}
//             <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
//                 <h3 className="text-xl font-bold text-teal-700 mb-4">🌱 Food Waste Reduction Tips</h3>
//                 <ul className="list-disc pl-5 space-y-2">
//                     <li>Plan your meals before shopping to avoid overbuying</li>
//                     <li>Store food properly to extend shelf life</li>
//                     <li>Check your refrigerator regularly and use oldest items first</li>
//                     <li>Learn to preserve foods through freezing, pickling, or canning</li>
//                     <li>Get creative with leftovers instead of throwing them away</li>
//                     <li>Consider composting food scraps when possible</li>
//                 </ul>
//             </div>
//             {markedItems.length > 0 && (
//     <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-64 z-50">
//         <h4 className="text-lg font-bold mb-2 text-teal-600">📦 Marked Items</h4>
//         <ul className="space-y-2 max-h-80 overflow-y-auto">
//             {markedItems.map((item) => (
//                 <li key={item.id} className="flex justify-between items-center text-sm">
//                     <span className="font-medium">{item.name}</span>
//                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${
//                         item.status === "used" ? "bg-green-100 text-green-700" :
//                         item.status === "wasted" ? "bg-red-100 text-red-700" :
//                         "bg-gray-100 text-gray-600"
//                     }`}>
//                         {item.status}
//                     </span>
//                 </li>
//             ))}
//         </ul>
//     </div>
// )}

//         </div>
//     );
// };

// export default ZeroWaste;



import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ZeroWaste = () => {
    const [expiringSoon, setExpiringSoon] = useState([]);
    const [wastedItemsStats, setWastedItemsStats] = useState([]);
    const [statusStats, setStatusStats] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));
    const [markedItems, setMarkedItems] = useState([]);
    const [wasteAnalysis, setWasteAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            fetchExpiringItems();
            fetchWastedItemsStats();
        }
    }, [user]);

    const fetchWastedItemsStats = async () => {
        if (!user?.uid) return;

        try {
            const itemsRef = collection(db, "users", user.uid, "expiryItems");
            const itemsSnapshot = await getDocs(itemsRef);

            const itemCounts = {};
            const statusCounts = {
                used: 0,
                unused: 0,
                wasted: 0
            };
            
            itemsSnapshot.forEach((doc) => {
                const data = doc.data();
                
                // Count items by status
                const status = data.status || "unused";
                statusCounts[status] = (statusCounts[status] || 0) + 1;
                
                // Count wasted items for top 5
                if (data.status === "wasted") {
                    // Track top items
                    const itemName = data.name?.trim().toLowerCase();
                    if (itemName) {
                        itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
                    }
                }
            });

            // Top 5 wasted items
            const sortedItems = Object.entries(itemCounts)
                .map(([name, count]) => ({ name, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Convert status counts to array for PieChart
            const statusStatsArray = Object.entries(statusCounts).map(([status, count]) => ({
                name: status.charAt(0).toUpperCase() + status.slice(1),
                value: count
            }));

            setWastedItemsStats(sortedItems);
            setStatusStats(statusStatsArray);
        } catch (error) {
            console.error("Error fetching wasted items stats:", error);
        }
    };

    const fetchExpiringItems = async () => {
        if (!user?.uid) return;

        try {
            const itemsRef = collection(db, "users", user.uid, "expiryItems");
            const itemsSnapshot = await getDocs(itemsRef);
            
            const items = [];
            itemsSnapshot.forEach((doc) => {
                const data = doc.data();
                items.push({
                    id: doc.id,
                    ...data
                });
            });
            
            setExpiringSoon(items);
        } catch (error) {
            console.error("Error fetching expiring items:", error);
        }
    };

    const handleItemStatusChange = async (itemId, status) => {
        if (!user?.uid) return alert("User not logged in.");
        
        try {
            const itemRef = doc(db, "users", user.uid, "expiryItems", itemId);
            await updateDoc(itemRef, {
                status: status,
                statusUpdatedAt: new Date().toISOString()
            });
            
            toast.success(`Item marked as ${status}!`);

            // If marked as wasted, add to markedItems list
            if (status === "wasted") {
                const item = expiringSoon.find(i => i.id === itemId);
                if (item) {
                    setMarkedItems(prev => [...prev, {
                        id: itemId,
                        name: item.name,
                        status: status,
                        expiryDate: item.expiryDate
                    }]);
                }
            }

            fetchWastedItemsStats(); // Refresh stats after update
            fetchExpiringItems(); // Refresh items list
        } catch (err) {
            console.error("Error updating item status:", err);
            alert("Failed to update item status.");
        }
    };

    const analyzeWaste = async () => {
        if (markedItems.length === 0) {
            toast.warning("No wasted items to analyze");
            return;
        }

        setIsAnalyzing(true);
        try {
            const wastedItemNames = markedItems.map(item => item.name);
            
            const response = await fetch('http://127.0.0.1:5000/analyze_waste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wasted_items: wastedItemNames
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setWasteAnalysis(data.suggestions);
                toast.success("Waste analysis completed!");
            } else {
                throw new Error(data.error || "Failed to analyze waste");
            }
        } catch (error) {
            console.error("Error analyzing waste:", error);
            toast.error(`Analysis failed: ${error.message}`);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearMarkedItems = () => {
        setMarkedItems([]);
        setWasteAnalysis(null);
    };

    // Calculate saved items and waste percentages
    const calculateStats = () => {
        const usedItems = statusStats.find(item => item.name === "Used")?.value || 0;
        const wastedItems = statusStats.find(item => item.name === "Wasted")?.value || 0;
        const unusedItems = statusStats.find(item => item.name === "Unused")?.value || 0;
        const totalTracked = usedItems + wastedItems + unusedItems;

        if (totalTracked === 0) return { 
            used: { count: 0, percentage: 0 },
            wasted: { count: 0, percentage: 0 },
            message: ""
        };
        
        const usedPercentage = Math.round((usedItems / totalTracked) * 100);
        const wastedPercentage = Math.round((wastedItems / totalTracked) * 100);
        
        // Generate a feedback message based on percentages
        let message = "";
        if (wastedPercentage >= 50) {
            message = "You're wasting too much food! Try planning your meals better.";
        } else if (wastedPercentage >= 25) {
            message = "Room for improvement! Try to reduce your food waste.";
        } else if (usedPercentage >= 75) {
            message = "Amazing job! You're a food waste warrior!";
        } else {
            message = "Good progress! Keep using items before they expire.";
        }
        
        return {
            used: { count: usedItems, percentage: usedPercentage },
            wasted: { count: wastedItems, percentage: wastedPercentage },
            message
        };
    };

    const stats = calculateStats();

    // Colors for the donut chart
    const COLORS = {
        "Used": "#22c55e",    // Green
        "Unused": "#3b82f6",  // Blue
        "Wasted": "#ef4444"   // Red
    };

    return (
        <div className="relative  min-h-screen py-16 px-6"style={{
          background: "linear-gradient(135deg, #00ff87 0%, #60efff 50%, #0061ff 100%)",
          minHeight: "100vh",
          padding: "4rem 1.5rem"}
        }>
            <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-black">
                ♻️ Zero Waste Kitchen
            </h1>

            {/* Status Distribution Donut Chart */}
            {statusStats.length > 0 ? (
                <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-center text-teal-600 mb-4">
                        🍩 Item Status Distribution
                    </h3>
                    <div className="flex flex-col md:flex-row items-center justify-center">
                        <div className="w-full md:w-1/2 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {statusStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name) => [value, name]} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
                            {stats.used.count > 0 || stats.wasted.count > 0 ? (
                                <div className="text-center">
                                    <p className={`text-2xl font-bold ${
                                        stats.wasted.percentage >= 50 ? 'text-red-600' : 
                                        stats.wasted.percentage >= 25 ? 'text-amber-600' : 'text-green-600'
                                    }`}>
                                        {stats.wasted.percentage >= 50 ? '😟' : 
                                         stats.wasted.percentage >= 25 ? '🤔' : '🎉'}
                                        {' '}{stats.message}
                                    </p>
                                    <p className="text-lg mt-2">
                                        You've used <span className="font-bold text-green-600">{stats.used.count} items</span> before they expired!
                                    </p>
                                    <p className="text-lg mt-1">
                                        That's <span className="font-bold text-green-600">{stats.used.percentage}%</span> of your tracked consumption.
                                    </p>
                                    {stats.wasted.count > 0 && (
                                        <p className="text-lg mt-2">
                                            However, you've wasted <span className="font-bold text-red-600">{stats.wasted.count} items</span> 
                                            (<span className="font-bold text-red-600">{stats.wasted.percentage}%</span>).
                                            {stats.wasted.percentage > 20 && " Try to reduce this!"}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-center text-gray-600">
                                    Start tracking your items to see statistics on how much you're saving!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    No status data available yet. Start tracking your items to generate statistics.
                </div>
            )}

            {/* Top 5 Wasted Items Chart */}
            {wastedItemsStats.length > 0 ? (
                <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-center text-red-600 mb-4">
                        📊 Top 5 Wasted Items
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={wastedItemsStats} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" />
                            <Bar dataKey="count" name="Times Wasted" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-center text-gray-500 text-sm mt-2">
                        Track your food waste to reduce your environmental impact and save money
                    </p>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    No waste data available yet. Start tracking your items to generate statistics.
                </div>
            )}

            {/* All Items Management */}
            <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">🥦 Item Status Management</h3>
                
                {expiringSoon.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {expiringSoon.map((item, idx) => (
                            <li key={idx} className="flex flex-wrap items-center gap-2 py-4">
                                <div className="flex-1">
                                    <strong>{item.name}</strong> – Expiry: {item.expiryDate}
                                    {new Date(item.expiryDate) < new Date() ? (
                                        <span className="text-red-500 font-bold ml-2">Expired</span>
                                    ) : (
                                        <span className="text-green-500 ml-2">
                                            {Math.floor((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left
                                        </span>
                                    )}
                                    {item.status && (
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                            item.status === 'used' ? 'bg-green-200 text-green-800' : 
                                            item.status === 'wasted' ? 'bg-red-200 text-red-800' : 
                                            'bg-gray-200 text-gray-800'
                                        }`}>
                                            {item.status}
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <button 
                                        onClick={() => handleItemStatusChange(item.id, 'used')}
                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                                    >
                                        Used
                                    </button>
                                    <button 
                                        onClick={() => handleItemStatusChange(item.id, 'unused')}
                                        className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-2 py-1 rounded"
                                    >
                                        Unused
                                    </button>
                                    <button 
                                        onClick={() => handleItemStatusChange(item.id, 'wasted')}
                                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                                    >
                                        Wasted
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">
                        No items found. Add grocery items with expiry dates to start tracking.
                    </p>
                )}
            </div>
            
            {/* Waste Analysis Section */}
            {wasteAnalysis && (
                <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-teal-700 mb-4">🧠 Smart Waste Analysis</h3>
                    <div className="space-y-6">
                        {wasteAnalysis.map((item, index) => (
                            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 font-serif">
                                <h4 className="text-xl font-bold text-black mb-2">{item.item}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <h5 className="font-semibold text-green-700">🛒 Smart Shopping Tip</h5>
                                        <p>{item.smart_shopping_tip}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <h5 className="font-semibold text-blue-700">🧊 Storage Tip</h5>
                                        <p>{item.storage_tip}</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <h5 className="font-semibold text-purple-700">🍳 Creative Recipe</h5>
                                        <p>{item.creative_recipe}</p>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg">
                                        <h5 className="font-semibold text-amber-700">⏳ Shelf Life Advice</h5>
                                        <p>{item.extended_shelf_life_advice}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tips Section
            <div className="max-w-4xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-teal-700 mb-4">🌱 Food Waste Reduction Tips</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Plan your meals before shopping to avoid overbuying</li>
                    <li>Store food properly to extend shelf life</li>
                    <li>Check your refrigerator regularly and use oldest items first</li>
                    <li>Learn to preserve foods through freezing, pickling, or canning</li>
                    <li>Get creative with leftovers instead of throwing them away</li>
                    <li>Consider composting food scraps when possible</li>
                </ul>
            </div> */}

            {/* Marked Items Sidebar */}
            {markedItems.length > 0 && (
                <div className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg w-64 z-50">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-md font-serif font-bold text-black">📦 Add Waste items to get waste reduction tips(Items-{markedItems.length})</h4>
                        <button 
                            onClick={clearMarkedItems}
                            className="text-md font-bold text-red-500 hover:text-red-700"
                        >
                            Clear
                        </button>
                    </div>
                    <ul className="space-y-2 max-h-80 overflow-y-auto">
                        {markedItems.map((item) => (
                            <li key={item.id} className="flex justify-between items-center text-sm">
                                <span className="font-medium font-serif">{item.name}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                                    item.status === "used" ? "bg-green-100 text-green-700" :
                                    item.status === "wasted" ? "bg-red-100 text-red-700" :
                                    "bg-gray-100 text-gray-600"
                                }`}>
                                    {item.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={analyzeWaste}
                        disabled={isAnalyzing}
                        className={`mt-4 w-full py-2 rounded-md text-white font-medium ${
                            isAnalyzing ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Get Waste Reduction Tips'}
                    </button>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ZeroWaste;