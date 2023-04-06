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

function Graph1(props) {
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
    // am4core.useTheme(am4themes_frozen)
    am4core.useTheme(am4themes_animated);
    // Themes end

    let chart = am4core.create("chartdiv1", am4charts.SlicedChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect
    chart.responsive.enabled = true;
    chart.logo.disabled = true;
    chart.data = props.GraphData


    let series = chart.series.push(new am4charts.PyramidSeries());
    series.dataFields.value = "count";
    series.dataFields.category = "name";
    series.alignLabels = window.matchMedia("(max-width: 500px)").matches ? false : true;
    series.labels.template.maxWidth = 130;
    series.labels.template.wrap = true;
    series.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    series.topWidth = am4core.percent(100);
    // series.bottomWidth = am4core.percent(40);
    series.bottomWidth = am4core.percent(0);







    // let series = chart.series.push(new am4charts.FunnelSeries());
    // series.colors.step = 2;
    // series.dataFields.value = "total_count";
    // series.dataFields.category = "plan_name";
    // series.alignLabels = window.matchMedia("(max-width: 500px)").matches ? false : true;

    // series.labelsContainer.paddingLeft = 15;
    // series.labelsContainer.width = 200;

    chart.legend = new am4charts.Legend();
    //chart.legend.scrollable = true;
    //chart.legend.maxHeight = 100;
    chart.legend.position = "bottom";
    chart.legend.valign = "bottom";
    //chart.legend.margin(5, 5, 20, 5);


    // chart.responsive.rules.push({
    //   relevant: function (target) {
    //     if (target.pixelWidth <= 900) {
    //       return true;
    //     }

    //     return false;
    //   },
    //   state: function (target, stateId) {
    //     if (target instanceof am4charts.SlicedChart) {
    //       var state = target.states.create(stateId);
    //       // state.properties.paddingTop = 5;
    //       // state.properties.paddingRight = 15;
    //       // state.properties.paddingBottom = 5;
    //       // state.properties.paddingLeft = 0;
    //       state.properties.alignLabels = false;
    //       return state;
    //     }
    //     return null;
    //   }
    // });

    chart.logo.disabled = true;
    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, [props.GraphData, props.theme, props.dark]);

  return <div id="chartdiv1"
    style={{
      width: "100%",
      height: "400px",
    }}></div>;
}

export default Graph1;
