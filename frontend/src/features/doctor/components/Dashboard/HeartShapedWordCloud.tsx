import React, { useEffect, useRef, useState } from "react";

type Word = { text: string; value: number };

interface HeartShapedWordCloudProps {
  words: Word[];
  title: string;
  colors?: string[];
  height?: number;
  width?: number;
  showAll?: boolean; // Thêm prop để cho phép hiển thị tất cả từ khóa
}

const HeartShapedWordCloud: React.FC<HeartShapedWordCloudProps> = ({
  words,
  title,
  colors = ["#1f77b4", "#ff6b6b", "#2ca02c", "#d62728", "#9467bd", "#4ecdc4"],
  height = 500,
  width = 600,
  showAll = true, // Mặc định hiển thị tất cả
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedWords, setRenderedWords] = useState<
    {
      word: Word;
      x: number;
      y: number;
      size: number;
      color: string;
      rotation: number;
    }[]
  >([]);
  const [unplacedWords, setUnplacedWords] = useState<Word[]>([]);
  const [viewMode, setViewMode] = useState<"heart" | "all">(
    showAll ? "all" : "heart"
  );

  // Process words to filter invalid ones and sort by value
  const processedWords = React.useMemo(() => {
    if (!Array.isArray(words) || words.length === 0) {
      return [];
    }

    return words
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
  }, [words]);

  // Find max and min values for sizing words proportionally
  const maxValue = Math.max(...processedWords.map((w) => w.value), 1);
  const minValue = Math.min(...processedWords.map((w) => w.value), 1);

  // Calculate font size based on word value
  const getFontSize = (value: number) => {
    // Map value to a size between 12 and 48px
    const range = maxValue - minValue;
    const percentage = range > 0 ? (value - minValue) / range : 0;
    return Math.max(12, 12 + Math.floor(percentage * 36));
  };

  // Check if a point is inside the heart shape
  const isInHeartShape = (
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    // Normalize coordinates to [-2, 2] range
    const normX = (2 * x) / width - 1;
    const normY = (-2 * y) / height + 1;

    // Heart formula: (x^2 + y^2 - 1)^3 - x^2*y^3 < 0
    const term1 = Math.pow(normX * normX + normY * normY - 1, 3);
    const term2 = normX * normX * Math.pow(normY, 3);

    return term1 - term2 < 0;
  };

  // Generate word positions in a heart shape
  useEffect(() => {
    if (!containerRef.current || processedWords.length === 0) return;

    const container = containerRef.current;
    const containerWidth = width;
    const containerHeight = height;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // Create a collision detection grid
    const grid: boolean[][] = Array(containerHeight)
      .fill(false)
      .map(() => Array(containerWidth).fill(false));

    // Check if a word can be placed at a given position without overlapping
    const canPlace = (
      wordWidth: number,
      wordHeight: number,
      posX: number,
      posY: number
    ) => {
      for (let y = posY; y < posY + wordHeight; y++) {
        for (let x = posX; x < posX + wordWidth; x++) {
          if (
            x < 0 ||
            x >= containerWidth ||
            y < 0 ||
            y >= containerHeight ||
            grid[y][x] ||
            !isInHeartShape(x, y, containerWidth, containerHeight)
          ) {
            return false;
          }
        }
      }
      return true;
    };

    // Mark a word's position as occupied
    const placeWord = (
      wordWidth: number,
      wordHeight: number,
      posX: number,
      posY: number
    ) => {
      for (let y = posY; y < posY + wordHeight; y++) {
        for (let x = posX; x < posX + wordWidth; x++) {
          if (y >= 0 && y < containerHeight && x >= 0 && x < containerWidth) {
            grid[y][x] = true;
          }
        }
      }
    };

    // Calculate word display properties
    const newRenderedWords = [];
    const wordElements = [];
    const notPlacedWords: Word[] = [];

    // First, create temporary elements to measure text dimensions
    for (let i = 0; i < processedWords.length; i++) {
      const word = processedWords[i];
      const fontSize = getFontSize(word.value);
      const color = colors[i % colors.length];

      const tempElement = document.createElement("span");
      tempElement.style.position = "absolute";
      tempElement.style.visibility = "hidden";
      tempElement.style.fontSize = `${fontSize}px`;
      tempElement.innerText = word.text;
      document.body.appendChild(tempElement);

      const width = tempElement.offsetWidth;
      const height = tempElement.offsetHeight;
      document.body.removeChild(tempElement);

      wordElements.push({ word, fontSize, color, width, height });
    }

    // Place words using spiral algorithm
    for (const elem of wordElements) {
      let placed = false;
      const { word, fontSize, color, width, height } = elem;

      // Important words (higher values) are placed closer to the center
      const wordImportance = (word.value - minValue) / (maxValue - minValue);

      // Start from a position close to center based on importance
      let angle = Math.random() * 2 * Math.PI;
      let radius = 5;
      let rotation = Math.floor(Math.random() * 4 - 2) * 15; // Random rotation between -30 and +30 degrees

      // Try different positions in a spiral pattern
      while (!placed && radius < Math.max(containerWidth, containerHeight)) {
        for (let j = 0; j < 20; j++) {
          // Try several angles at each radius
          angle += Math.PI / 10;

          // Calculate position
          const x = centerX + radius * Math.cos(angle) - width / 2;
          const y = centerY + radius * Math.sin(angle) - height / 2;

          const posX = Math.floor(x);
          const posY = Math.floor(y);

          if (canPlace(width, height, posX, posY)) {
            placeWord(width, height, posX, posY);
            newRenderedWords.push({
              word,
              x: posX,
              y: posY,
              size: fontSize,
              color,
              rotation,
            });
            placed = true;
            break;
          }
        }
        radius += 3; // Increase radius for spiral
      }

      // If we can't place the word after many attempts, add to not placed list
      if (!placed) {
        notPlacedWords.push(word);
      }
    }

    setRenderedWords(newRenderedWords);
    setUnplacedWords(notPlacedWords);
  }, [processedWords, maxValue, minValue, width, height, colors]);

  // Loading state
  if (processedWords.length === 0) {
    return (
      <div
        className="relative flex items-center justify-center bg-white rounded-lg shadow-md border border-gray-200"
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <p className="mt-2 text-lg">Không có dữ liệu để hiển thị</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Word Cloud with Heart shape */}
      <div
        className="relative bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        style={{ width, height }}
      >
        {/* Title overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-white via-white/80 to-transparent py-2 px-4 z-10">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("heart")}
                className={`px-2 py-1 text-xs rounded ${
                  viewMode === "heart"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Hình Trái Tim
              </button>
              <button
                onClick={() => setViewMode("all")}
                className={`px-2 py-1 text-xs rounded ${
                  viewMode === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Tất Cả ({processedWords.length})
              </button>
            </div>
          </div>
        </div>

        {/* Word cloud container */}
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-hidden"
          style={{ padding: "40px 20px 20px" }}
        >
          {viewMode === "heart" ? (
            // Heart shaped layout
            renderedWords.map((item, index) => (
              <div
                key={`${item.word.text}-${index}`}
                className="absolute inline-block select-none transition-all hover:z-50 hover:scale-110"
                style={{
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  fontSize: `${item.size}px`,
                  color: item.color,
                  fontWeight: item.size > 24 ? "bold" : "normal",
                  transform: `rotate(${item.rotation}deg)`,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  whiteSpace: "nowrap",
                  pointerEvents: "all",
                  cursor: "pointer",
                  transition:
                    "transform 0.2s ease-in-out, color 0.2s ease-in-out",
                }}
                title={`${item.word.text}: ${item.word.value}`}
              >
                {item.word.text}
              </div>
            ))
          ) : (
            // Grid layout for all words
            <div className="w-full h-full overflow-y-auto">
              <div className="flex flex-wrap gap-2 p-4 justify-center">
                {processedWords.map((word, index) => {
                  const fontSize = getFontSize(word.value);
                  const color = colors[index % colors.length];
                  return (
                    <div
                      key={`all-${word.text}-${index}`}
                      className="inline-block select-none transition-all hover:scale-110"
                      style={{
                        fontSize: `${fontSize * 0.8}px`,
                        color: color,
                        fontWeight: fontSize > 24 ? "bold" : "normal",
                        textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        padding: "2px 8px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.6)",
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                      }}
                      title={`${word.text}: ${word.value}`}
                    >
                      {word.text}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Legend overlay */}
        <div className="absolute bottom-0 right-0 bg-white/70 backdrop-blur-sm text-xs px-2 py-1 m-2 rounded">
          {viewMode === "heart"
            ? `${renderedWords.length}/${processedWords.length} từ khóa`
            : `${processedWords.length} từ khóa`}
        </div>
      </div>
    </div>
  );
};

export default HeartShapedWordCloud;
