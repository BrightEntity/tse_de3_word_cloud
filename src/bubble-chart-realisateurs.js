import * as d3 from 'd3'
import * as d3Hierarchy from 'd3-hierarchy'
import * as d3ScaleChromatic from 'd3-scale-chromatic'

// d3.layout.hierarchy = d3Hierarchy.hierarchy;

export default function bubbleChartRealisateurs() {
    d3.format(",d");

    var D3Simplified = {};

    D3Simplified.BubbleChart = function(){

        var diameter;

        /**
         * Create a bubble chart
         *
         * @param {data} array of objects with name/value keys
         * @param {elm} string the element which to put this chart
         * @param {size} object with width/height keys
         * @param {pallet} array | undefined of hex codes for the bubble colors
         */
        this.createChart = function(data, elm, size, pallet) {

            pallet = pallet || ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
            var domain = [],
                sorted = [];

            data = data.sort(function(a, b){ return b.value - a.value});


            for(var i=0; i<data.length; ++i){
                domain.push(data[i].value);
            }

            var diameter = Math.min(size.width, size.height),
                color  = d3.scale.ordinal().domain(domain).range(pallet);

            var bubble = d3.layout.pack()
                .sort(null)
                .size([size.width, size.height])
                .padding(1.5);

            var svg = d3.select(elm).append("svg")
                .attr("width", size.width)
                .attr("height", size.height)
                .attr("class", "bubble");

            var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

            var circles = svg.selectAll("circle")
                .data(nodes, function(d){return d.name;})
                .enter()
                .append("circle")
                .attr("r", 0)
                .style("fill", function(d) { return color(d.value); })
                .attr("cx", function(d){ return d.x;})
                .attr("cy", function(d){ return d.y;})
                .attr("class", "node");

            circles.transition()
                .duration(1000)
                .attr("r", function(d) { return d.r; })
                .each('end', function(){ display_text();});

            function display_text() {
                var text = svg
                    .selectAll(".text")
                    .data(nodes, function(d){return d.name;});

                text.enter().append("text")
                    .attr("class", "text")
                    .style("font-size", "10px")
                    .attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; })
                    .attr("dy", ".3em")
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.name.substring(0, d.r / 3); });
            }

            function hide_text() {
                var text = svg.selectAll(".text").remove();
            }

            this.changeData = function(newData){
                hide_text();
                nodes = bubble.nodes({children:newData}).filter(function(d) { return !d.children; });
                circles = circles.data(nodes);
                circles.transition().duration(1000)
                    .attr("r", function(d){ return d.r;})
                    .attr("cx", function(d){ return d.x;})
                    .attr("cy", function(d){ return d.y;})
                    .each('end', function(){ display_text();});
            }
        }

        d3.select(self.frameElement).style("height", diameter + "px");

        return this;
    };

    d3.csv("assets/realisateurs_le_plus_diffuses.csv")
        .row(d => { return { "name": d["réalisateur(s)"], "value": Number(d["nb. de diffusions"]) }})
        .get((err,rows) => {
            var bubble_chart_journalistes = new D3Simplified.BubbleChart();

            bubble_chart_journalistes.createChart(
                rows,
                "#bubble-chart-realisateurs",
                { width: 500, height: 500}
            )
        })



}