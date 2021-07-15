import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { fitWidth } from "react-stockcharts/lib/helper";
import { timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { last } from "react-stockcharts/lib/utils";

///////////////////////////////////////////////////////////////////////////////////

let CandleStick = (props) => {
  const { type, ticker, data: initialData, width, height } = props;

  const margin = { left: 80, right: 50, top: 10, bottom: 30 };

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => d.date
  );
  const { data, xScale, xAccessor, displayXAccessor } =
    xScaleProvider(initialData);
  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 100)]);
  const xExtents = [start, end];

  const gridWidth = width - margin.left - margin.right;

  const showGrid = true;
  const yGrid = showGrid ? { innerTickSize: -1 * gridWidth } : {};

  return (
    <div className="d-flex justify-content-center pb-4">
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
      <Chart id={1} height={400} yExtents={(d) => [d.high, d.low]} >
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
          showTicks={false}
          tickStroke={"#C4C4C4"}
        />
        <CandlestickSeries
          fill={(d) => (d.close > d.open ? "#00C52B" : "#DD0000")}
          opacity={1}
        />
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
      </Chart>
      <Chart
        id={2}
        origin={(w, h) => [0, h - 150]}
        height={150}
        yExtents={(d) => d.volume}
      >
        <XAxis
          axisAt="bottom"
          orient="bottom"
          tickStroke={"#C4C4C4"}
        />
        <YAxis
          axisAt="left"
          orient="left"
          ticks={5}
          tickFormat={format(".2s")}
          {...yGrid}
          tickStroke={"#C4C4C4"}
        />
        <BarSeries
          yAccessor={(d) => d.volume}
          fill={(d) => (d.close > d.open ? "#00C52B" : "#DD0000")}
          opacity={1}
        />
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
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
    </div>
  );
};

///////////////////////////////////////////////////////////////////////////////////

CandleStick.prototype = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStick.defaultProps = {
  type: "svg",
};

CandleStick = fitWidth(CandleStick);

export default CandleStick;
