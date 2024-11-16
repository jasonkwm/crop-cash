import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";

interface ChartData {
  year: number;
  month: number;
  day: number;
  value: string;
  path: string;
  repeat: boolean;
}

// interface ChartOptions {
//   chart: {
//     id: string;
//     type: string;
//     height: number;
//   };
//   stroke: {
//     curve: string;
//   };
//   xaxis: {
//     categories: string[];
//     title: {
//       text: string;
//     };
//   };
//   yaxis: {
//     title: {
//       text: string;
//     };
//   };
//   title: {
//     text: string;
//     align: string;
//   };
//   grid: {
//     borderColor: string;
//   };
//   annotations: {
//     points: {
//       x: string;
//       y: number;
//       marker: {
//         size: number;
//         fillColor: string;
//         strokeColor: string;
//       };
//       label: {
//         text: string;
//         style: {
//           color: string;
//           background: string;
//           fontSize: string;
//         };
//       };
//     }[];
//   };
// }

interface ChartSeries {
  name: string;
  data: number[];
}

export default function Chart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({} as ApexOptions);
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);

  useEffect(() => {
    fetch("/chartData/field1.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((fetchedData: ChartData[]) => {
        setData(fetchedData);

        // Group data by year
        const groupedData = fetchedData.reduce((acc, entry) => {
          const year = entry.year;
          if (!acc[year]) acc[year] = [];
          acc[year].push(entry);
          return acc;
        }, {} as Record<number, ChartData[]>);

        const allSeries: any[] = [];
        const annotations: any[] = [];

        // Get unique dates and sort them chronologically
        const dates = Array.from(
          new Set(
            fetchedData.map((entry) => {
              const date = new Date(entry.year, entry.month - 1, entry.day);
              return date;
            })
          )
        ).sort((a, b) => a.getTime() - b.getTime());

        const sortedDates = dates.map((date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        });

        // Prepare a series for each year and track Full Grown and Harvest
        Object.keys(groupedData).forEach((year) => {
          const yearData = groupedData[parseInt(year)];
          const values = sortedDates.map((date) => {
            const entry = yearData.find((e) => `${e.year}-${e.month}-${e.day}` === date);
            return entry ? parseFloat(entry.value) : 0;
          });

          // Track multiple Full Grown and Harvest markers
          let fullGrownMarked = false;
          let harvestMarked = false;

          values.forEach((value, index) => {
            // Mark "Full Grown" whenever the value exceeds 60
            console.log(value, fullGrownMarked, harvestMarked);
            if (value >= 60 && !fullGrownMarked) {
              annotations.push({
                x: sortedDates[index],
                y: value,
                marker: {
                  size: 6,
                  fillColor: "#FF5733", // Orange color for Full Grown
                  strokeColor: "#FF5733",
                },
                label: {
                  text: "Fully Grown",
                  style: {
                    color: "#FFFFFF",
                    background: "#FF5733",
                    fontSize: "12px",
                  },
                },
              });
              fullGrownMarked = true;
              harvestMarked = false;
            }

            // Mark "Harvested" if the value falls below 20 after Full Grown
            if (fullGrownMarked && value <= 10 && !harvestMarked) {
              annotations.push({
                x: sortedDates[index],
                y: value,
                marker: {
                  size: 6,
                  fillColor: "#28A745", // Green color for Harvest
                  strokeColor: "#28A745",
                },
                label: {
                  text: "Harvested",
                  style: {
                    color: "#FFFFFF",
                    background: "#28A745",
                    fontSize: "12px",
                  },
                },
              });
              harvestMarked = true;
              fullGrownMarked = false;
            }

            // Reset markers if necessary to track multiple cycles
            if (value > 60 && fullGrownMarked && harvestMarked) {
              fullGrownMarked = false;
              harvestMarked = false;
            }
          });

          allSeries.push({
            name: `${year}`,
            data: values,
          });
        });

        // Set chart options
        setChartOptions({
          chart: {
            id: "line-chart",
            type: "line",
            height: 350,
          },
          stroke: {
            curve: "smooth",
          },
          xaxis: {
            categories: sortedDates,
            title: {
              text: "Date",
            },
          },
          yaxis: {
            title: {
              text: "Value",
            },
          },
          title: {
            text: "Field Value Over Time (by Year)",
            align: "center",
          },
          grid: {
            borderColor: "#e7e7e7",
          },
          annotations: {
            points: annotations,
          },
        });

        setChartSeries(allSeries);
      })
      .catch((error) => {
        console.error("Error fetching the JSON data:", error);
      });
  }, []);

  return (
    <div className="flex overflow-x-auto justify-center items-center p-2">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="font-extrabold text-black text-4xl font-header my-5">NDVI Graph</h1>
        <div className="grid grid-cols-12 gap-4 mt-8 text-black">
          <div className="col-span-8">
            <ApexCharts options={chartOptions} series={chartSeries} type="line" height={350} />
          </div>
          <div className="col-span-4 flex flex-col items-start bg-gray-100 rounded-lg p-4">
            <h1 className="font-extrabold text-black text-4xl font-header my-3">Field Info</h1>

            <div className="space-y-2 w-full">
              <p>
                <span className="font-semibold">Location:</span> [Enter Location]
              </p>
              <p>
                <span className="font-semibold">Acres:</span> [Enter Acres]
              </p>
              <p>
                <span className="font-semibold">Avg. Harvests/Year:</span> [Enter Average Harvests]
              </p>
              <p>
                <span className="font-semibold">Avg. Time Between Harvests:</span> [Enter Average Time]
              </p>
            </div>

            {/* Horizontal line divider */}
            <div className="relative flex py-5 items-center w-full">
              <div className="flex-grow border-t-4 border-black"></div>
              <span className="flex-shrink mx-4 text-black">Funding info</span>
              <div className="flex-grow border-t-4 border-black"></div>
            </div>

            {/* Contributors section */}
            <div className="w-full space-y-2">
              <p>
                <span className="font-semibold">Contributors:</span> 69
              </p>
              <p>
                <span className="font-semibold">Seeking:</span> 30,000 USD
              </p>
              <p>
                <span className="font-semibold">Funded:</span> 13,500 USD
              </p>

              <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-black">Flowbite</span>
                <span className="text-sm font-medium text-green-700 text-black">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                <div className="bg-green-600 h-4 rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="font-extrabold text-black text-4xl font-header my-5">Satellite Images</h1>
        <div className="flex overflow-x-auto space-x-6 scrollbar-hide max-h-80 overflow-y-hidden">
          {data.length > 0 ? (
            data.map((entry: ChartData, index) => {
              if (entry.path && !entry.repeat) {
                return (
                  <div
                    key={index}
                    className="flex-none bg-white p-4 rounded-lg shadow-lg w-64 max-w-xs my-3 hover:shadow-2xl transition-shadow"
                  >
                    <img
                      src={`/${entry.path}`}
                      alt={`Image from ${entry.year}-${entry.month}-${entry.day}`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <p className="text-lg font-semibold text-gray-800">NDVI: {entry.value}</p>
                    <p className="text-sm text-gray-500">
                      {entry.year}-{entry.month}-{entry.day}
                    </p>
                  </div>
                );
              }
              return null;
            })
          ) : (
            <p className="text-xl text-gray-600">Loading data...</p>
          )}
        </div>
      </div>
    </div>
  );
}
