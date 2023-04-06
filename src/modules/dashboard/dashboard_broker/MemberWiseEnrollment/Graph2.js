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

    // Create chart instance
    let chart = am4core.create("chartdiv6", am4charts.PieChart);

    // Add data
    chart.data = props.GraphData;
    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "count";
    pieSeries.dataFields.category = "label";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeOpacity = 0;
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    pieSeries.slices.template.tooltipText = "{category}: {value.value} Enroled";

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 0;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    chart.hiddenState.properties.radius = am4core.percent(0);

    chart.logo.disabled = true;
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [props.GraphData, props.theme, props.dark]);

  return <div id="chartdiv6" style={{ width: "100%", height: "450px" }}></div>;
}

export default Graph2;
