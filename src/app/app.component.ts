import { Component, ViewChild } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { format } from 'date-fns';

import {
  ChartComponent
} from "ng-apexcharts";

export type ChartOptions = {
  series?: any;
  chart?: any;
  xaxis?: any;
  dataLabels?: any;
  grid?: any;
  stroke?: any;
  title?: any;
};

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild("chart1") chart1!: ChartComponent;
  @ViewChild("chart2") chart2!: ChartComponent;
  chartOptions1: ChartOptions = {
    series: [
      {
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "area",
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    title: {
      text: "Asset",
      align: "left"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], 
        opacity: 0.5
      }
    },
    xaxis: {
      categories: []
    }
  };
  chartOptions2: ChartOptions = {
    series: [
      {
        data: []
      }
    ],
    chart: {
      height: 350,
      type: "area",
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    title: {
      text: "AssetID",
      align: "left"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], 
        opacity: 0.5
      }
    },
    xaxis: {
      categories: []
    }
  };;
  url: string = 'https://api.multifarm.fi/jay_flamingo_random_6ix_vegas/get_assets?pg=1&tvl_min=50000&sort=tvlStaked&sort_order=desc&farms_tvl_staked_gte=10000000';

	get(url: string): Observable<any> {
    const header: any = { headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })};
		return this.http.get(url, header).pipe(catchError(this.handleError))
	}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log('An error occurred:', error.error.message);
    } else {
      console.log(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
}

  constructor(private http: HttpClient) {
    this.get(this.url).subscribe(
      data => {
        this.chart1.updateOptions({
          series: [{
            data: data.data.map((d: { aprDaily: number }) => d.aprDaily)
          }],
          xaxis: {
            categories: data.data.map((d: { asset: string }) => d.asset)
          }
        });
        this.chart2.updateOptions({
          series: [{
            data: data.data.map((d: { aprYearly: number }) => d.aprYearly * 0.02)
          }],
          xaxis: {
            categories: data.data.map((d: { assetId: string }) => d.assetId)
          }
        });
      }, error =>  console.log(error));
  }
}
