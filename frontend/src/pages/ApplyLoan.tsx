"use client";
import { useState } from "react";
import { GoogleMap, LoadScript, Marker, Polygon } from "@react-google-maps/api";
import * as geometry from "spherical-geometry-js";

// Function to calculate the area of a polygon in hectares
function calculateAreaHectares(coords: any) {
  if (coords.length < 3) return 0;
  try {
    var latLngs = coords.map(function (coord: any) {
      return new geometry.LatLng(coord.lat, coord.lng);
    });

    return geometry.computeArea(latLngs) / 10000; //return the area
  } catch (e) {
    console.log(e);
    return 0;
  }
}

const ApplyLoan = () => {
  const [markers, setMarkers] = useState<any>([]);
  const [cropType, setCropType] = useState<string>("");
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(0);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: 5.350846,
    lng: 100.201144,
  };

  const polygonOptions = {
    fillColor: "#00FF00",
    fillOpacity: 0.4,
    strokeColor: "#00FF00",
    strokeOpacity: 0.8,
    strokeWeight: 2,
  };

  const cropOptions = [
    {
      cropType: "🍚 Rice",
      tonPerHectare: 4,
      pricePerTon: 269,
    },
    {
      cropType: "🌾 Wheat",
      tonPerHectare: 3,
      pricePerTon: 250,
    },
    {
      cropType: "🥔 Potato",
      tonPerHectare: 30,
      pricePerTon: 250,
    },
    {
      cropType: "🥕 Carrot",
      tonPerHectare: 25,
      pricePerTon: 500,
    },
    {
      cropType: "🍌 Banana",
      tonPerHectare: 25,
      pricePerTon: 700,
    },
    {
      cropType: "🍅 Tomato",
      tonPerHectare: 40,
      pricePerTon: 600,
    },
    {
      cropType: "🥬 Cabbage",
      tonPerHectare: 40,
      pricePerTon: 250,
    },
    {
      cropType: "🍓 Strawberry",
      tonPerHectare: 40,
      pricePerTon: 250,
    },
  ];

  const handleMapClick = (event: any) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    const isSamePoint = markers.some(
      (marker: any) => marker.lat.toFixed(5) === lat.toFixed(5) && marker.lng.toFixed(5) === lng.toFixed(5)
    );

    if (!isSamePoint) {
      setMarkers([...markers, { lat, lng }]);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setStatus(0); // Reset status to an array of zeros

    // Simulate checking process
    setTimeout(() => {
      setStatus((prevStatus: any) => {
        return prevStatus + 1;
      });
      setTimeout(() => {
        setStatus((prevStatus: any) => {
          return prevStatus + 1;
        });
        setTimeout(() => {
          setStatus((prevStatus: any) => {
            return prevStatus + 1;
          });
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 items-center justify-center w-full">
      <div className="flex flex-col w-full max-w-4xl space-y-6 md:space-y-0 items-center justify-center">
        {/* Map Section - Moved to right side */}
        <div
          className={`w-full ${
            markers.length >= 4 ? "h-[50vh]" : "h-96"
          } transition-all duration-300 rounded-lg overflow-hidden shadow-lg border border-gray-200 items-center justify-center sticky top-0`}
        >
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GMAPS_API_KEY || ""}>
            <GoogleMap
              mapContainerStyle={{ ...mapContainerStyle, height: markers.length >= 4 ? "50vh" : "400px" }}
              center={center}
              zoom={14}
              mapTypeId="satellite"
              onClick={handleMapClick}
            >
              {markers.map((marker: any, index: any) => (
                <Marker key={index} position={marker} />
              ))}
              {markers.length > 1 && <Polygon paths={markers} options={polygonOptions} />}
            </GoogleMap>
          </LoadScript>
        </div>
        {/* Form Section - Moved to top for better UX flow */}
        <div className="w-full md:w-1/2 space-y-6 flex flex-col pt-3 items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col">
            {markers.length <= 3 ? (
              <div className="text-center p-4">
                <p className="text-gray-700 mb-4">Please select your farm on the map</p>
                <p className="text-sm text-gray-500">Click on the map to add points around your farm boundary</p>
              </div>
            ) : (
              <>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Crop Type</label>
                <select
                  value={cropType}
                  onChange={(e) => {
                    setCropType(e.target.value);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  disabled={loading}
                >
                  <option value="">Select crop</option>
                  {cropOptions.map((crop, index) => (
                    <option key={index} value={crop.cropType}>
                      {crop.cropType}
                    </option>
                  ))}
                </select>

                <div className="flex flex-col mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700">
                    Farm size:{" "}
                    <span className="font-semibold">{calculateAreaHectares(markers).toFixed(1)} hectares</span>
                  </span>
                  <span className="text-gray-700">
                    Maximum loan:{" "}
                    <span className="font-semibold">
                      {cropType &&
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(
                          calculateAreaHectares(markers) *
                            (cropOptions.find((crop) => crop.cropType === cropType)?.tonPerHectare || 0) *
                            (cropOptions.find((crop) => crop.cropType === cropType)?.pricePerTon || 0)
                        )}
                    </span>
                  </span>
                </div>

                <label className="block text-gray-700 text-sm font-semibold mb-2 mt-4">Loan Amount</label>
                <input
                  type="range"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  disabled={loading}
                  min="0"
                  max={
                    cropType &&
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(loanAmount)
                      ? calculateAreaHectares(markers) *
                        (cropOptions.find((crop) => crop.cropType === cropType)?.tonPerHectare || 0) *
                        (cropOptions.find((crop) => crop.cropType === cropType)?.pricePerTon || 0)
                      : 0
                  }
                  step="100"
                />

                <button
                  onClick={handleSubmit}
                  className="w-full p-3 mt-6 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  disabled={loading || !cropType || loanAmount <= 0 || markers.length < 3}
                >
                  Request Loan{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(loanAmount)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex mt-8 flex-col items-start justify-start p-6 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xl">{status > 0 ? "✅" : "⏳"}</span>
            <span className="text-gray-700">Verifying Identity</span>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-xl">{status > 1 ? "✅" : "⏳"}</span>
            <span className="text-gray-700">Verifying Ownership</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">{status > 2 ? "✅" : "⏳"}</span>
            <span className="text-gray-700">Verifying Crop Cycle</span>
          </div>
        </div>
      )}

      {/* <button
        onClick={() => setMarkers([])}
        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600"
      >
        Restart
      </button> */}
    </div>
  );
};

export default ApplyLoan;
