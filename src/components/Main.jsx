import React from "react";

function Main() {
  return (
    <div className=" flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-5">
      <div className="group cursor-pointer transition-all duration-300 hover:scale-105">
        <div className="relative inline-block">
          <div className="flex gap-1 items-center">
            {/* WeatherApp Text with Glow Effect */}
            <p className="text-4xl md:text-5xl font-extrabold text-violet-300 drop-shadow-lg">
              W
            </p>
            <p className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              eather
            </p>
            <p className="text-4xl md:text-5xl font-extrabold text-violet-300 drop-shadow-lg">
              A
            </p>
            <p className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              pp
            </p>
          </div>

          {/* Animated Underline */}
          <div className="absolute bottom-0 left-0 h-1 bg-white rounded-full transform origin-left transition-all duration-500 group-hover:scale-x-100 scale-x-0" />
          
          {/* Subtle Floating Animation */}
          <div className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 blur-md" />
        </div>

        {/* Subtitle (Optional) */}
        <p className="mt-2 text-center text-sm text-violet-200 font-medium opacity-80">
          Check real-time weather updates
        </p>
      </div>
    </div>
  );
}

export default Main;
