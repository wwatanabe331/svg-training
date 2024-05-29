import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { scaleLinear, scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";
import { extent } from "d3-array";
import "./styles.css";

const Chart = ({ data, xAxis, yAxis }) => {
  const leftMargin = 100;
  const rightMargin = 200;
  const bottomMargin = 100;
  const contentWidth = 500;
  const contentHeight = 500;
  const color = scaleOrdinal(schemeCategory10);

  const xScale = scaleLinear()
    .domain(extent(data, (d) => d[xAxis]))
    .range([0, contentWidth])
    .nice();

  const yScale = scaleLinear()
    .domain(extent(data, (d) => d[yAxis]))
    .range([contentHeight, 0])
    .nice();

  const svgWidth = leftMargin + contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${leftMargin}, ${bottomMargin / 2})`}>
        {/* X軸 */}
        <g transform={`translate(0, ${contentHeight})`}>
          {/* <line x1={0} x2={contentWidth} stroke="black" /> */}
          <line x2={contentWidth} stroke="black" />
          {xScale.ticks().map((tick, i) => (
            <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
              <line y2={5} stroke="black" />
              <text y={20} textAnchor="middle">
                {tick}
              </text>
            </g>
          ))}
          <text
            x={contentWidth / 2}
            y={bottomMargin / 2.5}
            textAnchor="middle"
            className="axis-label"
          >
            {xAxis}
          </text>
        </g>

        {/* Y軸 */}
        <g>
          {/* <line y1={0} y2={contentHeight} stroke="black" /> */}
          <line y2={contentHeight} stroke="black" />
          {yScale.ticks().map((tick, i) => (
            <g key={i} transform={`translate(0, ${yScale(tick)})`}>
              <line x2={-5} stroke="black" />
              <text x={-8} y={5} textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          <text
            transform="rotate(-90)"
            x={-contentHeight / 2}
            y={-leftMargin / 3 - 10}
            textAnchor="middle"
            className="axis-label"
          >
            {yAxis}
          </text>
        </g>

        {/* データポイント */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d[xAxis])}
            cy={yScale(d[yAxis])}
            r={5}
            fill={color(d.species)}
            // アニメーションのためのクラス
            className="circle"
          />
        ))}
      </g>

      {/* 凡例 */}
      <g transform={`translate(${leftMargin + contentWidth + 20}, 20)`}>
        {Array.from(new Set(data.map((d) => d.species))).map((species, i) => (
          <g key={i} transform={`translate(0, ${i * 20})`}>
            <rect width={10} height={10} fill={color(species)} />
            <text x={20} y={10} textAnchor="start">
              {species}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const App = () => {
  // 初期値
  const [xAxis, setXAxis] = useState("sepalLength");
  const [yAxis, setYAxis] = useState("sepalWidth");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // xAxisを変更するためのイベントハンドラ
  const handleXAxisChange = (e) => {
    setXAxis(e.target.value);
  };

  const handleYAxisChange = (e) => {
    setYAxis(e.target.value);
  };

  return (
    <div>
      <h1>Scatter Plot of Iris Flower Dataset</h1>
      <div>
        <label>
          Horizontal Axis :
          <select value={xAxis} onChange={handleXAxisChange}>
            <option value="sepalLength">Sepal Length</option>
            <option value="sepalWidth">Sepal Width</option>
            <option value="petalLength">Petal Length</option>
            <option value="petalWidth">Petal Width</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Vertical Axis :
          <select value={yAxis} onChange={handleYAxisChange}>
            <option value="sepalLength">Sepal Length</option>
            <option value="sepalWidth">Sepal Width</option>
            <option value="petalLength">Petal Length</option>
            <option value="petalWidth">Petal Width</option>
          </select>
        </label>
      </div>

      <Chart data={data} xAxis={xAxis} yAxis={yAxis} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
