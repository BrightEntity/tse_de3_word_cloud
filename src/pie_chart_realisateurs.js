import * as d3 from 'd3'
import * as d3_scale_chromatic from 'd3-scale-chromatic'

export default function pieChartRealisateurs() {

    var myWords = [];
    d3.csv("assets/realisateurs_le_plus_diffuses.csv")
        .row(function(  d) {
            return { "word": d['réalisateur(s)'], "size": Number(d['nb. de diffusions'])  }
        })
        .get(function (err, rows) {
            myWords = rows;

            myWords = myWords.reduce((acc, n) => {
                if(acc.filter(m => m.word == n.word).length > 0) {
                    acc.find(m => m.word == n.word).size += n.size;
                } else {
                    acc.push(n)
                }

                return acc;
            }, [])

            var w = 530                        //width
            var h = 530                            //height
            var r = Math.min(w, h) / 2 - 10                           //radius

            var color = d3.scale.ordinal()
                .range(d3_scale_chromatic.schemeSet2);     //builtin range of colors

            multiSort(myWords, {
                size: 'desc',
                word: 'asc'
            })

            /**
             * Sorts an array of objects by column/property.
             * @param {Array} array - The array of objects.
             * @param {object} sortObject - The object that contains the sort order keys with directions (asc/desc). e.g. { age: 'desc', name: 'asc' }
             * @returns {Array} The sorted array.
             */
            function multiSort(array, sortObject = {}) {
                const sortKeys = Object.keys(sortObject);

                // Return array if no sort object is supplied.
                if (!sortKeys.length) {
                    return array;
                }

                // Change the values of the sortObject keys to -1, 0, or 1.
                for (let key in sortObject) {
                    sortObject[key] = sortObject[key] === 'desc' || sortObject[key] === -1 ? -1 : (sortObject[key] === 'skip' || sortObject[key] === 0 ? 0 : 1);
                }

                const keySort = (a, b, direction) => {
                    direction = direction !== null ? direction : 1;

                    if (a === b) { // If the values are the same, do not switch positions.
                        return 0;
                    }

                    // If b > a, multiply by -1 to get the reverse direction.
                    return a > b ? direction : -1 * direction;
                };

                return array.sort((a, b) => {
                    let sorted = 0;
                    let index = 0;

                    // Loop until sorted (-1 or 1) or until the sort keys have been processed.
                    while (sorted === 0 && index < sortKeys.length) {
                        const key = sortKeys[index];

                        if (key) {
                            const direction = sortObject[key];

                            sorted = keySort(a[key], b[key], direction);
                            index++;
                        }
                    }

                    return sorted;
                });
            }

            var topValues = myWords.sort((a,b) => b-a).slice(0,3);

            var otherValues = myWords.sort((a,b) => b-a).slice(4,21);

            var sum_values_size = 0;
            var new_size = otherValues.map(function(d) { return {size:d.size}; })

            for(var i=0;i<17;i++){
                sum_values_size += Number(otherValues[i].size);
            }

            topValues.push({word: "Others", size: sum_values_size});

            var vis = d3.select("#pie-chart-realisateurs")
                .append("svg:svg")              //create the SVG element inside the <body>
                .data([topValues])                   //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
                .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

            var arc = d3.svg.arc()//this will create <path> elements for us using arc data
                .outerRadius(r)
                .innerRadius(150);

            var pie = d3.layout.pie()           //this will create arc data for us given a list of values
                .value(function(d) { return d.size; });    //we must tell it out to access the value of each element in our data array

            var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
                .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
                .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

            arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc)                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
                .style("opacity", 1)
                .on("mouseover", function(d) {d3.select(this).style("stroke", "black");})
                .on("mouseout", function(d) {d3.select(this).style("stroke", "none");});

            arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = 100;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")                          //center the text on it's origin
                .text(function(d, i) { return topValues[i].word; });      //get the label from our original data array

        });
//*/


}