import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import ProgressBar from "../components/ProgressBar";
import ReactSpeedometer from "react-d3-speedometer";
import { useGlobalState } from "../context/GlobalStateProvider";
import { useMintUSDC } from "../hooks/useMintUSDC";
import { CropCashUSDCABI } from "../abis/CropCashUSDC";
import { createPublicClient, http } from "viem";
import { scrollSepolia } from "viem/chains";
import { useWeb3Auth } from "../context/Web3AuthProvider";
import { useContribute } from "../hooks/useContribute";

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

const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

export default function Chart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexOptions>({} as ApexOptions);
  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [predictedFullGrown, setPredictedFullGrown] = useState<string>("");
  const [monthsDifferenceInfo, setMonthsDiffrenceInfo] = useState<string>("");
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [usdcBalance, setUsdcBalance] = useState(0);
  const [contributionAmount, setContributionAmount] = useState(0);
  const { selectedLoan } = useGlobalState();
  const [raisedAmount, setRaisedAmount] = useState(selectedLoan.funded);
  const { smartWalletAddress } = useWeb3Auth();

  console.log("selectedLoan", selectedLoan);

  const { mintUSDC } = useMintUSDC();
  const { contribute } = useContribute();

  useEffect(() => {
    const getUSDCBalance = async () => {
      if (!smartWalletAddress) return;
      const data = await publicClient.readContract({
        address: import.meta.env.VITE_CROP_CASH_USDC,
        abi: CropCashUSDCABI,
        functionName: "balanceOf",
        args: [smartWalletAddress as `0x${string}`],
      });
      console.log("smartWalletAddress", smartWalletAddress);
      console.log("balance", data);
      setUsdcBalance(Number(data));
    };
    getUSDCBalance();
  }, [smartWalletAddress]);

  const handleMintUSDC = async () => {
    await mintUSDC();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await publicClient.readContract({
      address: import.meta.env.VITE_CROP_CASH_USDC,
      abi: CropCashUSDCABI,
      functionName: "balanceOf",
      args: [smartWalletAddress as `0x${string}`],
    });
    setUsdcBalance(Number(data));
  };

  const handleContribute = async () => {
    await contribute(selectedLoan.tokenId, contributionAmount);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const data = await publicClient.readContract({
      address: import.meta.env.VITE_CROP_CASH_USDC,
      abi: CropCashUSDCABI,
      functionName: "balanceOf",
      args: [smartWalletAddress as `0x${string}`],
    });
    setUsdcBalance(Number(data));
    setRaisedAmount((prev: number) => prev + contributionAmount);
  };

  const totalAmount = selectedLoan.askingLoan;
  // const contributors = 69;

  const confidenceValue = 41;

  const handleContributionClick = (amount: number) => {
    setContributionAmount(amount);
  };

  const toggleAccordion = () => {
    setIsAccordionOpen((prev) => !prev);
  };

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

        const groupedData = fetchedData.reduce((acc, entry) => {
          const year = entry.year;
          if (!acc[year]) acc[year] = [];
          acc[year].push(entry);
          return acc;
        }, {} as Record<number, ChartData[]>);

        const allSeries: any = [];
        const annotations: any = [];
        const fullGrownDates: Date[] = [];
        const harvestDates: Date[] = [];

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

        Object.keys(groupedData).forEach((year) => {
          const yearData = groupedData[parseInt(year)];
          const values = sortedDates.map((date) => {
            const entry = yearData.find((e) => `${e.year}-${e.month}-${e.day}` === date);
            return entry ? parseFloat(entry.value) : 0;
          });

          let fullGrownMarked = false;
          let harvestMarked = false;

          values.forEach((value, index) => {
            if (value >= 60 && !fullGrownMarked) {
              const fullGrownDate = dates[index];
              annotations.push({
                x: sortedDates[index],
                y: value,
                marker: {
                  size: 6,
                  fillColor: "#FF5733",
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
              fullGrownDates.push(fullGrownDate);
              fullGrownMarked = true;
              harvestMarked = false;
            }

            if (fullGrownMarked && value <= 10 && !harvestMarked) {
              const harvestDate = dates[index];
              annotations.push({
                x: sortedDates[index],
                y: value,
                marker: {
                  size: 6,
                  fillColor: "#28A745",
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
              harvestDates.push(harvestDate);
              harvestMarked = true;
              fullGrownMarked = false;
            }
          });

          allSeries.push({
            name: `${year}`,
            data: values,
          });
        });

        // Calculate median intervals and predict next events
        // const calculateMedianInterval = (dates: Date[]) => {
        //   if (dates.length < 2) return 0;
        //   const intervals = dates.slice(1).map((date, index) => {
        //     return (date.getTime() - dates[index].getTime()) / (1000 * 60 * 60 * 24);
        //   });
        //   intervals.sort((a, b) => a - b);
        //   const mid = Math.floor(intervals.length / 2);
        //   return intervals.length % 2 === 0
        //     ? Math.round((intervals[mid - 1] + intervals[mid]) / 2)
        //     : Math.round(intervals[mid]);
        // };

        // Calculate the month difference between two dates
        const calculateMonthDifference = (startDate: Date, endDate: Date) => {
          const yearsDifference = endDate.getFullYear() - startDate.getFullYear();
          const monthsDifference = endDate.getMonth() - startDate.getMonth();

          setMonthsDiffrenceInfo("6");

          // Convert years to months and add the months difference
          return yearsDifference * 12 + monthsDifference;
        };

        if (fullGrownDates.length > 0) {
          const lastFullGrownDate = fullGrownDates[fullGrownDates.length - 1];

          // Set median interval (assumed to be 6 months)
          const fullGrownMedianInterval = 6;

          // Calculate the next full-grown date based on the median interval in months
          let nextFullGrownDate = new Date(lastFullGrownDate);
          nextFullGrownDate.setMonth(nextFullGrownDate.getMonth() + fullGrownMedianInterval);

          // If nextFullGrownDate is before the last full-grown date (in the past), adjust it by adding 12 months
          if (nextFullGrownDate < lastFullGrownDate) {
            nextFullGrownDate.setMonth(nextFullGrownDate.getMonth() + 12); // Add one more year if it is in the past
          }

          const predictedMonth = nextFullGrownDate.toLocaleString("default", { month: "long" });
          const predictedYear = nextFullGrownDate.getFullYear();

          setPredictedFullGrown(`${predictedMonth} ${predictedYear}`);

          //   console.log("Last Full Grown Date:", lastFullGrownDate);
          //   console.log("Next Full Grown Date:", nextFullGrownDate);

          // Calculate months between the last full-grown date and the next full-grown date using the helper function
          const monthDifference = calculateMonthDifference(lastFullGrownDate, nextFullGrownDate);

          console.log("Month Difference:", monthDifference); // Check the calculated difference

          // Fill prediction data with 0s up to the next full-grown date
          const predictionValues: { date: string; value: number }[] = [];

          // Use lastFullGrownDate for the prediction start point
          let currentMonth = lastFullGrownDate.getMonth();
          let currentYear = lastFullGrownDate.getFullYear();

          for (let i = 0; i <= monthDifference; i++) {
            const monthDate = new Date(currentYear, currentMonth, 1);
            const formattedDate = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}-01`;
            if (i === monthDifference) {
              // Set value to 69 for the next full-grown month
              predictionValues.push({ date: formattedDate, value: 69 });
            } else {
              // Set value to 0 for months leading up
              predictionValues.push({ date: formattedDate, value: 0 });
            }

            // Console out each month and its predicted value
            // console.log(`Month: ${formattedDate}, Predicted Value: ${i === monthDifference ? 69 : 0}`);

            // Move to the next month
            currentMonth++;
            if (currentMonth > 11) {
              currentMonth = 0;
              currentYear++;
            }
          }
        }

        // Add dashed styles to predicted lines
        const updatedChartOptions = {
          ...chartOptions,
          stroke: {
            ...chartOptions.stroke,
            dashArray: [0, 8],
          },
        };
        setChartOptions(updatedChartOptions);
        setChartSeries(allSeries);

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
    <div className="flex overflow-x-auto justify-center items-center p- mt-32">
      <div className="w-full bg-white p-6 rounded-lg shadow-lg my-5">
        <h1 className="font-extrabold text-black text-4xl font-header">Crops Growth Graph</h1>
        <div className="grid grid-cols-12 gap-4 mt-8 text-black">
          <div className="col-span-4 flex flex-col items-center justify-start bg-gray-100 rounded-lg p-4 h-full">
            <h1 className="font-extrabold text-black text-4xl font-header mt-3">Confidence Score</h1>

            <div className="flex h-full justify-center items-center flex-col">
              <ReactSpeedometer maxValue={100} value={confidenceValue} width={300} height={200} />

              {/* Conditional message based on the value */}
              <p
                className={`font-semibold text-xl ${
                  confidenceValue <= 20
                    ? "text-red-500"
                    : confidenceValue <= 40
                    ? "text-red-600"
                    : confidenceValue <= 60
                    ? "text-yellow-500"
                    : confidenceValue <= 80
                    ? "text-green-500"
                    : "text-green-700"
                }`}
              >
                {confidenceValue <= 20
                  ? "Very Bad"
                  : confidenceValue <= 40
                  ? "Bad"
                  : confidenceValue <= 60
                  ? "Moderate"
                  : confidenceValue <= 80
                  ? "Good"
                  : "Very Good"}
              </p>
            </div>
          </div>
          <div className="col-span-4 flex flex-col items-start bg-gray-100 rounded-lg p-4 shadow-lg border-2 border-green-500">
            <div className="w-full space-y-2">
              <h1 className="font-extrabold text-black text-4xl font-header my-3 text-center">Funding</h1>
              <p>
                <span className="font-semibold">
                  APR: <span className="text-green-500">11.27%</span>
                </span>
              </p>
              <p>
                <span className="font-semibold">Total Contributors:</span> 69
              </p>
              <p>
                <span className="font-semibold">Average Contributed:</span> 765$
              </p>
              <ProgressBar funded={raisedAmount} total={totalAmount} />

              {/* Input field for contribution amount */}
              <div className="flex flex-row py-10">
                <input
                  type="text"
                  value={`${contributionAmount}$`}
                  onChange={(e) => setContributionAmount(Number(e.target.value.replace(/[^0-9]/g, "")))}
                  placeholder="Enter custom amount ($)"
                  className="appearance-none pt-3 pb-3 w-full text-center rounded-lg bg-transparent text-3xl font-extrabold mr-0 pr-0 focus:outline-none text-green-700"
                />
                {/* <span className="pr-3 pb-3 pt-3 text-black text-lg font-semibold">$</span> */}
              </div>

              {/* Predefined buttons */}
              <div className="flex justify-between mt-4 gap-x-4">
                <button
                  onClick={() => handleContributionClick(250)}
                  className="w-1/3 p-2 bg-green-500 text-white rounded-lg"
                >
                  250$
                </button>
                <button
                  onClick={() => handleContributionClick(500)}
                  className="w-1/3 p-2 bg-green-500 text-white rounded-lg"
                >
                  500$
                </button>
                <button
                  onClick={() => handleContributionClick(1000)}
                  className="w-1/3 p-2 bg-green-500 text-white rounded-lg"
                >
                  1000$
                </button>
              </div>

              {/* Contribute button */}
              <button className="w-full text-white bg-green-700 py-2 rounded">🚜 Fund Farmer!</button>
            </div>
          </div>

          <div className="col-span-4 flex flex-col items-start bg-gray-100 rounded-lg p-4">
            <div className="w-full">
              <h1 className="font-extrabold text-black text-4xl font-header mb-6 text-center">Farmer Info</h1>

              <div className="grid grid-cols-1 gap-4">
                {/* Verification Box */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-2 text-gray-700">Verification</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">KYC status:</span> verified ✅
                    </p>
                    <p>
                      <span className="font-semibold">Attestation:</span>{" "}
                      <a
                        href="https://testnet-scan.sign.global/attestation/onchain_evm_534351_0x68"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </a>
                    </p>
                  </div>
                </div>

                {/* Field Details Box */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-2 text-gray-700">Field Details</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Location:</span> <span className="font-5xl">🇲🇾</span>
                    </p>
                    <p>
                      <span className="font-semibold">Size:</span> {selectedLoan.fieldSize} Ha
                    </p>
                  </div>
                </div>

                {/* Harvest Information Box */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h2 className="font-bold text-lg mb-2 text-gray-700">Harvest Information</h2>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Avg. Harvests/Year:</span> {selectedLoan.avgHarvestPerYear}
                    </p>
                    <p>
                      <span className="font-semibold">Avg. Time Between Harvests:</span>{" "}
                      {selectedLoan.avgTimeBetweenHarvest} Months
                    </p>
                    <p>
                      <span className="font-semibold">EST. next full Grown: </span> {predictedFullGrown} (in{" "}
                      {monthsDifferenceInfo} months)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 my-3">
          <div className="w-full h-96">
            <ApexCharts className="text-black" options={chartOptions} series={chartSeries} type="line" height="100%" />
          </div>
        </div>
        {/* Accordion Toggle Button */}
        <h1 className="font-extrabold text-black text-4xl font-header my-5">Satellite Images</h1>
        <button onClick={toggleAccordion} className="text-white bg-blue-500 p-2 mb-4">
          {isAccordionOpen ? "Hide Satellite Images (Click to hide)" : "Show Satellite Images (Click to expand)"}
        </button>

        {/* Accordion content */}
        {isAccordionOpen && (
          <>
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
                <p>No data available</p>
              )}
            </div>
            <button onClick={handleMintUSDC}>Mint CropCashUSDC</button>
          </>
        )}
      </div>
    </div>
  );
}
