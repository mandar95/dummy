/* Imports */
import React, { useLayoutEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
//themes
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_moonrisekingdom from "@amcharts/amcharts4/themes/moonrisekingdom";
import am4themes_spiritedaway from "@amcharts/amcharts4/themes/spiritedaway";

function Graph1(props) {
	const chartRef = useRef(null);

	useLayoutEffect(() => {

		/* Chart code */
		// Themes Selection
		if (props.dark) am4core.useTheme(am4themes_dark);
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

		let chart = am4core.create("chartdiv7", am4charts.XYChart);
		chart.hiddenState.properties.opacity = 0; // this creates initial fade-in


		// Add data
		chart.data = props.GraphData;

		// Create axes
		chart.legend = new am4charts.Legend();
		chart.legend.position = "right";

		// Create axes
		var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = "labels";
		categoryAxis.renderer.grid.template.opacity = 0;

		var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
		valueAxis.min = 0;
		valueAxis.renderer.grid.template.opacity = 0;
		valueAxis.renderer.ticks.template.strokeOpacity = 0.5;
		valueAxis.renderer.ticks.template.stroke = am4core.color("#495C43");
		valueAxis.renderer.ticks.template.length = 10;
		valueAxis.renderer.line.strokeOpacity = 0.5;
		valueAxis.renderer.baseGrid.disabled = true;
		valueAxis.renderer.minGridDistance = 60;

		// Create series
		function createSeries(field, name) {
			var series = chart.series.push(new am4charts.ColumnSeries());
			series.dataFields.valueX = field;
			series.dataFields.categoryY = "labels";
			series.stacked = true;
			series.name = name;

		}


		createSeries("Deficiency", "Deficiency");
		createSeries("Lost", "Lost");
		createSeries("Open", "Open");
		createSeries("Reject", "Reject");
		createSeries("Won", "Won");

		chart.logo.disabled = true;
		chartRef.current = chart;

		return () => {
			chart.dispose();
		};
	}, [props.GraphData, props.theme, props.dark]);

	return <div id="chartdiv7" style={{ width: "100%", height: "550px" }}></div>;
}

export default Graph1;
