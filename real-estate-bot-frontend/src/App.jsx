// import { useState, useRef, useEffect } from "react";
// import axios from "axios";

// function App() {
//   const [showAgentSelection, setShowAgentSelection] = useState(true);
//   const [activeAgent, setActiveAgent] = useState(null);
//   const [agent1Text, setAgent1Text] = useState("");
//   const [agent1Image, setAgent1Image] = useState(null);
//   const [agent1History, setAgent1History] = useState([]);
//   const [agent2Text, setAgent2Text] = useState("");
//   const [agent2Location, setAgent2Location] = useState("");
//   const [agent2History, setAgent2History] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [typingIndex, setTypingIndex] = useState(0);
//   const [currentTypingMessage, setCurrentTypingMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const fileInputRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const messageInputRef = useRef(null);

//   // Auto-scroll to bottom of chat
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [agent1History, agent2History, currentTypingMessage]);

//   // Typewriter effect for the last message
//   useEffect(() => {
//     let history = activeAgent === "agent1" ? agent1History : agent2History;
//     if (history.length > 0 && isTyping) {
//       const lastMessage = history[history.length - 1];
//       if (lastMessage.role === "model") {
//         const content = lastMessage.content;
//         if (typingIndex < content.length) {
//           const timer = setTimeout(() => {
//             setCurrentTypingMessage(content.substring(0, typingIndex + 1));
//             setTypingIndex(typingIndex + 1);
//           }, 2); 
//           return () => clearTimeout(timer);
//         } else {
//           setIsTyping(false);
//         }
//       }
//     }
//   }, [agent1History, agent2History, typingIndex, isTyping, activeAgent, currentTypingMessage]);

//   const selectAgent = (agent) => {
//     setActiveAgent(agent);
//     setShowAgentSelection(false);
//     // Focus on input after transition
//     setTimeout(() => {
//       if (messageInputRef.current) {
//         messageInputRef.current.focus();
//       }
//     }, 500);
//   };

//   const resetToAgentSelection = () => {
//     setShowAgentSelection(true);
//     setActiveAgent(null);
//   };

//   const handleAgent1Submit = async () => {
//     if (!agent1Text && !agent1Image) return;
    
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("text", agent1Text);
//     if (agent1Image) formData.append("image", agent1Image);
//     formData.append("history", JSON.stringify(agent1History));
  
//     try {
//       const res = await axios.post("http://127.0.0.1:5000/api/agent1", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//         withCredentials: false
//       });
      
//       // Add user message immediately
//       const updatedHistory = [
//         ...agent1History,
//         { role: "user", content: agent1Text || "Image uploaded" },
//       ];
//       setAgent1History(updatedHistory);
      
//       // Add model response with typewriter effect
//       setTimeout(() => {
//         setTypingIndex(0);
//         setCurrentTypingMessage("");
//         setIsTyping(true);
//         setAgent1History([...updatedHistory, { role: "model", content: res.data.response }]);
//       }, 500);
      
//       setAgent1Text("");
//       setAgent1Image(null);
//       setImagePreview(null);
//       if (fileInputRef.current) fileInputRef.current.value = "";
//     } catch (err) {
//       console.error("API Error:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAgent2Submit = async () => {
//     if (!agent2Text) return;
    
//     setIsLoading(true);
//     try {
//       const res = await axios.post("http://localhost:5000/api/agent2", {
//         query: agent2Text,
//         location: agent2Location,
//         history: agent2History
//       });
      
//       // Add user message immediately
//       const updatedHistory = [
//         ...agent2History,
//         { role: "user", content: agent2Text },
//       ];
//       setAgent2History(updatedHistory);
      
//       // Add model response with typewriter effect
//       setTimeout(() => {
//         setTypingIndex(0);
//         setCurrentTypingMessage("");
//         setIsTyping(true);
//         setAgent2History([...updatedHistory, { role: "model", content: res.data.response }]);
//       }, 500);
      
//       setAgent2Text("");
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e, agent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       if (agent === "agent1") {
//         handleAgent1Submit();
//       } else {
//         handleAgent2Submit();
//       }
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setAgent1Image(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const renderChat = (history) => (
//     <div 
//       ref={chatContainerRef}
//       className="mt-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto p-3 rounded-lg bg-gradient-to-b from-gray-900 to-gray-950 scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
//     >
//       {history.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
//           <div className="w-20 h-20 mb-6 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-semibold text-white mb-2">Start a New Conversation</h3>
//           <p className="text-gray-400 max-w-sm">
//             {activeAgent === "agent1" 
//               ? "Upload images of property issues and get expert diagnosis and solutions" 
//               : "Ask any questions about tenancy, rental agreements, or housing laws"}
//           </p>
//         </div>
//       ) : (
//         history.map((item, idx) => {
//           const isLastModelMessage = idx === history.length - 1 && item.role === "model" && isTyping;
//           return (
//             <div
//               key={idx}
//               className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
//             >
//               <div className={`flex items-start max-w-[85%] gap-3 ${item.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                   item.role === "user" 
//                     ? "bg-blue-600" 
//                     : "bg-gradient-to-r from-teal-500 to-blue-500"
//                 }`}>
//                   {item.role === "user" ? (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                   ) : (
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
//                     </svg>
//                   )}
//                 </div>
                
//                 <div
//                   className={`p-4 rounded-xl shadow-md ${
//                     item.role === "user"
//                       ? "bg-blue-600 text-white rounded-tr-none"
//                       : "bg-gray-800 text-gray-200 rounded-tl-none border-l-2 border-teal-500"
//                   }`}
//                 >
//                   <p className="font-medium text-xs uppercase tracking-wider mb-1 opacity-80">
//                     {item.role === "user" ? "You" : activeAgent === "agent1" ? "Property Expert" : "Tenancy Advisor"}
//                   </p>
//                   <p className="whitespace-pre-wrap text-sm md:text-base">
//                     {isLastModelMessage ? currentTypingMessage : item.content}
//                     {isLastModelMessage && (
//                       <span className="inline-block ml-1 animate-pulse">▋</span>
//                     )}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           );
//         })
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex items-center justify-center p-4 overflow-hidden">
//       <div className={`w-full max-w-4xl transition-all duration-700 ease-in-out ${showAgentSelection ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'}`}>
//         {showAgentSelection && (
//           <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-gray-800">
//             <div className="p-8 text-center">
//               <div className="animate-float mb-6">
//                 <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 via-blue-500 to-teal-400 bg-clip-text text-transparent inline-block animate-gradient">
//                   PROPERTY<span className="text-white">LOOP</span>
//                 </h1>
//                 <div className="w-48 h-1 mx-auto bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mt-2"></div>
//               </div>
//               <p className="text-gray-400 mb-12 text-lg">Your intelligent real estate assistant</p>
              
//               <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
//                 <div 
//                   onClick={() => selectAgent("agent1")}
//                   className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border border-gray-700 group animate-fadeInUp"
//                   style={{animationDelay: "0.1s"}}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="p-8">
//                     <div className="w-20 h-20 mx-auto mb-6 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">Property Issue Detector</h2>
//                     <p className="text-gray-400 text-sm leading-relaxed">Upload images of property issues and get expert diagnosis and solutions</p>
                    
//                     <div className="mt-8 flex justify-center">
//                       <span className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-teal-600/20 rounded-full text-blue-400 text-sm font-medium group-hover:from-blue-600/30 group-hover:to-teal-600/30 transition-all">
//                         <span className="flex items-center gap-2">
//                           <span>Select Agent</span>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 <div 
//                   onClick={() => selectAgent("agent2")}
//                   className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl border border-gray-700 group animate-fadeInUp"
//                   style={{animationDelay: "0.3s"}}
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                   <div className="p-8">
//                     <div className="w-20 h-20 mx-auto mb-6 bg-teal-500/20 rounded-full flex items-center justify-center group-hover:bg-teal-500/30 transition-all">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                       </svg>
//                     </div>
//                     <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">Tenancy Advisor</h2>
//                     <p className="text-gray-400 text-sm leading-relaxed">Get answers to all your tenancy questions and legal advice</p>
                    
//                     <div className="mt-8 flex justify-center">
//                       <span className="px-4 py-2 bg-gradient-to-r from-teal-600/20 to-blue-600/20 rounded-full text-teal-400 text-sm font-medium group-hover:from-teal-600/30 group-hover:to-blue-600/30 transition-all">
//                         <span className="flex items-center gap-2">
//                           <span>Select Agent</span>
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                           </svg>
//                         </span>
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="p-8 text-center animate-fadeIn" style={{animationDelay: "0.5s"}}>
//               <div className="flex items-center justify-center gap-4 mb-4">
//                 <div className="w-10 h-1 bg-gradient-to-r from-blue-500 to-transparent rounded-full"></div>
//                 <p className="text-sm text-gray-500">AI-Powered Real Estate Assistant</p>
//                 <div className="w-10 h-1 bg-gradient-to-l from-teal-500 to-transparent rounded-full"></div>
//               </div>
//               <p className="text-xs text-gray-600">© 2025 PropertyLoop · All rights reserved</p>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <div className={`w-full max-w-4xl transition-all duration-700 ease-in-out ${!showAgentSelection ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'}`}>
//         {!showAgentSelection && (
//           <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800 animate-fadeIn">
//             <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-between border-b border-gray-700 sticky top-0 z-10">
//               <button 
//                 onClick={resetToAgentSelection}
//                 className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                 </svg>
//                 <span>Back</span>
//               </button>
              
//               <div className="flex items-center gap-2">
//                 <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
//                 <h2 className="text-lg font-bold text-white">
//                   {activeAgent === "agent1" ? "Property Issue Detector" : "Tenancy Advisor"}
//                 </h2>
//               </div>
              
//               <div className="w-20 opacity-0">Spacer</div> {/* Spacer for centering */}
//             </div>
            
//             <div className="px-4 py-5">
//               {activeAgent === "agent1" && (
//                 <div className="space-y-4">
//                   {renderChat(agent1History)}
                  
//                   <div className="mt-6 bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg">
//                     {imagePreview && (
//                       <div className="mb-4">
//                         <div className="relative inline-block group rounded-lg overflow-hidden">
//                           <img 
//                             src={imagePreview} 
//                             alt="Preview" 
//                             className="max-h-48 border border-gray-600 rounded-lg transform transition-transform group-hover:scale-[1.02]"
//                           />
//                           <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
//                             <button
//                               onClick={() => {
//                                 setImagePreview(null);
//                                 setAgent1Image(null);
//                                 if (fileInputRef.current) fileInputRef.current.value = "";
//                               }}
//                               className="bg-gray-900 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <div className="relative">
//                       <textarea
//                         ref={messageInputRef}
//                         value={agent1Text}
//                         onChange={(e) => setAgent1Text(e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(e, "agent1")}
//                         placeholder="Describe the property issue..."
//                         className="w-full p-4 pr-16 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none"
//                         rows={3}
//                       />
                      
//                       <div className="absolute right-3 bottom-3 flex gap-2">
//                         <label className="flex items-center justify-center p-2 bg-gray-800 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors group">
//                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                           </svg>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             ref={fileInputRef}
//                             className="hidden"
//                           />
//                         </label>
                        
//                         <button
//                           onClick={handleAgent1Submit}
//                           disabled={isLoading || (!agent1Text && !agent1Image)}
//                           className="p-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg group"
//                         >
//                           {isLoading ? (
//                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                           ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//                             </svg>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeAgent === "agent2" && (
//                 <div className="space-y-4">
//                   {renderChat(agent2History)}
                  
//                   <div className="mt-6 bg-gradient-to-b from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 shadow-lg">
//                     <div className="relative mb-4 group">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-all">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                         </svg>
//                       </div>
//                       <input
//                         type="text"
//                         value={agent2Location}
//                         onChange={(e) => setAgent2Location(e.target.value)}
//                         placeholder="Location (city/country, optional)"
//                         className="w-full p-3 pl-10 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-white placeholder-gray-500"
//                       />
//                     </div>
                    
//                     <div className="relative">
//                       <textarea
//                         ref={messageInputRef}
//                         value={agent2Text}
//                         onChange={(e) => setAgent2Text(e.target.value)}
//                         onKeyDown={(e) => handleKeyDown(e, "agent2")}
//                         placeholder="Ask a tenancy question..."
//                         className="w-full p-4 pr-16 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-white placeholder-gray-500 resize-none"
//                         rows={3}
//                       />
                      
//                       <div className="absolute right-3 bottom-3">
//                         <button
//                           onClick={handleAgent2Submit}
//                           disabled={isLoading || !agent2Text}
//                           className="p-2 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg group"
//                         >
//                           {isLoading ? (
//                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                           ) : (
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
//                             </svg>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function App() {
  const [showAgentSelection, setShowAgentSelection] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [agent1Text, setAgent1Text] = useState("");
  const [agent1Image, setAgent1Image] = useState(null);
  const [agent1History, setAgent1History] = useState([]);
  const [agent2Text, setAgent2Text] = useState("");
  const [agent2Location, setAgent2Location] = useState("");
  const [agent2History, setAgent2History] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const messageInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_SOME_URL;
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [agent1History, agent2History, currentTypingMessage]);

  // Typewriter effect for the last message
  useEffect(() => {
    let history = activeAgent === "agent1" ? agent1History : agent2History;
    if (history.length > 0 && isTyping) {
      const lastMessage = history[history.length - 1];
      if (lastMessage.role === "model") {
        const content = lastMessage.content;
        if (typingIndex < content.length) {
          const timer = setTimeout(() => {
            setCurrentTypingMessage(content.substring(0, typingIndex + 1));
            setTypingIndex(typingIndex + 1);
          }, 0.05); 
          return () => clearTimeout(timer);
        } else {
          setIsTyping(false);
        }
      }
    }
  }, [agent1History, agent2History, typingIndex, isTyping, activeAgent, currentTypingMessage]);

  const selectAgent = (agent) => {
    setActiveAgent(agent);
    setShowAgentSelection(false);
    // Focus on input after transition
    setTimeout(() => {
      if (messageInputRef.current) {
        messageInputRef.current.focus();
      }
    }, 500);
  };

  const resetToAgentSelection = () => {
    setShowAgentSelection(true);
    setActiveAgent(null);
  };

  const handleAgent1Submit = async () => {
    if (!agent1Text && !agent1Image) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("text", agent1Text);
    if (agent1Image) formData.append("image", agent1Image);
    formData.append("history", JSON.stringify(agent1History));
  
    try {
      const res = await axios.post(`${API_URL}/api/agent1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false
      });
      
      // Add user message immediately
      const updatedHistory = [
        ...agent1History,
        { role: "user", content: agent1Text || "Image uploaded" },
      ];
      setAgent1History(updatedHistory);
      
      // Add model response with typewriter effect
      setTimeout(() => {
        setTypingIndex(0);
        setCurrentTypingMessage("");
        setIsTyping(true);
        setAgent1History([...updatedHistory, { role: "model", content: res.data.response }]);
      }, 500);
      
      setAgent1Text("");
      setAgent1Image(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("API Error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAgent2Submit = async () => {
    if (!agent2Text) return;
    
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/agent2`, {
        query: agent2Text,
        location: agent2Location,
        history: agent2History
      });
      
      // Add user message immediately
      const updatedHistory = [
        ...agent2History,
        { role: "user", content: agent2Text },
      ];
      setAgent2History(updatedHistory);
      
      // Add model response with typewriter effect
      setTimeout(() => {
        setTypingIndex(0);
        setCurrentTypingMessage("");
        setIsTyping(true);
        setAgent2History([...updatedHistory, { role: "model", content: res.data.response }]);
      }, 500);
      
      setAgent2Text("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e, agent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (agent === "agent1") {
        handleAgent1Submit();
      } else {
        handleAgent2Submit();
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAgent1Image(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderChat = (history) => (
    <div 
      ref={chatContainerRef}
      className="mt-4 space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
    >
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center animate-float">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-medium text-white mb-3 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">Start a Conversation</h3>
          <p className="text-gray-400 max-w-md leading-relaxed">
            {activeAgent === "agent1" 
              ? "Upload images of property issues and get expert diagnosis with actionable solutions" 
              : "Ask any questions about tenancy agreements, rental laws, or housing rights"}
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-500/0 via-teal-400/80 to-blue-500/0 rounded-full"></div>
        </div>
      ) : (
        history.map((item, idx) => {
          const isLastModelMessage = idx === history.length - 1 && item.role === "model" && isTyping;
          return (
            <div
              key={idx}
              className={`flex ${item.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
            >
              <div className={`flex items-start max-w-[90%] gap-3 ${item.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                  item.role === "user" 
                    ? "bg-blue-600/90 shadow-blue-600/20" 
                    : "bg-gradient-to-br from-teal-500/90 to-blue-500/90 shadow-teal-500/20"
                }`}>
                  {item.role === "user" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                </div>
                
                <div
                  className={`p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                    item.role === "user"
                      ? "bg-blue-600/90 text-white rounded-br-none border border-blue-500/30"
                      : "bg-gray-800/70 text-gray-200 rounded-bl-none border border-gray-700/50"
                  }`}
                >
                  <p className="font-medium text-xs uppercase tracking-wider mb-1.5 opacity-80">
                    {item.role === "user" ? "You" : activeAgent === "agent1" ? "Property Expert" : "Tenancy Advisor"}
                  </p>
                  
                  {/* Replace plain text with ReactMarkdown component */}
                  {item.role === "model" ? (
                    <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed markdown-content">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-md overflow-hidden my-2"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={`${className} bg-gray-700/50 px-1.5 py-0.5 rounded text-sm`} {...props}>
                                {children}
                              </code>
                            );
                          },
                          a: ({node, ...props}) => <a className="text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-6 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-5 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mt-4 mb-2" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-teal-400/30 pl-4 italic my-4" {...props} />,
                          table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse" {...props} /></div>,
                          th: ({node, ...props}) => <th className="border border-gray-600 px-4 py-2 bg-gray-700/50" {...props} />,
                          td: ({node, ...props}) => <td className="border border-gray-600 px-4 py-2" {...props} />
                        }}
                      >
                        {isLastModelMessage ? currentTypingMessage : item.content}
                      </ReactMarkdown>
                      {isLastModelMessage && (
                        <span className="inline-block ml-1 w-2 h-4 bg-teal-400 animate-pulse"></span>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/5 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-float-slower"></div>
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl animate-float-reverse"></div>
      </div>

      {/* Agent Selection Screen */}
      <div className={`w-full max-w-5xl transition-all duration-700 ease-in-out ${showAgentSelection ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'}`}>
        {showAgentSelection && (
          <div className="relative bg-gray-900/50 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transform transition-all border border-gray-800/50">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500"></div>
            <div className="absolute top-20 right-10 w-16 h-16 bg-teal-400/10 rounded-full filter blur-md animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-400/10 rounded-full filter blur-md animate-pulse"></div>
            
            <div className="p-8 text-center relative z-10">
              <div className="animate-float mb-6">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 via-blue-300 to-teal-300 bg-clip-text text-transparent inline-block animate-gradient">
                Multi-Agentic <span className="text-white">Real Estate Chatbot</span>
                </h1>
                <div className="w-48 h-1 mx-auto bg-gradient-to-r from-teal-400 to-blue-400 rounded-full mt-2 opacity-80"></div>
              </div>
              <p className="text-gray-400 mb-12 text-lg font-light">AI-powered real estate assistance</p>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Agent 1 Card */}
                <div 
                  onClick={() => selectAgent("agent1")}
                  className="relative bg-gray-900/60 rounded-2xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl border border-gray-700/50 group animate-fadeInUp"
                  style={{animationDelay: "0.1s"}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full flex items-center justify-center transition-all group-hover:rotate-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">Issue Detection & Troubleshooting Agent</h2>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      Upload images of property issues and receive expert analysis with recommended solutions
                    </p>
                    
                    <div className="mt-8 flex justify-center">
                      <span className="px-5 py-2.5 bg-gray-800/60 rounded-full text-blue-300 text-sm font-medium group-hover:bg-blue-500/20 group-hover:text-white transition-all duration-300 flex items-center gap-2 border border-gray-700/50 group-hover:border-blue-500/30">
                        <span>Select Agent</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Agent 2 Card */}
                <div 
                  onClick={() => selectAgent("agent2")}
                  className="relative bg-gray-900/60 rounded-2xl overflow-hidden cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-xl border border-gray-700/50 group animate-fadeInUp"
                  style={{animationDelay: "0.3s"}}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="p-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <div className="absolute inset-0 bg-teal-500/10 rounded-full animate-pulse"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center transition-all group-hover:rotate-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3 bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">Tenancy FAQ and advisor Agent chatbot</h2>
                    <p className="text-gray-400 text-sm leading-relaxed font-light">
                      Get expert answers to tenancy questions, rental agreements, and housing legal advice
                    </p>
                    
                    <div className="mt-8 flex justify-center">
                      <span className="px-5 py-2.5 bg-gray-800/60 rounded-full text-teal-300 text-sm font-medium group-hover:bg-teal-500/20 group-hover:text-white transition-all duration-300 flex items-center gap-2 border border-gray-700/50 group-hover:border-teal-500/30">
                        <span>Select Agent</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8 text-center animate-fadeIn" style={{animationDelay: "0.5s"}}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500/0 to-blue-500/50 rounded-full"></div>
                <p className="text-sm text-gray-500 font-light">AI-Powered Real Estate Assistant</p>
                <div className="w-16 h-0.5 bg-gradient-to-l from-teal-500/0 to-teal-500/50 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-600">© 2025 PropertyLoop · All rights reserved</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Interface */}
      <div className={`w-full max-w-4xl transition-all duration-700 ease-in-out ${!showAgentSelection ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'}`}>
        {!showAgentSelection && (
          <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-800/50 animate-fadeIn">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-gray-800/70 to-gray-900/70 flex items-center justify-between border-b border-gray-700/50 sticky top-0 z-10">
              <button 
                onClick={resetToAgentSelection}
                className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-light">Back</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'} shadow-md`}></div>
                <h2 className="text-lg font-medium text-white">
                  {activeAgent === "agent1" ? "Property Inspector" : "Tenancy Advisor"}
                </h2>
              </div>
              
              <div className="w-20 opacity-0">Spacer</div>
            </div>
            
            <div className="px-5 py-6">
              {activeAgent === "agent1" && (
                <div className="space-y-4">
                  {renderChat(agent1History)}
                  
                  <div className="mt-6 bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 shadow-lg">
                    {imagePreview && (
                      <div className="mb-4">
                        <div className="relative inline-block group rounded-xl overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-52 border border-gray-600/50 rounded-xl transform transition-transform group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                            <button
                              onClick={() => {
                                setImagePreview(null);
                                setAgent1Image(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                              }}
                              className="bg-gray-900/90 text-white p-2 rounded-full hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 shadow-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="relative">
                      <textarea
                        ref={messageInputRef}
                        value={agent1Text}
                        onChange={(e) => setAgent1Text(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "agent1")}
                        placeholder="Describe the property issue..."
                        className="w-full p-4 pr-16 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all text-white placeholder-gray-500/70 resize-none backdrop-blur-sm"
                        rows={1}
                      />
                      
                      <div className="absolute right-3 bottom-3 flex gap-2">
                        <label className="flex items-center justify-center p-2 bg-gray-800/70 text-gray-300 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors group border border-gray-700/50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            className="hidden"
                          />
                        </label>
                        
                        <button
                          onClick={handleAgent1Submit}
                          disabled={isLoading || (!agent1Text && !agent1Image)}
                          className="p-2 bg-gradient-to-br from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg group border border-blue-500/30 shadow-md"
                        >
                          {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeAgent === "agent2" && (
                <div className="space-y-4">
                  {renderChat(agent2History)}
                  
                  <div className="mt-6 bg-gray-900/50 backdrop-blur-sm p-5 rounded-2xl border border-gray-700/50 shadow-lg">
                    <div className="relative mb-4 group">
                      
                      
                    </div>
                    
                    <div className="relative">
                      <textarea
                        ref={messageInputRef}
                        value={agent2Text}
                        onChange={(e) => setAgent2Text(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, "agent2")}
                        placeholder="Ask a tenancy question..."
                        className="w-full p-4 pr-16 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all text-white placeholder-gray-500/70 resize-none backdrop-blur-sm"
                        rows={2}
                      />
                      
                      <div className="absolute right-3 bottom-3">
                        <button
                          onClick={handleAgent2Submit}
                          disabled={isLoading || !agent2Text}
                          className="p-2 bg-gradient-to-br from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg group border border-teal-500/30 shadow-md"
                        >
                          {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;