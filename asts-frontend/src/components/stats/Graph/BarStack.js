import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
  StackedBarSeries,
  ScatterSeries,
  CircleMarker,
  LineSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";
import { fitWidth } from "react-stockcharts/lib/helper";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { last } from "react-stockcharts/lib/utils";

let BarStack = (props) => {
  const fill = (d, i) => {
    const colors = ["#8364FF", "#64FFB5", "#FFF064", "#FC64FF", "#64A2FF"];
    return colors[i];
  };

  const { type, funds, ticker, data: initialData, width, height } = props;

  const margin = { left: 80, right: 50, top: 30, bottom: 30 };

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } =
    xScaleProvider(initialData);
  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [start, end];

  const yAccessor = [];
  for (var fund in funds) {
    let holdingName = `${funds[fund]}Holding`;
    yAccessor.push((d) => {
      return d[holdingName];
    });
  }
  const yExtents = (d) => {
    let volume = 0;
    for (var fund in funds) {
      volume = volume + d[`${funds[fund]}Holding`];
    }
    return volume;
  };

  const gridHeight = height - margin.top - margin.bottom;
  const gridWidth = width - margin.left - margin.right;

  const showGrid = true;
  const yGrid = showGrid ? { innerTickSize: -1 * gridWidth } : {};
  const xGrid = showGrid ? { innerTickSize: -1 * gridHeight } : {};

  return (
    <div className="d-flex justify-content-center py-4">
      <ChartCanvas
      height={height}
      width={width}
      margin={margin}
      type={type}
      seriesName={ticker}
      data={data}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d) => [0, yExtents(d)]}>
        <YAxis
          axisAt="left"
          orient="left"
          ticks={5}
          {...yGrid}
          tickStroke={"#C4C4C4"}
        />
        <XAxis
          axisAt="bottom"
          orient="bottom"
          showTicks={true}
          tickStroke={"#C4C4C4"}
        />
        <StackedBarSeries yAccessor={yAccessor} fill={fill} opacity={1} />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
        <MouseCoordinateY
          at="left"
          orient="left"
          displayFormat={format(".4s")}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format(".4s")}
        />
      </Chart>

      <Chart id={2} yExtents={(d) => d.close}>
        <YAxis axisAt="right" orient="right" ticks={5} tickStroke={"#C4C4C4"} />
        <LineSeries yAccessor={(d) => d.close} stroke="#000000" />
        <ScatterSeries
          yAccessor={(d) => d.close}
          marker={CircleMarker}
          markerProps={{ r: 2, stroke: "#000000", fill: "#000000", opacity: 1 }}
        />
        <MouseCoordinateX
          at="bottom"
          orient="bottom"
          displayFormat={timeFormat("%Y-%m-%d")}
        />
        <MouseCoordinateY
          at="right"
          orient="right"
          displayFormat={format(".4s")}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
    </div>
    
  );
};

BarStack.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

BarStack.defaultProps = {
  type: "svg",
};
BarStack = fitWidth(BarStack);

export default BarStack;
