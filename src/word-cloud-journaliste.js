import * as d3 from 'd3'
import * as cloud from 'd3-cloud'


d3.layout.cloud = cloud;

export default function wordCloudJournaliste() {

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
///*
    var myWords = [];
    d3.csv("assets/Word_Cloud.csv")
        .row((d) => { return { "word": d['word'], "size": Number(d['size']) }})
        .get((err, data) => {
        myWords = data

            //*/
            /*
            var myWords = [
                {word: "Analyses", size: "90"},
                {word: "Analyste", size: "80"},
                {word: "Communication", size: "30"},
                {word: "Journal", size: "50"},
                {word: "Internet", size: "10"},
                {word: "Ecriture", size: "30"},
                {word: "Redaction", size: "85"},
                {word: "Presse", size: "90"},
                {word: "Article", size: "80"},
                {word: "Journalisme", size: "90"},
                {word: "Recherche", size: "75"},
                {word: "Creation", size: "70"},
                {word: "Professionnel", size: "20"},
                {word: "Presentateur", size: "15"},
                {word: "Television", size: "50"},
                {word: "Radio", size: "50"},
                {word: "Sport", size: "10"},
                {word: "Media", size: "25"},
                {word: "Information", size: "40"},
                {word: "Editorial", size: "10"},
                {word: "Reportage", size: "40"}

            ];
            */

            var svg = d3.select("#my_dataviz").append("svg")
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
                    .style("font-size", function(d) { return d.size; })
                    .style("fill", "#69b3a2")
                    .on("mouseover", function(d) {d3.select(this).style("fill", "#2F8E9F");})
                    .on("mouseout", function(d) {d3.select(this).style("fill", "#69b3a2");})
                    .attr("text-anchor", "middle")
                    .style("font-family", "Impact")
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) { return d.text; });
            }
        });

}