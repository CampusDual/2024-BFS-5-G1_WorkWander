import { Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  DialogService,
  OntimizeService,
  OSnackBarConfig,
  OTableComponent,
  OTranslateService,
  SnackBarService,
} from "ontimize-web-ngx";
import { UtilsService } from "src/app/shared/services/utils.service";
import { BookingRateComponent } from "../booking-rate/booking-rate.component";
import { OMapComponent } from "ontimize-web-ngx-map";

@Component({
  selector: "app-bookings-home",
  templateUrl: "./bookings-home.component.html",
  styleUrls: ["./bookings-home.component.css"],
})
export class BookingsHomeComponent {
  public dateStart = this.utils.dateStartFunction;
  public dateEnd = this.utils.dateEndFunction;

  @ViewChild("table") table: OTableComponent;
  @ViewChild("coworking_map") coworking_map: OMapComponent;

  public dates = [];
  public mapVisible = false;

  leafletMap: any;

  constructor(
    private router: Router,
    private service: OntimizeService,
    protected utils: UtilsService,
    private dialogService: DialogService,
    private translate: OTranslateService,
    private snackBarService: SnackBarService,
    protected dialog: MatDialog
  ) {}

  toCoworkingDetail(event) {
    console.log(event);
    if (event.columnName == "rate") {
      this.openValoration(event);
    } else if (event.columnName == "cancelCWbooking") {
      this.cancelBooking(event);
    } else {
      this.router.navigate(["/main/coworkings/" + event.row.bk_cw_id]);
    }
  }

  cancelBooking(evt: any) {
    var confirmMessageTitle = this.translate.get("CANCEL");
    var confirmMessageBody = this.translate.get("VERIFY_CANCEL_BOOKING");
    var cancelledMessage = this.translate.get("CANCELLED_BOOKING");
    var cancelledMessage2 = this.translate.get("CANCELLED_BOOKING2");

    var currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    var startDate = new Date(evt.row.date_start);
    startDate.setHours(0, 0, 0, 0);
    var endDate = new Date(evt.row.date_end);
    endDate.setHours(0, 0, 0, 0);

    if (evt.row.bk_state) {
      if (currentDate < startDate) {
        if (this.dialogService) {
          this.dialogService.confirm(confirmMessageTitle, confirmMessageBody);
          this.dialogService.dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.updateState(evt.row.bk_id);
              this.table.reloadData();
            }
          });
        }
      } else {
        this.showAvailableToast(cancelledMessage2);
      }
    } else {
      this.showAvailableToast(cancelledMessage);
    }
  }

  updateState(id: any) {
    const filter = {
      bk_state: false,
    };

    const keyMap = { bk_id: id };
    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);
    this.service.update(keyMap, filter, "booking").subscribe((data) => {
      this.showAvailableToast("CANCEL_CW_BOOKING_CONFIRMED");
    });
  }

  showAvailableToast(mensaje?: string) {
    const availableMessage = mensaje;
    const configuration: OSnackBarConfig = {
      milliseconds: 3000,
      icon: "info",
      iconPosition: "left",
    };
    this.snackBarService.open(availableMessage, configuration);
  }

  openValoration(evt): void {
    const stado = this.utils.calculateState(evt.row);

    if (stado === "Finalizada" && evt.row.bkr_ratio == undefined) {
      this.dialog.open(BookingRateComponent, {
        height: "50%",
        width: "40%",
        data: {
          name: evt.row.cw_name,
          rate: evt.row.bkr_ratio,
          bk_id: evt.row.bk_id,
          cw_id: evt.row.bk_cw_id,
          usr_id: evt.row.bk_usr_id,
        },
      });
    }
  }

  inicializarMapa(lat, lon, name): void {
    // this.leafletMap = this.coworking_map.getMapService().getMap();
    let mapLat = lat;
    let mapLon = lon;

    if (mapLat && mapLon) {
      this.updateMapAndMarker(`${lat};${lon}`, 6, name);
      return;
    }
  }

  protected updateMapAndMarker(
    coordinates: string,
    zoom: number,
    markerLabel: string | null
  ) {
    const [lat, lon] = coordinates.split(";").map(Number);
    this.leafletMap.setView([+lat, +lon], zoom);
    if (markerLabel) {
      this.coworking_map.addMarker(
        markerLabel, // id
        lat, // latitude
        lon, // longitude
        {}, // options
        markerLabel, // popup
        false, // hidden
        true, // showInMenu
        markerLabel // menuLabel
      );
    }
  }

  async acercar(data) {
    this.coworking_map
      .getMapService()
      .setCenter(data["cw_lat"], data["cw_lon"]);
    await this.delay(300);
    this.coworking_map.getMapService().setZoom(16);
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  showHideMap() {
    this.mapVisible = !this.mapVisible;

    if (!this.mapVisible) {
      this.dates = [];
    }

    const filter = {
      bk_state: true,
    };
    const columns = ["cw_name", "cw_lat", "cw_lon", "bk_state", "dates"];

    const conf = this.service.getDefaultServiceConfiguration("bookings");
    this.service.configureService(conf);

    this.service.query(filter, columns, "datesByBooking").subscribe((resp) => {
      this.leafletMap = this.coworking_map.getMapService().getMap();

      for (let index = 0; index < resp.data.length; index++) {
        if (
          this.utils.calculateState(resp.data[index]) == "Pendiente" ||
          this.utils.calculateState(resp.data[index]) == "En curso"
        ) {
          this.dates.push(resp.data[index]);

          this.inicializarMapa(
            resp.data[index]["cw_lat"],
            resp.data[index]["cw_lon"],
            resp.data[index]["cw_name"]
          );
        }
      }
    });
  }
}
