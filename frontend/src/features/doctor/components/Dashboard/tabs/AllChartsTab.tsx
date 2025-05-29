import React, { useEffect, useState } from "react";
import DiseaseByLocationChart from "../DiseaseByLocationChart";
// import SymptomsWordCloud from "../../SymptomsWordCloud";
// import RiskFactorsWordCloud from "../../RiskFactorsWordCloud";
import AgeGroupChart from "../AgeGroupChart";
import RegionChart from "../RegionChart";
import DiseaseTypeChart from "../DiseaseTypeChart";
import SeasonChart from "../SeasonChart";
import DiseaseBySeasonChart from "../DiseaseBySeasonChart";
import DiseaseByRegionChart from "../DiseaseByRegionChart";
import { fetchDemographicData } from "../../../services/logChartsService";
import {
  LocationIcon,
  SymptomsIcon,
  RiskIcon,
  DemographicsIcon,
} from "./Icons";

interface ChartData {
  regionData: Record<string, number>;
  ageGroupData: Record<string, number>;
  seasonData: Record<string, number>;
  diseaseData: Record<string, number>;
  diseaseBySeasonData: Record<string, Record<string, number>>;
  diseaseByRegionData: Record<string, Record<string, number>>;
}

const AllChartsTab: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch data một lần cho các charts (trừ DiseaseByLocationChart)
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await fetchDemographicData();
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Không thể tải dữ liệu biểu đồ. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
  }, []);

  // ✅ Loading state cho các charts được quản lý
  if (loading) {
    return (
      <div className="space-y-8">
        {/* DiseaseByLocationChart render bình thường vì có logic riêng */}
        <div>
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 shadow-inner">
            <DiseaseByLocationChart />
          </div>
        </div>

        {/* Loading skeleton cho các charts khác */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-xl p-4 bg-gray-50 shadow-inner"
          >
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="space-y-8">
        {/* DiseaseByLocationChart vẫn render */}
        <div>
          <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 shadow-inner">
            <DiseaseByLocationChart />
          </div>
        </div>

        {/* Error state cho các charts khác */}
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-red-500 text-lg mb-2">⚠️ Lỗi tải dữ liệu</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ✅ Render charts với dữ liệu
  return (
    <div className="space-y-8">
      {/* ✅ DiseaseByLocationChart tự quản lý data riêng */}
      <div>
        <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 shadow-inner">
          <DiseaseByLocationChart />
        </div>
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-inner overflow-hidden">
            <SymptomsWordCloud height={400} width={480} />
          </div>
        </div>

        <div>
          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-red-50 to-orange-50 shadow-inner overflow-hidden">
            <RiskFactorsWordCloud height={400} width={480} />
          </div>
        </div>
      </div> */}

      <div className="mt-8">
        {/* ✅ Các charts này nhận data từ props */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-green-50 to-teal-50 shadow-inner">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Số Ca Bệnh Theo Nhóm Tuổi
            </h4>
            <AgeGroupChart height={350} data={chartData?.ageGroupData} />
          </div>
          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 shadow-inner">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              Số Ca Bệnh Theo Vùng Miền
            </h4>
            <RegionChart height={350} data={chartData?.regionData} />
          </div>
        </div>

        <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-inner">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            5 Bệnh đang phổ biến hiện tại
          </h4>
          <DiseaseTypeChart height={350} data={chartData?.diseaseData} />
        </div>

        <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Số Ca Bệnh Theo Mùa
          </h4>
          <SeasonChart
            height={350}
            chartType="radar"
            data={chartData?.seasonData}
          />
        </div>

        {/* ✅ 2 chart mới với dữ liệu được truyền từ parent */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-green-50 shadow-inner">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              🌸 Top Bệnh Theo Mùa
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Top 5 bệnh khả năng cao nhất trong từng mùa
            </p>
            <DiseaseBySeasonChart
              height={400}
              data={chartData?.diseaseBySeasonData}
            />
          </div>

          <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-rose-50 to-pink-50 shadow-inner">
            <h4 className="text-md font-medium text-gray-700 mb-3">
              🗺️ Top Bệnh Theo Vùng Miền
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Top 7 bệnh phổ biến nhất theo từng vùng miền
            </p>
            <DiseaseByRegionChart
              height={400}
              data={chartData?.diseaseByRegionData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllChartsTab;
