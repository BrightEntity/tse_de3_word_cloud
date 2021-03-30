import * as d3 from "d3";
import * as cloud from "./d3-cloud";

d3.layout.cloud = cloud;

export default function wordCloudRealisateur() {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var myWords = [];
    d3.csv("./assets/realisateurs_le_plus_diffuses.csv")
        .row(d => { return { word: d['réalisateur(s)'], size: Number(d['nb. de diffusions']) }})
        .get( (err, rows) => {
            myWords = rows;

            var svg = d3.select("#word-cloud-realisateurs").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var layout = d3.layout.cloud()
                .size([width, height])
                .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
                .padding(10)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .fontSize(function(d) { return d.size; })
                .on("end", draw);
            layout.start();

            function draw(words) {
                svg
                    .append("g")
                    .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .attr("font-size", function(d) { return d.size; })
                    .attr("fill", "#ffc710")
                    .on("mouseover", function(d) {d3.select(this).style("fill", "#fffc1e");})
                    .on("mouseout", function(d) {d3.select(this).style("fill", "#cb932b");})
                    .attr("text-anchor", "middle")
                    .style("font-family", "Impact")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
            }
        });



}