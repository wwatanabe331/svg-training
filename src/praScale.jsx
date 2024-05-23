import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
// d3.scaleを使用する際は↑をインポートする必要あり

const Chart = ({ data }) => {
  //マージンの設定・マージンとは要素のコンテンツの外枠
  const leftMargin = 100;
  const rightMargin = 100;
  const bottomMargin = 100;
  // コンテンツの幅と高さの設定、各データポイントの間に50pxのスペースを確保
  const contentWidth = 400;
  const contentHeight = 50 * (data.length + 1);

  // d3.scaleLinearを使用してx軸のスケールを設定
  const xScale = d3
    .scaleLinear()
    // データの最大値の取得
    .domain([0, d3.max(data, (item) => item.temperature)])
    // スケールを0からcontentWidthにマッピング
    .range([0, contentWidth])
    // スケールの範囲をきれいな値にする
    .nice();

  // // SVGの幅と高さを設定
  const svgWidth = leftMargin + contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  // svg要素を返す
  return (
    <svg width={svgWidth} height={svgHeight}>
      {/* transform により　 現在の位置(0,0)から横にleftMargin,縦に０
      したがって、コンテンツを記載したい位置に移動している */}
      <g transform={`translate(${leftMargin},0)`}>
        {
          // data配列をマッピングして、各データポイントに対するg要素を生成
          data.map((item, i) => {
            return (
              <g key={i} transform={`translate(0,${50 * (i + 1)})`}>
                {/* text要素は、item.manthの値をsvgのデータの外側に記載するようにしている
              x、yはsvgからの位置、textAnchorはsvgの外側に記載すると意味している　 */}
                <text x="-10" y="8" textAnchor="end">
                  {item.month}
                </text>
                {/* 温度(item,temperature)に対応する位置にオレンジ色の描画をしている */}
                <circle cx={xScale(item.temperature)} r="5" fill="orange" />
              </g>
            );
          })
        }

        {
          // xScaleの目盛りをマッピング
          xScale.ticks().map((x) => {
            return (
              <g transform={`translate(${xScale(x)},0)`}>
                <line x1="0" y1="0" x2="0" y2={contentHeight} stroke="black" />
                {/* textAnchor=middleは値（目盛り線）の真ん中に表示される */}
                <text y={contentHeight + 20} textAnchor="middle">
                  {x}
                </text>
              </g>
            );
          })
        }
      </g>
    </svg>
  );
};

const App = () => {
  const data = [
    { month: 1, temperature: 10 },
    { month: 2, temperature: 10 },
    { month: 3, temperature: 14 },
    { month: 4, temperature: 19 },
    { month: 5, temperature: 23 },
    { month: 6, temperature: 26 },
    { month: 7, temperature: 30 },
    { month: 8, temperature: 31 },
    { month: 9, temperature: 27 },
    { month: 10, temperature: 22 },
    { month: 11, temperature: 16 },
    { month: 12, temperature: 12 },
  ];
  return <Chart data={data} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
