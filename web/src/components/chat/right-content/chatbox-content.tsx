/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, Send } from "lucide-react";
import { useState } from "react";

export default function ChatboxContent() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending:", message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="size-full p-16 relative">
      <div>[CHAT CONTENT]</div>

      {/* Send Message Button */}
      <div className="absolute left-0 bottom-0 w-full p-4">
        <div className="w-[85%] mx-auto bg-background rounded-full py-3 px-4 shadow border border-border/70 flex items-end gap-4">
          {/* Attach File Button */}
          <button
            className="p-2 hover:bg-green-600 rounded-full transition-colors shrink-0"
            aria-label="Attach file"
          >
            <Plus className="size-7" />
          </button>

          {/* Text Input */}
          <div className="flex-1 max-h-32 overflow-y-auto relative top-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-0! py-2 resize-none border-none outline-none bg-transparent"
              placeholder="Type a message"
              rows={1}
              style={{
                // minHeight: "40px",
                // maxHeight: "128px",
                height: "auto",
              }}
              onInput={(e: any) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>

          {/* Send/Mic Button */}
          <button
            className="p-2 hover:bg-green-600 rounded-full transition-colors shrink-0"
            aria-label="Attach file"
          >
            <Send className="size-7 relative top-0.5 right-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
