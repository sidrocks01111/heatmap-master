import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HeatMap, Legend, Tooltip, ILoadedEventArgs, ITooltipEventArgs, HeatMapTheme } from '@syncfusion/ej2-angular-heatmap';
// import { SampleDataSource } from './calendar-data-source';
import { Internationalization } from '@syncfusion/ej2-base';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppServiceService } from './app-service.service';
import { users } from './users';
import { redrawElement } from '@syncfusion/ej2-angular-charts';
import { variable } from '@angular/compiler/src/output/output_ast';


//Package property inject

HeatMap.Inject(Tooltip, Legend);

// Selectors 

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None

})


// Appcomponent class 

export class AppComponent implements OnInit {

    title: String = "Heatmap"; // title

    public height: String = '401px';

    // heading plus its css 

    titleSettings: Object = {
        text: 'Annual Summary of User Activities in Rayeye',
        textStyle: {
            size: '15px',
            fontWeight: '500',
            fontStyle: 'Normal',
            fontFamily: 'Segoe UI'

        }
    };

    // x-axis configuration 

    xAxis: Object = {
        opposedPosition: true,

        valueType: 'DateTime',
        minimum: new Date(2021, 2, 1),
        maximum: new Date(2021, 4, 1),
        intervalType: 'Days',
        showLabelOn: 'Months',
        labelFormat: 'MMM', // level of months
        increment: 7,
        labelIntersectAction: 'Rotate45',
    };

    // y-axis config 

    yAxis: Object = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        isInversed: true,
    };

    // cell setting 

    public cellSettings: Object = {
        showLabel: true,
        enableCellHighlighting: true, //hover effect
        border: { //border settings of heatmap
            width: 1,
            radius: 1,
            color: 'green'
        }
    };

    // palette setting 

    public paletteSettings: Object = {
        palette: [{ value: 0, color: 'yellow', label: 'no checklists' },
        { value: 1, color: 'blue', label: '1-9 checklists' },
        { value: 10, color: 'red', label: '>10 checklists' },

        ],
        type: 'Fixed', //means color are of fixed type not gradient type
        emptyPointColor: 'white' // color of cell with no value
    };

    // legend settings 

    public legendSettings: Object = {
        position: 'Bottom',
        width: '20%',
        alignment: 'Near',
        showLabel: true,
        labelDisplayType: 'None',
        enableSmartLegend: true //view of legend
        // title: {
        //     text: "Variations"
        // }
    };

    // tooltip config 

    public tooltipRender(args: ITooltipEventArgs): void {
        let intl: Internationalization = new Internationalization(); // creating object of class internationalization to use its functions
        let format: Function = intl.getDateFormat({ format: 'EEE MMM dd, yyyy' });
        let newDate: Date = <Date>args.xValue;
        let date: Date = new Date(newDate.getTime());
        let axisLabel: string[] = args.heatmap.axisCollections[1].axisLabels;
        let index: number = axisLabel.indexOf(args.yLabel);
        (date).setDate((date).getDate() + index);
        let value: string = format(date);
        args.content = [(args.value === 0 ? 'No' : args.value) + ' ' + 'checklists' + '<br>' + value];
    };

    // load config 

    public load(args: ILoadedEventArgs): void {
        // alert('HeatMap loaded successfully');
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.heatmap.theme = <HeatMapTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    };


    dataSource: Object[]; // creating datasource object


    // constructor
    constructor(private app: AppServiceService) { } // calling service

    // ngoninit function 
    ngOnInit(): void {
        this.app.getdata().subscribe((response) => { //getting json file as response from localhost:3000

            //    console.log(response);


            // running a loop to map the date with their checklists and store in hash

            var hash = {};

            for (let element in response) {

                hash[response[element].Date] = response[element].Checklists;

            }

            // inserting values to the dataSource of the component 

            // definig variables 

            // date range 
            var maxDate = new Date(2021, 5, 1);
            var minDate = new Date(2021, 3, 1);

            // arrays 
            var arr_main = [];
            var arr_local = [];

            var new_date: string;
            var count: number = 0; // count for arr_local
            var countmain: number = 0; //count for arr_main

            while (minDate < maxDate || count > 0) {

                //   Forming date and storing in string variable 
                new_date = minDate.getFullYear().toString() + "-";

                if (minDate.getMonth() > 9) {
                    new_date += minDate.getMonth().toString() + "-";
                }
                else {
                    new_date += "0" + minDate.getMonth().toString() + "-";
                }

                if (minDate.getDate() > 9) {
                    new_date += minDate.getDate().toString();
                }
                else {
                    new_date += "0" + minDate.getDate().toString();
                }

                // matching the date with the checklists

                // dates with no records give undefined values which will return 0 

                if (hash[new_date] === undefined) arr_local[count] = 0;
                else arr_local[count] = hash[new_date];

                // inserting values in main array 
                count++;
                if (count > 6) {
                    arr_main[countmain++] = arr_local;
                    arr_local = [];
                    count = 0;
                }

                //    console.log(new_date);

                minDate.setDate(minDate.getDate() + 1);

            }

           

            //  giving values to dataSource 

            this.dataSource = arr_main;


        },
            // checking for error 
            (error) => {
                console.log("error occured :" + error);
            }
        )
    }




}





