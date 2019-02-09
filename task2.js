/*global d3*/

// Create the parent SVG
var svg = d3.select("svg");
var margin = { top: 70, right: 20, bottom: 50, left: 225 };
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//call tips
const tip = d3.tip().html(d => d.value);
svg.call(tip);

//create scales
//The scale spacing the groups:
var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

//The scale for spacing each group's bar:
var x1 = d3.scaleBand()
    .padding(0.05);

//The scale for y axis
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

//The scale for bar colors
var z = d3.scaleOrdinal()
    .range(["#f3babc", "#ec838a","#de425b"]);

// Add chart title
g.append("text")
    .attr("class", "chart title")
    .attr("x", 0)
    .attr("y", -30)
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .text("Average QoE for a method grouped by different buffer configurations");

// Add x-axis title
g.append("text")
    .attr("class", "x axis title")
    .attr("x", width - 65 )
    .attr("y", height + 40);

//draw chart
d3.csv("Task2.csv", function(d, i, columns) {
    for (i = 1; i < columns.length; ++i) d[columns[i]] = +d[columns[i]];
    return d;
}, function(error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    x0.domain(data.map(function(d) { return d.method; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class","bar")
        .attr("transform", function(d) { return "translate(" + x0(d.method) + ",0)"; })
        .selectAll("rect")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("y", function(d) { return y(d.value); })
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0))
        .style("font", "13px sans-serif");

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .style("font", "13px sans-serif")
        .append("text")
        .attr("x", 10)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "start")
        .text("Average QoE");

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width   )
        .attr("y", -20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", z)
        .attr("stroke", z)
        .attr("stroke-width",2)
        .on("click",function(d) { update(d); });

    legend.append("text")
        .attr("x", width - 10)
        .attr("y", -10)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

    var filtered = [];

    //
    // Update and transition on click
    //

    function update(d) {
    //
    // Update the array to filter the chart by:
    //
    // add the clicked key if not included:
        if (filtered.indexOf(d) == -1) {
            filtered.push(d);
            // if all bars are un-checked, reset:
            if(filtered.length == keys.length) filtered = [];
        }
        // otherwise remove it:
        else {
            filtered.splice(filtered.indexOf(d), 1);
        }

        //
        // Update the scales for each group(/states)'s items:
        //
        var newKeys = [];
        keys.forEach(function(d) {
            if (filtered.indexOf(d) == -1 ) {
                newKeys.push(d);
            }
        });
        x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { if (filtered.indexOf(key) == -1) return d[key]; }); })]).nice();

        // update the y axis:
        svg.select(".y")
            .transition()
            .call(d3.axisLeft(y).ticks(null, "s"))
            .style("font", "13px sans-serif")
            .duration(500);
        //
        // Filter out the bands that need to be hidden:
        //
        var bars = svg.selectAll(".bar").selectAll("rect")
            .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); });

        bars.filter(function(d) {
            return filtered.indexOf(d.key) > -1;
        })
            .transition()
            .attr("x", function() {
                return (+d3.select(this).attr("x")) + (+d3.select(this).attr("width"))/2;
            })
            .attr("height",0)
            .attr("width",0)
            .attr("y", function() { return height; })
            .duration(500);

        //
        // Adjust the remaining bars:
        //
        bars.filter(function(d) {
            return filtered.indexOf(d.key) == -1;
        })
            .transition()
            .attr("x", function(d) { return x1(d.key); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x1.bandwidth())
            .attr("fill", function(d) { return z(d.key); })
            .duration(500);

        // update legend:
        legend.selectAll("rect")
            .transition()
            .attr("fill",function(d) {
                if (filtered.length) {
                    if (filtered.indexOf(d) == -1) {
                        return z(d);
                    }
                    else {
                        return "white";
                    }
                }
                else {
                    return z(d);
                }
            })
            .duration(100);
    }
});
