import React, { useEffect, useState } from "react";
import HeartShapedWordCloud from "./HeartShapedWordCloud";
import { fetchRiskFactorsWordCloud } from "../services/logChartsService";

type Word = { text: string; value: number };
interface RiskFactorsWordCloudProps {
  height?: number;
  width?: number;
}
const RiskFactorsWordCloud: React.FC<RiskFactorsWordCloudProps> = ({
  height = 400,
  width = 480,
}) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRiskFactorsWordCloud();
        console.log("RiskFactorsWordCloud API response:", data);

        // Validate and transform data
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received");
        }

        const validWords = data
          .filter(
            (item) =>
              item &&
              typeof item.text === "string" &&
              item.text.trim().length > 0 &&
              typeof item.value === "number" &&
              item.value > 0
          )
          .map((item) => ({
            text: item.text.trim(),
            value: Math.max(1, Math.floor(item.value)),
          }));

        setWords(validWords);
      } catch (err) {
        console.error("Error loading risk factors word cloud data:", err);
        setError("Failed to load data");
        setWords([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div
        style={{ height: 400, width: "100%" }}
        className="flex items-center justify-center"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ height: 400, width: "100%" }}
        className="flex items-center justify-center"
      >
        <div className="text-red-500 text-center">
          <p>Không thể tải dữ liệu Yếu Tố Nguy Cơ</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <HeartShapedWordCloud
      words={words}
      title="Biểu Đồ Yếu Tố Nguy Cơ"
      colors={[
        "#FF6B6B",
        "#E17055",
        "#E84393",
        "#FD79A8",
        "#FF9F43",
        "#FDCB6E",
      ]}
      height={height}
      width={width}
    />
  );
};

export default RiskFactorsWordCloud;
