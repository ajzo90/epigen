import {select, selection} from "d3-selection";
import {path} from "d3-path";
import {mean} from "d3-array";
import {transition} from "d3-transition";

var colors = ["green", "red", "yellow", "blue"];
var nColumns = 80;
var nRows = 20;
var barChartHeight = 80;
var dx = 0, dy = 0, w = 0, h = 0;

function toIndex(row, col) {
    return col + row * nColumns;
}

function fromIndex(index) {
    const y = Math.floor(index / nColumns);
    const x = index - y * nColumns;
    return {x, y};
}

// 0,1,2,3,..nColumns-1, nColumns, ... 2*nColumns-1, 2*nColumns, ..., nRows * nColumns -1
function updateMatrix(rect, matrixAsVector, upper) {
    const className = (upper ? "lower" : "upper") + "-triangles";
    const rects = rect.selectAll("." + className).data(matrixAsVector);
    const rectsEnter = rects.enter().append("path")
        .attr("class", className)
        .attr("d", (d, i) => {
            const p = path();
            const {x, y} = fromIndex(i);
            p.moveTo((x + upper) * dx, (y + upper) * dy);
            p.lineTo((x + 1) * dx, y * dy);
            p.lineTo(x * dx, (y + 1) * dy);
            p.closePath();
            return p.toString();
        })

    rects.merge(rectsEnter).attr("fill", d => colors[d]);
}

function updateBars(el, barData) {
    const t = transition().duration(250);
    var maxVal = 0;
    barData.forEach(colorData => colorData.forEach(val => maxVal = Math.max(maxVal, val)));
    console.log("bardata", barData)

    let charts = el.selectAll(".barChart").data(barData)

    let chartsEnter = charts.enter()
        .append("svg")
        .attr("class", "barChart")
        .attr("height", barChartHeight)
        .attr("fill", (d, i) => colors[i])
        .attr("width", w);


    let chartsUpsert = charts.merge(chartsEnter);

    let meanLine = chartsUpsert.selectAll(".mean-line")
        .data(d => [mean(d)]);


    let bars = chartsUpsert.selectAll(".bar")
        .data(d => d);

    let barsEnter = bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => i * dx)
        .attr("width", dx);

    bars.merge(barsEnter)
        .transition(t)
        .attr("height", d => d / maxVal * barChartHeight)

    let mlEnter = meanLine.enter()
        .append("path")
        .attr("stroke", "black")
        .attr("strokeWidth", 2)
        .attr("class", "mean-line");

    meanLine.merge(mlEnter).transition(t).attr("d", d => {
        const p = path();
        p.moveTo(0, d / maxVal * barChartHeight);
        p.lineTo(w, d / maxVal * barChartHeight);
        return p.toString();
    });

}

function generateData() {
    const nCells = nRows * nColumns;
    const lower = new Uint8Array(nCells); // 8 bit array, to save some memory and speed things up..
    for (let i = 0; i < nCells; i++) {
        lower[i] = Math.floor(Math.random() * colors.length);
    }
    return lower;
}

function update(svg, bars) {

    let upperData = generateData();
    let lowerData = generateData();

    let barData = colors.map(d => new Uint32Array(nColumns));
    let col = 0;
    let index = 0;
    while (index < upperData.length) {
        col++;
        if (col >= nColumns) {
            col = 0;
        }
        barData[upperData[index]][col]++;
        barData[lowerData[index]][col]++;
        index++;
    }

    updateMatrix(svg, upperData, true);
    updateMatrix(svg, lowerData, false);

    updateBars(bars, barData);
}

function epigen(elId) {
    const div = select(elId);
    div.style("width", "100%");

    w = div.node().clientWidth;

    dx = dy = w / nColumns;
    h = dy * nRows;

    const svg = div.append("svg").attr("width", w).attr("height", h);

    const bars = div.append("div");

    const rect = svg.append("rect").attr("width", w).attr("height", h).attr("fill", "red");

    update(svg, bars)
    setInterval(() => update(svg, bars), 1000);

}

export default epigen;