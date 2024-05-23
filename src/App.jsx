// d3.jsのDOM操作（.select(),など)を使わずに作成
import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

const Chart = ({ data }) => {
  const leftMargin = 100;
  const rightMargin = 200;
  const bottomMargin = 100;
  const contentWidth = 400;
  const contentHeight = 400;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const xScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (x) => x.sepalLength),
      d3.max(data, (x) => x.sepalLength),
    ])
    .range([0, contentWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain([
      d3.min(data, (x) => x.sepalWidth),
      d3.max(data, (x) => x.sepalWidth),
    ])
    .range([contentHeight, 0])
    .nice();

  const svgWidth = leftMargin + contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${leftMargin}, ${bottomMargin / 2})`}>
        {/* x軸 */}
        <g transform={`translate(0, ${contentHeight})`}>
          {xScale.ticks().map((tick, i) => (
            <g key={i} transform={`translate(${xScale(tick)}, 0)`}>
              {/* 値の横の線 */}
              <line y2={5} stroke="black" />
              {/* emとは */}
              <text y={5} dy="1em" textAnchor="middle">
                {tick}
              </text>
            </g>
          ))}
          {/* 軸の線 */}
          <line x2={contentWidth} stroke="black" />
        </g>
        {/* text表示されない問題 */}
        <text
          transform={`translate(${contentWidth / 2},${
            contentHeight + bottomMargin / 2
          })`}
          text-anchor="middle"
        >
          sepal Length
        </text>

        {/* y軸 */}
        <g>
          {yScale.ticks().map((tick, i) => (
            <g key={i} transform={`translate(0, ${yScale(tick)})`}>
              <line x2={-5} stroke="black" />
              <text x={-8} dy="0.3em" textAnchor="end">
                {tick}
              </text>
            </g>
          ))}
          <line y2={contentHeight} stroke="black" />
        </g>

        {/* y軸のラベル */}
        <text
          transform="rotate(-90)"
          x={-contentHeight / 2}
          y={-leftMargin / 3 - 10}
          textAnchor="middle"
        >
          Sepal Width
        </text>

        {/* データポイント */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(d.sepalLength)}
            cy={yScale(d.sepalWidth)}
            r={5}
            fill={color(d.species)}
          />
        ))}

        {/* 凡例 */}
        {/* 元々xはleftMargin足されている */}
        <g transform={`translate(${contentWidth + 20}, 20)`}>
          {Array.from(new Set(data.map((d) => d.species))).map((species, i) => (
            <g key={i} transform={`translate(0, ${i * 20})`}>
              <rect width={10} height={10} fill={color(species)} />
              <text x={20} y={10} textAnchor="start">
                {species}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

fetch("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json")
  .then((response) => response.json())
  .then((data) => {
    ReactDOM.render(<Chart data={data} />, document.getElementById("root"));
  });
