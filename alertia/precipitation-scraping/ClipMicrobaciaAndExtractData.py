import rioxarray
from shapely.geometry import mapping
import geopandas

class ClipMicrobaciaAndExtractData:
    def __init__(self, date, microbacia_id):
        current_year = str(date.year)
        current_month = "{:02d}".format(date.month)
        current_day = "{:02d}".format(date.day)
        tif = rioxarray.open_rasterio(f"tifs_clipped/{current_year}{current_month}{current_day}.nc4.tif")
        shapefile = geopandas.read_file(f"shapefiles/microbacias/{microbacia_id}.shp")
        shapefile.set_crs(epsg=4326, allow_override=True, inplace=True)
        self.clipped = tif.rio.clip(shapefile.geometry.apply(mapping))[0]

    def execute(self):
        chuvas = []
        for i in range(self.clipped.shape[0]):
            for j in range(self.clipped.shape[1]):
                latitude = float(self.clipped[i][j].coords["y"])
                longitude = float(self.clipped[i][j].coords["x"])
                value = self.clipped[i][j].values.item(0)
                if (value >= 0):
                    chuvas.append({
                        "latitude": latitude,
                        "longitude": longitude,
                        "value": value,
                    })
        print(chuvas)
