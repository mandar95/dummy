/* Imports */
import React, { useLayoutEffect, useRef } from "react";
import _ from "lodash";
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

function Graph1(props) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {

    /* Chart code */
    // Themes Selection
    if (props.dark) am4core.useTheme(am4themes_dark)
    else
      switch (2) {
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

    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = props.Graphdata;
    let Max = (_.maxBy(props.Graphdata, "total_members")?.total_members || 1) + 1;
    let Min = 0;
    
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "label";
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.fontSize = 11;
    categoryAxis.title.text = "Date";
    categoryAxis.renderer.grid.template.strokeWidth = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = Min;
    valueAxis.max = Max;
    valueAxis.minimum = Min;
    valueAxis.maximum = Max;
    // valueAxis.strictMinMax = true;
    // valueAxis.renderer.minGridDistance = 30;
    valueAxis.title.text = "Number of Lives";
    valueAxis.maxPrecision = 0;
    valueAxis.renderer.grid.template.strokeWidth = 0;

    // axis break
    // let axisBreak = valueAxis.axisBreaks.create();
    // axisBreak.startValue = 1000;
    // axisBreak.endValue = 22900;
    //axisBreak.breakSize = 0.005;

    // // fixed axis break
    // let d =
    //   (axisBreak.endValue - axisBreak.startValue) /
    //   (valueAxis.max - valueAxis.min);
    // axisBreak.breakSize = (0.05 * (1 - d)) / d; // 0.05 means that the break will take 5% of the total value axis height

    // make break expand on hover
    // let hoverState = axisBreak.states.create("hover");
    // hoverState.properties.breakSize = 1;
    // hoverState.properties.opacity = 0.1;
    // hoverState.transitionDuration = 1500;

    // axisBreak.defaultState.transitionDuration = 1000;
    /*
    // this is exactly the same, but with events
    axisBreak.events.on("over", function() {
      axisBreak.animate(
        [{ property: "breakSize", to: 1 }, { property: "opacity", to: 0.1 }],
        1500,
        am4core.ease.sinOut
      );
    });
    axisBreak.events.on("out", function() {
      axisBreak.animate(
        [{ property: "breakSize", to: 0.005 }, { property: "opacity", to: 1 }],
        1000,
        am4core.ease.quadOut
      );
    });*/
    let label = categoryAxis.renderer.labels.template;
    label.wrap = true;
    label.maxWidth = 100;
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "label";
    series.dataFields.valueY = "total_members";
    series.columns.template.tooltipText = "{valueY.value} Member Enroled";
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;
    series.columns.template.maxWidth = 80;

    var circleBullet = series.bullets.push(new am4charts.CircleBullet());
    circleBullet.circle.stroke = am4core.color("#fff");
    circleBullet.circle.strokeWidth = 2;
    circleBullet.tooltipText = "{valueY.value} Member Enroled";


    // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
    });
    chart.logo.disabled = true;
    chartRef.current = chart;
    categoryAxis.events.on("sizechanged", function (ev) {
      var axis = ev.target;
      var cellWidth = axis.pixelWidth / (axis.endIndex - axis.startIndex);
      if (cellWidth < axis.renderer.labels.template.maxWidth) {
        axis.renderer.labels.template.rotation = -45;
        axis.renderer.labels.template.horizontalCenter = "right";
        axis.renderer.labels.template.verticalCenter = "middle";
      }
      else {
        axis.renderer.labels.template.rotation = 0;
        axis.renderer.labels.template.horizontalCenter = "middle";
        axis.renderer.labels.template.verticalCenter = "top";
      }
    });

    return () => {
      chart.dispose();
    };
  }, [props.Graphdata, props.theme, props.dark]);

  return <div id="chartdiv" style={{ width: "100%", height: "450px" }}></div>;
}

export default Graph1;
