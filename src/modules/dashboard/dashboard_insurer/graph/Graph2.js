/* Imports */
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//themes
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
// import am4themes_dark from "@amcharts/amcharts4/themes/dark"
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_moonrisekingdom from "@amcharts/amcharts4/themes/moonrisekingdom";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";

function Graph2(props) {

    // useLayoutEffect(() => {
    //     am4core.useTheme(am4themes_frozen)
    //     am4core.useTheme(am4themes_animated);
    //     // Themes end
    //     let x = am4core.create("chartdiv2", am4charts.XYChart);
    //     // Create chart instance
    //     let chart = am4core.create("chartdiv2", am4charts.XYChart);
    //     chart.logo.disabled = true;
    //     //

    //     // Increase contrast by taking evey second color
    //     chart.colors.step = 2;

    //     // Add data
    //     //chart.data = generateChartData();
    //     chart.data = props.GraphData;

    //     // Create axes
    //     let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    //     dateAxis.renderer.minGridDistance = 50;

    //     // Create series
    //     function createAxisAndSeries(field, name, opposite, bullet) {
    //         let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    //         if (chart.yAxes.indexOf(valueAxis) != 0) {
    //             valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
    //         }

    //         let series = chart.series.push(new am4charts.LineSeries());
    //         series.dataFields.valueY = field;
    //         series.dataFields.dateX = "labels";
    //         series.strokeWidth = 2;
    //         series.yAxis = valueAxis;
    //         series.name = name;
    //         series.tooltipText = "{name}: [bold]{valueY}[/]";
    //         series.tensionX = 0.8;
    //         series.showOnInit = true;

    //         let interfaceColors = new am4core.InterfaceColorSet();
    //         let bull;

    //         switch (bullet) {
    //             case "triangle":
    //                 bull = series.bullets.push(new am4charts.Bullet());
    //                 bull.width = 12;
    //                 bull.height = 12;
    //                 bull.horizontalCenter = "middle";
    //                 bull.verticalCenter = "middle";

    //                 let triangle = bull.createChild(am4core.Triangle);
    //                 triangle.stroke = interfaceColors.getFor("background");
    //                 triangle.strokeWidth = 2;
    //                 triangle.direction = "top";
    //                 triangle.width = 12;
    //                 triangle.height = 12;
    //                 break;
    //             case "rectangle":
    //                 bull = series.bullets.push(new am4charts.Bullet());
    //                 bull.width = 10;
    //                 bull.height = 10;
    //                 bull.horizontalCenter = "middle";
    //                 bull.verticalCenter = "middle";

    //                 let rectangle = bull.createChild(am4core.Rectangle);
    //                 rectangle.stroke = interfaceColors.getFor("background");
    //                 rectangle.strokeWidth = 2;
    //                 rectangle.width = 10;
    //                 rectangle.height = 10;
    //                 break;
    //             default:
    //                 bull = series.bullets.push(new am4charts.CircleBullet());
    //                 bull.circle.stroke = interfaceColors.getFor("background");
    //                 bull.circle.strokeWidth = 2;
    //                 break;
    //         }

    //         valueAxis.renderer.line.strokeOpacity = 1;
    //         valueAxis.renderer.line.strokeWidth = 2;
    //         valueAxis.renderer.line.stroke = series.stroke;
    //         valueAxis.renderer.labels.template.fill = series.stroke;
    //         valueAxis.renderer.opposite = opposite;
    //     }

    //     createAxisAndSeries("Deficiency", "Deficiency", false, "circle");
    //     createAxisAndSeries("Lost", "Lost", true, "triangle");
    //     createAxisAndSeries("Open", "Open", true, "rectangle");

    //     createAxisAndSeries("Reject", "Reject", true, "circle");
    //     createAxisAndSeries("Won", "Won", true, "rectangle");

    //     // Add legend
    //     chart.legend = new am4charts.Legend();

    //     // Add cursor
    //     chart.cursor = new am4charts.XYCursor();

    //     // generate some random data, quite different range
    //     function generateChartData() {
    //         let chartData = [];
    //         let firstDate = new Date();
    //         firstDate.setDate(firstDate.getDate() - 100);
    //         firstDate.setHours(0, 0, 0, 0);

    //         let visits = 1600;
    //         let hits = 2900;
    //         let views = 8700;

    //         for (var i = 0; i < 15; i++) {
    //             // we create date objects here. In your data, you can have date strings
    //             // and then set format of your dates using chart.dataDateFormat property,
    //             // however when possible, use date objects, as this will speed up chart rendering.
    //             let newDate = new Date(firstDate);
    //             newDate.setDate(newDate.getDate() + i);

    //             visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //             hits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
    //             views += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

    //             chartData.push({
    //                 date: newDate,
    //                 visits: visits,
    //                 hits: hits,
    //                 views: views
    //             });
    //         }
    //         return chartData;
    //     }

    //     return () => {
    //         x.dispose();
    //     };
    // }, [props.GraphData, props.theme, props.dark]);

    const chartRef = useRef(null);

    useLayoutEffect(() => {
        switch (props.theme) {
            case 1:
                am4core.useTheme(am4themes_material);
                break;
            case 2:
                am4core.useTheme(am4themes_dataviz);
                break;
            case 3:
                am4core.useTheme(am4themes_dataviz);
                break;
            case 4:
                am4core.useTheme(am4themes_kelly);
                break;
            case 5:
                am4core.useTheme(am4themes_material);
                break;
            case 6:
                am4core.useTheme(am4themes_frozen);
                break;
            case 7:
                am4core.useTheme(am4themes_moonrisekingdom);
                break;
            case 8:
                am4core.useTheme(am4themes_spiritedaway);
                break;
            default:
        }
        //am4core.useTheme(am4themes_frozen)
        am4core.useTheme(am4themes_animated);
        // Themes end
        // Create chart instance
        let chart = am4core.create("chartdiv2", am4charts.XYChart);
        chart.logo.disabled = true;

        // // Title
        // let title = chart.titles.create();
        // title.text = "Biggest U.S. retailers by 2018 revenue";
        // title.fontSize = 20;
        // title.marginBottom = 20;

        // Set format
        // chart.numberFormatter.numberFormat = "'[font-size: 10]{valueY}[/] [bold]'";

        // Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.labels.template.disabled = true;
        categoryAxis.dataFields.category = "labels";
        chart.yAxes.push(new am4charts.ValueAxis());

        // Set data
        // chart.data = [{
        //     "category": "",
        //     "Walmart": 387.66,
        //     "Amazon.com": 120.93,
        //     "The Kroger Co.": 119.70,
        //     "Costco": 101.43,
        //     "Walgreens Boots Alliance": 98.39,
        //     "The Home Depot": 97.27,
        //     "CVS Health Corporation": 83.79,
        //     "Target": 74.48,
        //     "Lowe's Companies": 64.09,
        //     "Albertsons Companies": 59.71
        // }];

        chart.data = props.GraphData;

        // Series
        const data = chart.data[0];

        // data.map((item) => {
        for (var key in data) {
            if (key !== "labels") {
                let series = chart.series.push(new am4charts.CurvedColumnSeries());
                series.dataFields.categoryX = "labels";
                series.dataFields.valueY = key;
                series.name = key;
                series.tooltipText = "{name}: {valueY.value}";
                series.columns.template.strokeWidth = 2;
                series.columns.template.strokeOpacity = 1;
                series.columns.template.fillOpacity = 0;
                series.columns.template.width = am4core.percent(100);
                series.clustered = false;
            }
        }

        // })




        // Cursor
        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = 10;


        chart.logo.disabled = true;
        chartRef.current = chart;

        return () => {
            chart.dispose();
        };
    }, [props.GraphData, props.theme, props.dark])

    return <div id="chartdiv2"
        style={{
            width: "100%",
            height: "400px",
        }}></div>;
}

export default Graph2;
