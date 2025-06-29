import React from "react";
import { Brain, TrendingUp } from "lucide-react";

const Logo = ({ size = "default", showText = true }) => {
  const sizeClasses = {
    small: {
      container: "w-8 h-8",
      icon: "w-4 h-4",
      text: "text-lg"
    },
    default: {
      container: "w-10 h-10",
      icon: "w-5 h-5", 
      text: "text-xl"
    },
    large: {
      container: "w-12 h-12",
      icon: "w-6 h-6",
      text: "text-2xl"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      {/* Logo Icon */}
      <div className={`${currentSize.container} bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Main Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Brain className={`${currentSize.icon} text-white`} />
        </div>
        
        {/* Small accent icon */}
        <TrendingUp className="absolute bottom-0 right-0 w-3 h-3 text-white/70" />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${currentSize.text} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            CareerAI
          </span>
          {size === "large" && (
            <span className="text-xs text-gray-500 -mt-1">Smart Career Growth</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
