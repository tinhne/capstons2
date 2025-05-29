import React, { useState } from "react";

type Word = { text: string; value: number };

interface BeautifulWordCloudProps {
  words: Word[];
  title: string;
  colors?: string[];
  height?: number;
}

const BeautifulWordCloud: React.FC<BeautifulWordCloudProps> = ({
  words,
  title,
  colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#FF9F43",
    "#6C5CE7",
    "#A29BFE",
    "#FD79A8",
    "#00B894",
    "#E17055",
    "#74B9FF",
    "#FDCB6E",
    "#E84393",
  ],
  height = 400,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const safeWords = React.useMemo(() => {
    if (!Array.isArray(words) || words.length === 0) {
      return [];
    }

    let filteredWords = words
      .filter(
        (word) =>
          word &&
          typeof word.text === "string" &&
          word.text.trim().length > 0 &&
          typeof word.value === "number" &&
          word.value > 0
      )
      .map((word) => ({
        text: word.text.trim(),
        value: Math.max(1, Math.floor(word.value)),
      }))
      .sort((a, b) => b.value - a.value);

    // Filter by search term if provided
    if (searchTerm) {
      filteredWords = filteredWords.filter((word) =>
        word.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filteredWords;
  }, [words, searchTerm]);

  const maxValue = Math.max(...safeWords.map((w) => w.value), 1);
  const minValue = Math.min(...safeWords.map((w) => w.value), 1);

  const getFontSize = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return Math.max(14, 14 + ratio * 32); // Font size between 14px and 46px
  };

  const getWordOpacity = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue);
    return Math.max(0.6, 0.6 + ratio * 0.4); // Opacity between 0.6 and 1.0
  };

  const getRandomPosition = (index: number) => {
    // Create more natural positioning
    const angle = (index * 137.508) % 360; // Golden angle
    const radius = Math.sqrt(index) * 8;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return {
      transform: `translate(${x}px, ${y}px) rotate(${
        ((index % 6) - 3) * 20
      }deg)`,
    };
  };

  const getColor = (index: number, value: number) => {
    const baseColor = colors[index % colors.length];
    return baseColor;
  };

  if (safeWords.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border border-gray-200 rounded-2xl shadow-lg"
      >
        <div className="text-gray-400 mb-4">
          <svg
            className="w-16 h-16"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <p className="text-gray-600 text-lg font-medium">{title}</p>
        <p className="text-gray-500 text-sm mt-2">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with search */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm">
            {safeWords.length} từ khóa
          </div>
        </div>

        {/* Search input */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Tìm kiếm từ khóa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <svg
            className="absolute right-3 top-2.5 w-5 h-5 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Word cloud container */}
      <div
        style={{ height: height - 120 }}
        className="relative bg-gradient-to-br from-gray-50 to-white overflow-hidden"
      >
        {/* Floating words layout */}
        <div className="relative w-full h-full p-8 overflow-y-auto">
          <div className="flex flex-wrap justify-center items-center gap-3 min-h-full">
            {safeWords.map((word, index) => (
              <div
                key={`${word.text}-${index}`}
                className={`
                  inline-block cursor-pointer transition-all duration-300 ease-out
                  hover:scale-110 hover:z-10 relative
                  ${hoveredIndex === index ? "z-20 drop-shadow-2xl" : ""}
                `}
                style={{
                  fontSize: `${getFontSize(word.value)}px`,
                  color: getColor(index, word.value),
                  opacity: getWordOpacity(word.value),
                  fontWeight:
                    word.value > maxValue * 0.7
                      ? "700"
                      : word.value > maxValue * 0.4
                      ? "600"
                      : "500",
                  textShadow:
                    hoveredIndex === index
                      ? "0 4px 8px rgba(0,0,0,0.3)"
                      : "0 2px 4px rgba(0,0,0,0.1)",
                  transform: hoveredIndex === index ? "scale(1.1)" : "scale(1)",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                title={`${word.text}: ${word.value.toLocaleString()} lượt`}
              >
                <span
                  className="select-none px-2 py-1 rounded-lg hover:bg-white/50 transition-all duration-200"
                  style={{
                    background:
                      hoveredIndex === index
                        ? "rgba(255,255,255,0.8)"
                        : "transparent",
                    backdropFilter:
                      hoveredIndex === index ? "blur(10px)" : "none",
                  }}
                >
                  {word.text}
                </span>

                {/* Hover tooltip */}
                {hoveredIndex === index && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap z-30">
                    {word.value.toLocaleString()} lượt xuất hiện
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-indigo-200/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Footer stats */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Hiển thị {safeWords.length} từ khóa</span>
          <span>
            Tổng{" "}
            {words.reduce((sum, word) => sum + word.value, 0).toLocaleString()}{" "}
            lượt
          </span>
        </div>
      </div>
    </div>
  );
};

export default BeautifulWordCloud;
