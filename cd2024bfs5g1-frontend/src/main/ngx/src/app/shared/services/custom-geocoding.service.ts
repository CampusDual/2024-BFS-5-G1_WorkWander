import { HttpClient } from "@angular/common/http";
import { forwardRef, Inject, Injectable } from "@angular/core";
import { GeocodingService, Location } from "ontimize-web-ngx-map";
import { Observable, map } from "rxjs";

@Injectable()
export class CustomGeocodingService extends GeocodingService {


  geocode(address: string): Observable<any> {
    return this.httpClient
      .get('https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(address) + '&polygon_geojson=1&format=jsonv2')
      .pipe(map((result: any) => {
        if (!result.length) {
          throw new Error('unable to geocode address');
        }
        const locations = result.map(r => {
          const location = new Location();
          location.address = r.display_name;
          location.latitude = r.lat;
          location.longitude = r.lon;
          return location;
        });
        return locations;
      }));
  }
}