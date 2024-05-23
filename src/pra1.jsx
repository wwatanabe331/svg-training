import React from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";
// d3.scaleを使用する際は↑をインポートする必要あり

const Chart = ({ data }) => {
  // const { data } = this.props
  const leftMargin = 100;
  const rightMargin = 100;
  const bottomMargin = 100;
  const contentWidth = 800;
  // nameの個数が知りたいのでdata.series.length
  const contentHeight = 50 * data.series.length * data.labels.length;
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // const data1 = data.series.map(({name, values}) => ({[name]:values}));
  // [{ data: Array [123, 456, 789] }, { another data: Array [234, 567, 891] }]

  // d3.scaleLinearを使用してx軸のスケールを設定
  const xScale = d3
    .scaleLinear()
    // データの最大値の取得
    // flatMapを使用
    // s.values→[123, 456, 789 , 234, 567, 891]といったふうに連結する
    .domain([0, d3.max(data.series.flatMap((s) => s.values))])
    // スケールを0からcontentWidthにマッピング
    .range([0, contentWidth])
    // スケールの範囲をきれいな値にする
    .nice();

  const yScale = d3
    .scaleBand()
    // スペースを10,グラフの縦幅を20として考える
    .domain(data.labels)
    .range([0, contentHeight])
    // 各バンドの間に15%のスペースが生まれる
    .padding(0.15);

  const svgWidth = leftMargin + contentWidth + rightMargin;
  const svgHeight = contentHeight + bottomMargin;

  return (
    <svg width={svgWidth} height={svgHeight}>
      <g transform={`translate(${leftMargin},0)`}>
        {
          // data配列をマッピングして、各データポイントに対するg要素を生成
          data.labels.map((label, i) => {
            <g key={label} transform={`translate(0,${yScale(label)})`}>
              {/* text要素は、item.manthの値をsvgのデータの外側に記載するようにしている
              x、yはsvgからの位置、textAnchorはsvgの外側に記載すると意味している　 */}
              {data.series.map((series, j) => (
                //折れ線グラフの描画
                <rect
                  key={series.name}
                  x={0}
                  // j([0,1]) * バンドの幅(一つの枠で100) ÷ seriesの数（2)
                  y={j * (xScale.bondwidth() / data.series.length)}
                  width={xScale(series.value[i])}
                  height={yScale.bandwidth() / data.series.length - 15}
                  // series.nameごとに色わけしたい data青、another dataオレンジ
                  fill={color(series.name)}
                />
              ))}
              {/* ラベルの描画 */}
              <text x="-10" y={yScale.bandwidth() / 2} textAnchor="end">
                {labels}
              </text>
              {/* ラベル横の小さな線　を描画 */}
              <line
                x1={-10}
                y1={yScale.bandwidth() / 2}
                x2={0}
                y2={yScale.bandwidth() / 2}
                stroke="gray"
              />
              {/* 一番したのx軸の線を描画 */}
              <line
                x1={leftMargin}
                y1={contentHeight - 10}
                x2={contentWidth}
                y2={contentHeight - 10}
                stroke="gray"
              />
            </g>;
          })
        }
        // xScaleの目盛りをマッピング
        <g>
          {xScale.ticks().map((tick) => {
            <g transform={`translate(${xScale(tick)},0)`}>
              <line y1="0" y2={contentHeight} stroke="gray" />
              {/* textAnchor=middleは値（目盛り線）の真ん中に表示される */}
              <text y={contentHeight + 10} textAnchor="middle">
                {tick}
              </text>
            </g>;
          })}
        </g>
        {/* 凡例の描画 */}
        <g transform={`trancelate(${contentWidth + 10}, 10)`}>
          {data.series.map((series, i) => (
            <g key={series.name} tranceform={`trancelate(0, ${i * 15})`}>
              <rect x={20} y={20} fill={color(series.name)} />
              <text x={25} y={15} textAnchor="start">
                {series.name}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

const App = () => {
  const data = {
    labels: ["A", "B", "C"],
    series: [
      {
        name: "data",
        values: [123, 456, 789],
      },
      {
        name: "another data",
        values: [234, 567, 891],
      },
    ],
  };
  return <Chart data={data} />;
};

ReactDOM.render(<App />, document.getElementById("root"));
