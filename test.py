import ee

# Initialize the Earth Engine API
ee.Authenticate()
ee.Initialize()

# Define an area of interest (latitude/longitude bounding box)
aoi = ee.Geometry.Rectangle([73.0, 18.0, 74.0, 19.0])  # Example coordinates

# Load Sentinel-2 surface reflectance data
collection = (
    ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate("2023-01-01", "2023-12-31")
    .filterBounds(aoi)
    .filter(ee.Filter.lt("CLOUDY_PIXEL_PERCENTAGE", 10))
)

# Select the NIR and RED bands
image = collection.median()  # Get a median composite image
nir = image.select("B8")
red = image.select("B4")

# Calculate NDVI
ndvi = nir.subtract(red).divide(nir.add(red)).rename("NDVI")

# Clip NDVI to the AOI
ndvi_clipped = ndvi.clip(aoi)

# Export or visualize
url = ndvi_clipped.getThumbURL({"min": 0, "max": 1, "region": aoi})
print(f"NDVI Image URL: {url}")
