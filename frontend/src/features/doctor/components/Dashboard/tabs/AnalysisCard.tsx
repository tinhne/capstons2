import React from "react";

interface AnalysisCardProps {
  title: string;
  content: string;
  bgColor?: string;
  textColor?: string;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  content,
  bgColor = "blue-50",
  textColor = "blue-700",
}) => (
  <div className={`mt-4 bg-${bgColor} p-4 rounded-lg`}>
    <h4 className={`font-medium text-${textColor} mb-2`}>{title}</h4>
    <p className={`text-${textColor} text-sm`}>{content}</p>
  </div>
);

export default AnalysisCard;
