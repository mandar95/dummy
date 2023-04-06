/*
Module: Billing
User Type: Saas User
Commented By: Salman Ahmed
 */

// /* Imports */
// import React, { useLayoutEffect, useRef } from "react";
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "@amcharts/amcharts4/charts";
// import am4themes_animated from "@amcharts/amcharts4/themes/animated";
// import { useSelector } from 'react-redux'


// export const Donut = () => {

//   const { billing_widgets: { total_days, data } } = useSelector(state => state.saas);

//   const chartRef = useRef(null);

//   useLayoutEffect(() => {

//     // let x = am4core.create("chartdiv_billing", am4charts.XYChart);
//     // Create chart instance
//     let chart = am4core.create("chartdiv_billing", am4charts.PieChart);

//     // Add data
//     chart.data = [
//       { "sector": "Days Left", "size": data['Days Left'] || 0 },
//       { "sector": "Days Completed", "size": (Number(total_days) - Number(data['Days Left'])) || 0 },
//     ];


//     const am4themes_myTheme = (target) => {
//       if (target instanceof am4core.ColorSet) {
//         target.list = [
//           am4core.color("#ff6159"),
//           am4core.color("#1689cc"),
//         ];
//       }
//     }
//     am4core.useTheme(am4themes_myTheme);
//     am4core.useTheme(am4themes_animated);

//     // Add label
//     chart.innerRadius = 110;
//     let label = chart.seriesContainer.createChild(am4core.Label);
//     label.text = `${Number(data['Days Left'])}/${total_days}`;
//     label.horizontalCenter = "middle";
//     label.verticalCenter = "middle";
//     label.fontSize = 40;
//     // Add and configure Series
//     let pieSeries = chart.series.push(new am4charts.PieSeries());
//     pieSeries.dataFields.value = "size";
//     pieSeries.dataFields.category = "sector";
//     pieSeries.slices.template.stroke = am4core.color("#fff");
//     pieSeries.slices.template.strokeWidth = 2;
//     pieSeries.slices.template.strokeOpacity = 1;

//     // Disabling labels and ticks on inner circle
//     pieSeries.labels.template.disabled = true;
//     pieSeries.ticks.template.disabled = false;

//     chart.logo.disabled = true;
//     chartRef.current = chart;

//     return () => {
//       chart.dispose();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [total_days, data])

//   return (<div id="chartdiv_billing" style={{ width: "100%", height: "350px" }}></div>)
// }
