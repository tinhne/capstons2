import React from "react";
import DiseaseByLocationChart from "../DiseaseByLocationChart";
// import SymptomsWordCloud from "../../SymptomsWordCloud";
// import RiskFactorsWordCloud from "../../RiskFactorsWordCloud";
import AgeGroupChart from "../AgeGroupChart";
import RegionChart from "../RegionChart";
import DiseaseTypeChart from "../DiseaseTypeChart";
import SeasonChart from "../SeasonChart";
import {
  LocationIcon,
  SymptomsIcon,
  RiskIcon,
  DemographicsIcon,
} from "./Icons";

const AllChartsTab: React.FC = () => (
  <div className="space-y-8">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-green-50 to-teal-50 shadow-inner">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Số Ca Bệnh Theo Nhóm Tuổi
          </h4>
          <AgeGroupChart height={350} />
        </div>
        <div className="border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 shadow-inner">
          <h4 className="text-md font-medium text-gray-700 mb-3">
            Số Ca Bệnh Theo Vùng Miền
          </h4>
          <RegionChart height={350} />
        </div>
      </div>
      <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-inner">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          5 Bệnh đang phổ biến hiện tại
        </h4>
        <DiseaseTypeChart height={350} />
      </div>
      <div className="mt-6 border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-inner">
        <h4 className="text-md font-medium text-gray-700 mb-3">
          Số Ca Bệnh Theo Mùa
        </h4>
        <SeasonChart height={350} chartType="radar" />
      </div>
    </div>
  </div>
);

export default AllChartsTab;
