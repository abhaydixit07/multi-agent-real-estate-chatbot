import { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [activeAgent, setActiveAgent] = useState("agent1");
  const [agent1Text, setAgent1Text] = useState("");
  const [agent1Image, setAgent1Image] = useState(null);
  const [agent1History, setAgent1History] = useState([]);
  const [agent2Text, setAgent2Text] = useState("");
  const [agent2Location, setAgent2Location] = useState("");
  const [agent2History, setAgent2History] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleAgent1Submit = async () => {
    if (!agent1Text && !agent1Image) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append("text", agent1Text);
    if (agent1Image) formData.append("image", agent1Image);
    formData.append("history", JSON.stringify(agent1History));
  
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/agent1", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false
      });
      
      setAgent1History([
        ...agent1History,
        { role: "user", content: agent1Text || "Image uploaded" },
        { role: "model", content: res.data.response }
      ]);
      setAgent1Text("");
      setAgent1Image(null);
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
      const res = await axios.post("http://localhost:5000/api/agent2", {
        query: agent2Text,
        location: agent2Location,
        history: agent2History
      });
      setAgent2History([
        ...agent2History,
        { role: "user", content: agent2Text },
        { role: "model", content: res.data.response }
      ]);
      setAgent2Text("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChat = (history) => (
    <div className="mt-4 space-y-3 max-h-96 overflow-y-auto p-2 border rounded-lg bg-gray-50">
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No messages yet</p>
      ) : (
        history.map((item, idx) => (
          <div
            key={idx}
            className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                item.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="font-semibold text-sm mb-1">
                {item.role === "user" ? "You" : "Assistant"}
              </p>
              <p className="whitespace-pre-wrap">{item.content}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            🏠 Real Estate Assistant
          </h1>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveAgent("agent1")}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeAgent === "agent1"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Property Issues
            </button>
            <button
              onClick={() => setActiveAgent("agent2")}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                activeAgent === "agent2"
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Tenancy FAQs
            </button>
          </div>

          {activeAgent === "agent1" && (
            <div className="space-y-4">
              <textarea
                value={agent1Text}
                onChange={(e) => setAgent1Text(e.target.value)}
                placeholder="Describe the property issue..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                rows={3}
              />
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <label className="flex-1 w-full">
                  <span className="sr-only">Upload property image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAgent1Image(e.target.files[0])}
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors"
                  />
                </label>
                <button
                  onClick={handleAgent1Submit}
                  disabled={isLoading || (!agent1Text && !agent1Image)}
                  className="w-full sm:w-auto px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Issue"
                  )}
                </button>
              </div>
              {renderChat(agent1History)}
            </div>
          )}

          {activeAgent === "agent2" && (
            <div className="space-y-4">
              <input
                type="text"
                value={agent2Location}
                onChange={(e) => setAgent2Location(e.target.value)}
                placeholder="Location (city/country, optional)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
              <textarea
                value={agent2Text}
                onChange={(e) => setAgent2Text(e.target.value)}
                placeholder="Ask a tenancy question..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                rows={3}
              />
              <button
                onClick={handleAgent2Submit}
                disabled={isLoading || !agent2Text}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Getting Answer..." : "Ask Question"}
              </button>
              {renderChat(agent2History)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;