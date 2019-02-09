(function (d3) {
    'use strict';
    // set the dimensions and margins of the graph
    var svgWidth = 1200;
    var svgHeight = 500;
    var margin = { top: 100, right: 150, bottom: 100, left: 150 };
    var width = svgWidth - margin.right - margin.left;
    var height = svgHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#task4")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Labels of row and columns
    var myGroups = ["Method1", "Method2", "Method3", "Method4", "Method5", "Method6", "Method7", "Method8", "Method9", "Method10"];
    var myVars = ["p1", "p2", "p3", "p4"];

    // Build X scales and axis:
    var x = d3.scaleBand()
        .range([0, width])
        .domain(myGroups)
        .padding(0.01);

    var tooltip = d3.select('body').append('div').attr('class', 'tooltip');

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font", "13px sans-serif")
        .append("text")
        .attr("x", 800)
        .attr("y", 50)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "start")
        .text("Streaming Method");

    // Build Y scales and axis:
    var y = d3.scaleBand()
        .range([height, 0])
        .domain(myVars)
        .padding(0.01);

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font", "13px sans-serif")
        .append("text")
        .attr("x", -120)
        .attr("y", 5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("text-anchor", "start")
        .text("Network Profile");

    // Build color scale
    var task4Color = d3.scaleLinear()
        .range(["#f0c294", "#7b3014"])
        .domain([0, 5]);

    // Add chart title
    svg.append("g").append("text")
        .attr("class", "chart title")
        .attr("x", 100)
        .attr("y", -30)
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .text("Heatmap of number of stalls in a Network Profile-Method combination. Move mouse for more info.");

    // Add legend
    var task4legendKey = d3.select("#task4legend")
        .append("svg")
        .attr("width", 400)
        .attr("height", 70)
        .append("g")
        .attr("transform",
            "translate(" + 80 + "," + 20 + ")");

    var task4legend = task4legendKey.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    task4legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#f0c294")
        .attr("stop-opacity", 1);

    task4legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#7b3014")
        .attr("stop-opacity", 1);

    task4legendKey.append("rect")
        .attr("width", 300)
        .attr("height", 20)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)");

    var y1 = d3.scaleLinear()
        .range([300, 0])
        .domain([5, 0]);

    var yAxis = d3.axisBottom()
        .scale(y1)
        .ticks(5)

    task4legendKey.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("axis title");

    //Read the data
    d3.csv("../data/task4.csv", function (data) {
        // add the squares
        svg.selectAll()
            .data(data, function (d) { return d.method + ":" + d.profile; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.method); })
            .attr("y", function (d) { return y(d.profile); })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) { return task4Color(d.numStall); })
            .on('mousemove', function (d) {
                tooltip
                    .style('left', d3.event.pageX - 50 + 'px')
                    .style('top', d3.event.pageY - 70 + 'px')
                    .style('display', 'inline-block')
                    .html(
                    '<strong> Number of Stalls : ' + d.numStall + '</strong>'
                    )
            })
            .on('mouseout', function (d) {
                tooltip.style('display', 'none')});
    });
})(window.d3)