import React, { useState, useEffect } from "react";
import { ErrorBoundary } from "../../../../components/ui";

type Word = { text: string; value: number };

interface SafeWordCloudProps {
  words: Word[];
  title: string;
  colors?: string[];
  height?: number;
}

// Lazy load ReactWordcloud to handle potential import errors
const ReactWordcloud = React.lazy(() =>
  import("react-wordcloud").catch(() => ({
    default: () => (
      <div className="flex items-center justify-center h-full text-gray-500">
        WordCloud library unavailable
      </div>
    ),
  }))
);

const SafeWordCloud: React.FC<SafeWordCloudProps> = ({
  words,
  title,
  colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  height = 300,
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure component is fully mounted
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const safeWords = React.useMemo(() => {
    if (!Array.isArray(words) || words.length === 0) {
      return [{ text: "No data available", value: 1 }];
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
      }));
  }, [words]);

  const options = React.useMemo(
    () => ({
      colors,
      enableTooltip: true,
      deterministic: true, // Make it deterministic to reduce errors
      fontFamily: "Arial, sans-serif",
      fontSizes: [10, 40] as [number, number], // Smaller range to prevent layout issues
      fontStyle: "normal",
      fontWeight: "normal",
      padding: 2,
      rotations: 2, // Reduce rotations
      rotationAngles: [-45, 45] as [number, number],
      scale: "sqrt" as const,
      spiral: "archimedean" as const,
      transitionDuration: 500, // Shorter transition
    }),
    [colors]
  );

  const WordCloudFallback = () => (
    <div
      style={{ height }}
      className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded"
    >
      <div className="text-gray-400 mb-2">
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-gray-500 text-xs">WordCloud temporarily unavailable</p>
    </div>
  );

  if (!isReady) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<WordCloudFallback />}>
      <div style={{ height, width: "100%" }} className="relative">
        <React.Suspense fallback={<WordCloudFallback />}>
          {safeWords.length > 0 ? (
            <ReactWordcloud
              words={safeWords}
              options={options}
              size={[400, height]}
            />
          ) : (
            <WordCloudFallback />
          )}
        </React.Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default SafeWordCloud;
