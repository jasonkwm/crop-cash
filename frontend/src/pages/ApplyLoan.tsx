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
  const [landOwnership, setLandOwnership] = useState<File | null>(null);

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
    <div className="flex flex-col p-6 space-y-6 items-center justify-center w-full">
      <div className="flex flex-col w-full max-w-4xl space-y-6 md:space-y-0 items-center justify-center">
        {/* Step 1: Draw Farm Boundary */}
        <div
          className={`transition-all duration-500 transform ${
            markers.length <= 3 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute"
          }`}
        >
          {markers.length <= 3 && (
            <>
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <LoadScript googleMapsApiKey={import.meta.env.VITE_GMAPS_API_KEY || ""}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
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
              <div className="text-center p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-md mt-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Step 1: Draw Your Farm Boundary</h2>
                <p className="text-gray-700 mb-2">Click on the map to add points around your farm</p>
                <p className="text-sm text-gray-500">Need at least 4 points to continue</p>
              </div>
            </>
          )}
        </div>

        {/* Step 2: Upload Land Ownership Document */}
        <div
          className={`transition-all duration-500 transform ${
            markers.length >= 4 && !cropType && !landOwnership
              ? "opacity-100 translate-x-0 mt-4"
              : "opacity-0 translate-x-full absolute"
          }`}
        >
          {markers.length >= 4 && !cropType && (
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Step 2: Verify Land Ownership</h2>
              <p className="text-gray-700 mb-4">
                Please upload a PDF document that verifies your ownership of this land
              </p>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setLandOwnership(file as File);
                  }}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100
                    cursor-pointer"
                />
                <p className="text-xs text-gray-500">Only PDF files are accepted. Maximum size: 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Select Crop Type */}
        <div
          className={`transition-all duration-500 transform ${
            markers.length >= 4 && !cropType && landOwnership
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full absolute"
          }`}
        >
          {markers.length >= 4 && !cropType && (
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Step 3: Select Your Crop</h2>
              <div className="mb-4">
                <span className="text-gray-700">
                  Farm size: <span className="font-semibold">{calculateAreaHectares(markers).toFixed(1)} hectares</span>
                </span>
              </div>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              >
                <option value="">Select crop type</option>
                {cropOptions.map((crop, index) => (
                  <option key={index} value={crop.cropType}>
                    {crop.cropType}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Step 4: Select Loan Amount */}
        <div
          className={`transition-all duration-500 transform ${
            markers.length >= 4 && cropType && !loading
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-full absolute"
          }`}
        >
          {markers.length >= 4 && cropType && !loading && (
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Step 4: Select Loan Amount</h2>
              <div className="flex flex-col mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-gray-700">
                  Farm size: <span className="font-semibold">{calculateAreaHectares(markers).toFixed(1)} hectares</span>
                </span>
                <span className="text-gray-700">
                  Crop: <span className="font-semibold">{cropType}</span>
                </span>
                <span className="text-gray-700">
                  Maximum loan:{" "}
                  <span className="font-semibold">
                    {new Intl.NumberFormat("en-US", {
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

              <label className="block text-gray-700 text-sm font-semibold mb-2">Loan Amount</label>
              <input
                type="range"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full mb-4"
                min="0"
                max={
                  calculateAreaHectares(markers) *
                  (cropOptions.find((crop) => crop.cropType === cropType)?.tonPerHectare || 0) *
                  (cropOptions.find((crop) => crop.cropType === cropType)?.pricePerTon || 0)
                }
                step="100"
              />
              <div className="text-center text-xl font-bold text-gray-800 mb-6">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                }).format(loanAmount)}
              </div>

              <button
                onClick={handleSubmit}
                className="w-full p-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                disabled={loanAmount <= 0}
              >
                Apply For Loan
              </button>
            </div>
          )}
        </div>

        {/* Loading/Processing Step */}
        <div
          className={`transition-all duration-500 transform ${
            loading ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full absolute"
          }`}
        >
          {loading && (
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Processing Your Application</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{status > 0 ? "✅" : "⏳"}</span>
                  <span className="text-gray-700">Verifying Identity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{status > 1 ? "✅" : "⏳"}</span>
                  <span className="text-gray-700">Verifying Ownership</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{status > 2 ? "✅" : "⏳"}</span>
                  <span className="text-gray-700">Verifying Crop Cycle</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
