import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import * as d3 from "d3";

const Chart = ({ data }) => {
  // refは、ReactコンポーネントでDOM要素に直接アクセスするためのもの
  // ref.currentはこの特定のDOM要素を指す
  const ref = useRef();

  useEffect(() => {
    const leftMargin = 100;
    const rightMargin = 200;
    const bottomMargin = 50;
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

    // d3.select()は、指定したセレクタに一致する最初の要素を選択する
    // ここではref.currentを選択する
    const svg = d3
      .select(ref.current)
      //attr()は選択された要素の属性を設定、取得する
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    //selectAll()は指定したセレクタに一致する全ての要素を選択する
    // remove()はそれらの要素を削除する
    svg.selectAll("*").remove();
    // ↑では、svg内のすべての要素を一度クリアしている
    // これにより再描画の際に重複が発生しない

    // append()は新しい要素を指定した親要素に追加する
    // g要素をSVGに追加する
    const g = svg.append("g").attr("transform", `translate(${leftMargin}, 0)`);

    // x軸の描画
    g.append("g")
      .attr("transform", `translate(0, ${contentHeight + 10})`)
      .call(d3.axisBottom(xScale)); //call（）は選択された要素に対しての関数を行う
    // ↑.axisBottom()は指定したスケールに基づいて下部の軸を生成するメソッド

    // x軸のラベル(textで表す)
    g.append("text")
      .attr(
        "transform",
        `translate(${contentWidth / 2}, ${contentHeight + bottomMargin - 5})`
      )
      .style("text-anchor", "middle")
      .text("sepal Length");

    // y軸の描画
    g.append("g")
      .attr("transform", `translate(0, 10)`)
      .call(d3.axisLeft(yScale));
    // ↑.axisLeft()は、指定したスケールに基づいて左側の軸を生成する

    // y軸のラベル
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(contentHeight / 2))
      .attr("y", -(leftMargin / 3))
      .style("text-anchor", "middle")
      .text("sepal Width");

    // データポイントの描画
    g.selectAll("circle")
      .data(data)
      .enter() //enter()はデータとDOM要素を一致させるために、新しいデータポイントを作成
      .append("circle") //circle要素を追加
      .attr("cx", (d) => xScale(d.sepalLength))
      .attr("cy", (d) => yScale(d.sepalWidth) + 10)
      .attr("r", 5)
      .attr("fill", (d) => color(d.species)); //speciesごとに色分けしたい

    // 凡例の追加
    const legend = svg
      .append("g")
      .attr("transform", `translate(${leftMargin + contentWidth + 20}, 20)`);

    //setで重複ないように。speciesのみの配列を作成
    const species = Array.from(new Set(data.map((d) => d.species)));

    species.forEach((species, i) => {
      //forEachは、配列の各要素に対して、一度ずつ関数を実行
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 20})`);

      legendRow
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", color(species));

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 10)
        .attr("text-anchor", "start")
        .text(species);
    });
  }, [data]);
  return <svg ref={ref}></svg>;
  // ref属性を使用して、このSVG要素をref.currentに関連づける
};

fetch("https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json")
  .then((response) => response.json())
  .then((data) => {
    ReactDOM.render(<Chart data={data} />, document.getElementById("root"));
  });
