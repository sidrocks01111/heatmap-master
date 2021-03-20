import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HeatMap, Legend, Tooltip, ILoadedEventArgs, ITooltipEventArgs, HeatMapTheme } from '@syncfusion/ej2-angular-heatmap';
// import { SampleDataSource } from './calendar-data-source';
import { Internationalization } from '@syncfusion/ej2-base';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppServiceService } from './app-service.service';
import { users } from './users';


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
        maximum: new Date(2021, 2, 21),
        intervalType: 'Days',
        showLabelOn: 'Months',
        labelFormat: 'MMM',
        increment: 7,
        labelIntersectAction: 'Rotate45',
    };

    // y-axis config 

    yAxis: Object = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isInversed: true,
    };

    // cell setting 

    public cellSettings: Object = {
        showLabel: true,
        border: {
            color: 'white'
        }
    };

    // palette setting 

    public paletteSettings: Object = {
        palette: [{ value: 0, color: 'yellow', label: 'no checklists' },
        { value: 1, color: 'blue', label: '1-9 checklists' },
        { value: 10, color: 'red', label: '>10 checklists' },

        ],
        type: 'Fixed',
        emptyPointColor: 'white'
    };

    // legend settings 

    public legendSettings: Object = {
        position: 'Bottom',
        width: '20%',
        alignment: 'Near',
        showLabel: true,
        labelDisplayType: 'None',
        enableSmartLegend: true
    };

    // tooltip config 

    public tooltipRender(args: ITooltipEventArgs): void {
        let intl: Internationalization = new Internationalization();
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
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.heatmap.theme = <HeatMapTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    };


    dataSource: Object[]; // creating datasource object

    // constructor 

    constructor(private app: AppServiceService) { } // calling service

    // ngoninit function 

    ngOnInit(): void {
        this.app.getdata().subscribe
            (
                (response) => { //getting json file as response from localhost:3000


                    var outputArray = []; //defining array

                    // running a loop to store json objects in array 

                    for (let element in response) {
                        outputArray.push({
                            // extracting checklist data from the json response 
                            name: response[element].Checklists
                        });
                    }
                    //  injecting the checklists data to the data source of heatmap 
                    this.dataSource = [
                        [outputArray[0].name, outputArray[1].name, outputArray[2].name, outputArray[3].name, outputArray[4].name, outputArray[5].name, outputArray[6].name],
                        [outputArray[7].name, outputArray[8].name, outputArray[9].name, outputArray[10].name, outputArray[11].name, outputArray[12].name, outputArray[13].name],
                        [outputArray[14].name, outputArray[15].name, 0, outputArray[17].name, outputArray[18].name, 0, 0]
                    ];

                    console.log(outputArray);

                },
                // checking for error 
                (error) => {
                    console.log("error occured :" + error);
                }
            )
    }




}


