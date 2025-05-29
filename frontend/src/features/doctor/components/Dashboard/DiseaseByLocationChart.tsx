import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDiseaseByLocationStats } from "../../services/logChartsService";

const DiseaseByLocationChart: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchDiseaseByLocationStats()
      .then(setData)
      .catch(() => setData([]));
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="location" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DiseaseByLocationChart;
