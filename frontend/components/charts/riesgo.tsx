import React from "react";
import Chart, { Props } from "react-apexcharts";

const state = {
  options: {
    labels: ["Alto", "Moderado", "Bajo"],
  },
  series: [24, 55, 121],
};

export const Riesgo = () => {
  return (
    <>
      <div className="w-full z-20">
        <div id="chart">
          <h3 className="text-heading3-bold mb-4">Riesgo de Inversión</h3>
          <Chart
            options={state.options}
            series={state.series}
            type="pie"
            width="380"
          />
        </div>
      </div>
    </>
  );
};
