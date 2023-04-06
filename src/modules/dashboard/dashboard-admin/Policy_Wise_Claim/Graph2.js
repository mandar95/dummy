/* Imports */
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//themes
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_dark from "@amcharts/amcharts4/themes/dark"
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_moonrisekingdom from "@amcharts/amcharts4/themes/moonrisekingdom";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";

function Graph2(props) {

  const chartRef = useRef(null);

  useLayoutEffect(() => {

    /* Chart code */
    // Themes Selection
    if (props.dark) am4core.useTheme(am4themes_dark)
    else
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
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chartdiv14", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = props.GraphData;

    chart.colors.step = 2;
    chart.padding(30, 30, 10, 30);
    chart.legend = new am4charts.Legend();

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    let series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series1.name = "Total Employees";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "total_employees";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";

    let bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet1.label.fill = am4core.color("#ffffff");
    bullet1.locationY = 0.5;

    let series2 = chart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText =
      "{name}: {valueY.totalPercent.formatNumber('#.00')}%";
    series2.name = "Total Claims";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "total_claim";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";

    let bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");

    chart.scrollbarX = new am4core.Scrollbar();

    chart.logo.disabled = true;
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [props.GraphData, props.theme, props.dark]);

  return <div id="chartdiv14" style={{ width: "100%", height: "450px" }}></div>;
}

export default Graph2;
