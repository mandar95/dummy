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
        categoryAxis.dataFields.category = "category";

        chart.yAxes.push(new am4charts.ValueAxis());
        //let ChartData = [{ ...props.GraphData[0], category: "" }]
        chart.data = props.GraphData;

        // Series
        const data = chart.data[0];

        // data.map((item) => {
        for (var key in data) {
            if (data.hasOwnProperty(key) && key !== "category") {
                let series = chart.series.push(new am4charts.CurvedColumnSeries());
                series.dataFields.categoryX = "category";
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
