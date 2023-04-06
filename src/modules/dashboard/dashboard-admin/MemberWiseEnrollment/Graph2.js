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

function Graph3(props) {

  const chartRef = useRef(null);

  useLayoutEffect(() => {

    /* Chart code */
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

    // Let's cut a hole in our Pie chart the size of 40% the radius
    chart.innerRadius = am4core.percent(40);

    // Add data
    chart.data = props.GraphData;

    // Add and configure Series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "GMC";
    pieSeries.dataFields.category = "plan";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.text = "{GMC,value.percent.formatNumber('#.0')}%";

    // Disabling labels and ticks on inner circle
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = false;

    // Disable sliding out of slices
    pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 0.9;

    //  second series
    let pieSeries2 = chart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "GPA";
    pieSeries2.dataFields.category = "plan";
    pieSeries2.slices.template.stroke = am4core.color("#fff");
    pieSeries2.slices.template.strokeWidth = 2;
    pieSeries2.labels.template.text = "{GPA,value.percent.formatNumber('#.0')}%";
    pieSeries2.slices.template.strokeOpacity = 1;
    pieSeries2.slices.template.states.getKey(
      "hover"
    ).properties.shiftRadius = 0;
    pieSeries2.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = false;

    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;

    // Third series
    let pieSeries3 = chart.series.push(new am4charts.PieSeries());
    pieSeries3.dataFields.value = "GTL";
    pieSeries3.dataFields.category = "plan";
    pieSeries3.slices.template.stroke = am4core.color("#fff");
    pieSeries3.slices.template.strokeWidth = 2;
    pieSeries3.labels.template.text = "{GTL,value.percent.formatNumber('#.0')}%";
    pieSeries3.slices.template.strokeOpacity = 1;
    pieSeries3.slices.template.states.getKey(
      "hover"
    ).properties.shiftRadius = 0;
    pieSeries3.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries3.labels.template.disabled = true;
    pieSeries3.ticks.template.disabled = false;

    pieSeries3.labels.template.disabled = true;
    pieSeries3.ticks.template.disabled = true;

    // Fourth series
    let pieSeries4 = chart.series.push(new am4charts.PieSeries());
    pieSeries4.dataFields.value = "VGMC";
    pieSeries4.dataFields.category = "plan";
    pieSeries4.slices.template.stroke = am4core.color("#fff");
    pieSeries4.slices.template.strokeWidth = 2;
    pieSeries4.labels.template.text = "{VGMC,value.percent.formatNumber('#.0')}%";
    pieSeries4.slices.template.strokeOpacity = 1;
    pieSeries4.slices.template.states.getKey(
      "hover"
    ).properties.shiftRadius = 0;
    pieSeries4.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries4.labels.template.disabled = true;
    pieSeries4.ticks.template.disabled = false;

    pieSeries4.labels.template.disabled = true;
    pieSeries4.ticks.template.disabled = true;


    // Fifth series
    let pieSeries5 = chart.series.push(new am4charts.PieSeries());
    pieSeries5.dataFields.value = "VGPC";
    pieSeries5.dataFields.category = "plan";
    pieSeries5.slices.template.stroke = am4core.color("#fff");
    pieSeries5.slices.template.strokeWidth = 2;
    pieSeries5.labels.template.text = "{VGPC,value.percent.formatNumber('#.0')}%";
    pieSeries5.slices.template.strokeOpacity = 1;
    pieSeries5.slices.template.states.getKey(
      "hover"
    ).properties.shiftRadius = 0;
    pieSeries5.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries5.labels.template.disabled = true;
    pieSeries5.ticks.template.disabled = false;

    pieSeries5.labels.template.disabled = true;
    pieSeries5.ticks.template.disabled = true;

    // sixth series
    let pieSeries6 = chart.series.push(new am4charts.PieSeries());
    pieSeries6.dataFields.value = "VGTL";
    pieSeries6.dataFields.category = "plan";
    pieSeries6.slices.template.stroke = am4core.color("#fff");
    pieSeries6.slices.template.strokeWidth = 2;
    pieSeries6.labels.template.text = "{VGTL,value.percent.formatNumber('#.0')}%";
    pieSeries6.slices.template.strokeOpacity = 1;
    pieSeries6.slices.template.states.getKey(
      "hover"
    ).properties.shiftRadius = 0;
    pieSeries6.slices.template.states.getKey("hover").properties.scale = 1.1;
    pieSeries6.labels.template.disabled = true;
    pieSeries6.ticks.template.disabled = false;

    pieSeries6.labels.template.disabled = true;
    pieSeries6.ticks.template.disabled = true;

    chart.logo.disabled = true;
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [props.GraphData, props.theme, props.dark]);

  return <div id="chartdiv6" style={{ width: "100%", height: "450px" }}></div>;
}

export default Graph3;
