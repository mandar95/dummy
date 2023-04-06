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
import { DateFormate } from "../../../../utils";

function Graph3(props) {

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
        let chart = am4core.create("chartdiv3", am4charts.XYChart);
        chart.logo.disabled = true;
        chart.colors.step = 2;

        chart.legend = new am4charts.Legend()
        chart.legend.position = 'top'
        chart.legend.paddingBottom = 20
        chart.legend.labels.template.maxWidth = 95

        let xAxis = chart.xAxes.push(new am4charts.CategoryAxis())
        xAxis.dataFields.category = 'labels'
        xAxis.renderer.cellStartLocation = 0.1
        xAxis.renderer.cellEndLocation = 0.9
        xAxis.renderer.grid.template.location = 0;

        let yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;

        function createSeries(value, name) {
            let series = chart.series.push(new am4charts.ColumnSeries())
            series.dataFields.valueY = value
            series.dataFields.categoryX = 'labels'
            series.name = name

            series.events.on("hidden", arrangeColumns);
            series.events.on("shown", arrangeColumns);
            series.columns.template.tooltipText = "{name}: {valueY.value}";
            series.columns.template.tooltipY = 0;
            series.columns.template.strokeOpacity = 0;
            series.columns.template.maxWidth = 80;

            var circleBullet = series.bullets.push(new am4charts.CircleBullet());
            circleBullet.circle.stroke = am4core.color("#fff");
            circleBullet.circle.strokeWidth = 2;
            circleBullet.tooltipText = "{name}: {valueY.value}";


            let bullet = series.bullets.push(new am4charts.LabelBullet())
            bullet.interactionsEnabled = false
            bullet.dy = 30;
            bullet.label.text = '{valueY}'
            bullet.tooltipText = "Value: [bold]{value}[/]";
            bullet.label.fill = am4core.color('#ffffff')

            return series;
        }

        chart.data = props.GraphData.map((elem) => ({
            ...elem,
            labels: DateFormate(elem.labels)
        }));
        // chart.data = [
        //     {
        //         category: 'Place #1',
        //         first: 40,
        //         second: 55,
        //         third: 60
        //     },
        //     {
        //         category: 'Place #2',
        //         first: 30,
        //         second: 78,
        //         third: 69
        //     },
        //     {
        //         category: 'Place #3',
        //         first: 27,
        //         second: 40,
        //         third: 45
        //     },
        //     {
        //         category: 'Place #4',
        //         first: 50,
        //         second: 33,
        //         third: 22
        //     }
        // ]


        createSeries('total_customer', 'Total Customer');
        createSeries('selected_plan', 'Selected Plan');

        function arrangeColumns() {

            let series = chart.series.getIndex(0);

            let w = 1 - xAxis.renderer.cellStartLocation - (1 - xAxis.renderer.cellEndLocation);
            if (series.dataItems.length > 1) {
                let x0 = xAxis.getX(series.dataItems.getIndex(0), "categoryX");
                let x1 = xAxis.getX(series.dataItems.getIndex(1), "categoryX");
                let delta = ((x1 - x0) / chart.series.length) * w;
                if (am4core.isNumber(delta)) {
                    let middle = chart.series.length / 2;

                    let newIndex = 0;
                    chart.series.each(function (series) {
                        if (!series.isHidden && !series.isHiding) {
                            series.dummyData = newIndex;
                            newIndex++;
                        }
                        else {
                            series.dummyData = chart.series.indexOf(series);
                        }
                    })
                    let visibleCount = newIndex;
                    let newMiddle = visibleCount / 2;

                    chart.series.each(function (series) {
                        let trueIndex = chart.series.indexOf(series);
                        let newIndex = series.dummyData;

                        let dx = (newIndex - trueIndex + middle - newMiddle) * delta

                        series.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                        series.bulletsContainer.animate({ property: "dx", to: dx }, series.interpolationDuration, series.interpolationEasing);
                    })
                }
            }
        }


        chart.logo.disabled = true;
        chartRef.current = chart;

        return () => {
            chart.dispose();
        };
    }, [props.GraphData, props.theme, props.dark]);

    return <div id="chartdiv3"
        style={{
            width: "100%",
            height: "400px",
        }}></div>;
}

export default Graph3;
