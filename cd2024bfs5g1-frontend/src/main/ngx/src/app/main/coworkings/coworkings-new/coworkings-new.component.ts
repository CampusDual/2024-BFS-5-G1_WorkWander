import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OFormComponent, DialogService, ODateInputComponent, OTranslateService, } from 'ontimize-web-ngx';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-coworking-new',
  templateUrl: './coworkings-new.component.html',
  styleUrls: ['./coworkings-new.component.css']
})
/**
 * Component responsible for handling the creation of new coworking spaces.
 * 
 * This component provides functionality to:
 * - Reset the form to its initial state upon successful insertion.
 * - Display a success message upon successful insertion.
 * - Filter start dates to allow only dates equal to or later than today.
 * - Update the filter for the end date input component based on the selected start date.
 * 
 * @implements {AfterViewInit}
 */
export class CoworkingsNewComponent implements AfterViewInit{

  public today: string= new Date().toLocaleDateString();

  @ViewChild('coworkingForm') coworkingForm: OFormComponent;
  @ViewChild('startDate') coworkingStartDate: ODateInputComponent;
  @ViewChild('endDate') coworkingEndDate: ODateInputComponent;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private translate: OTranslateService    
  ) {}
  ngAfterViewInit(): void {

    this.coworkingStartDate.onValueChange.subscribe(() => {
      this.updateEndDateFilter();
    });
  }

  /**
   *
   *
   * - Resets the form to its initial state.
   * - Displays an information message indicating that the operation was successful.
   */
  public onInsertSuccess(): void {
    // Reset the form to its initial state
    this.coworkingForm.setInitialMode();
   
    const successMessageTitle = this.translate.get('COWORKING_ADDED')
    const successMessageBody = this.translate.get('COWORKING_ADDED2');
 
    this.dialogService.info(successMessageTitle, successMessageBody);
    this.router.navigateByUrl("/main/mycoworkings")
  }

  /**
   * Filters the start dates to allow only dates equal to or later than today.
   *
   * @param date - The date to be filtered.
   * @returns boolean - True if the date is equal to or later than today, otherwise false.
   */
  filterStartDates = (date: Date): boolean => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return date >= currentDate; // Permitir solo fechas iguales o posteriores a hoy
  };

  /**
   * Updates the filter for the end date input component based on the selected start date.
   */
  public updateEndDateFilter(): void {
    const selectedStartDate = this.coworkingStartDate.getValue();
    if (selectedStartDate) {
      this.coworkingEndDate.filterDate = (date: Date) =>
        date >= selectedStartDate;
    }
  }
}
