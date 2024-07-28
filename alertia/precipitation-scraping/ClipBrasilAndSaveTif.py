import os
import geopandas
import xarray
from pathlib import Path
from shapely.geometry import mapping

class ClipBrasilAndSaveTif:
    def __init__(self,  date):
        self.date = date
        self.brasil_shapefile = geopandas.read_file("shapefiles/brasil/GEOFT_PAIS.shp")
        self.brasil_shapefile.set_crs(epsg=4326, allow_override=True, inplace=True)
        self.nc4_path = "nc4"

    def execute(self):
        current_year = str(self.date.year)
        current_month = "{:02d}".format(self.date.month)
        current_day = "{:02d}".format(self.date.day)
        filename = f"{current_year}{current_month}{current_day}.nc4"
        file = os.path.join(self.nc4_path, filename)
        if os.path.isfile(file):
            xds = xarray.load_dataset(file, decode_times=False)
            xds = xds.precipitationCal
            xds = xds.transpose("time", "lat", "lon")
            xds = xds.rio.set_spatial_dims(x_dim="lon", y_dim="lat")
            xds.rio.write_crs("EPSG:4326", inplace=True)
            if not os.path.exists("tifs_clipped"):
                os.mkdir("tifs_clipped")
            xds.rio.clip(self.brasil_shapefile.geometry.apply(mapping)).rio.to_raster(f"tifs_clipped/{filename}.tif")
            #Apago o tif nao clipado
            Path(file).unlink(missing_ok=False)
