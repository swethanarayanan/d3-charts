/*global d3*/

// set the dimensions and margins of the graph
var margin = {top: 150, right: 150, bottom: 150, left: 150};
var width = 1050 - margin.right - margin.left;
var height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Labels of row and columns
var myGroups = ["Method1","Method2","Method3","Method4","Method5","Method6","Method7","Method8","Method9", "Method10" ];
var myVars = ["p1","p2","p3","p4" ];

// Build X scales and axis:
var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.01);
    
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .style("font", "13px sans-serif");

// Build Y scales and axis:
var y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.01);

svg.append("g")
    .call(d3.axisLeft(y))
    .style("font", "13px sans-serif");

// Build color scale
var myColor = d3.scaleLinear()
    .range(["#f0c294","#7b3014"])
    .domain([0,5]);

// Add chart title
svg.append("g").append("text")
    .attr("class", "chart title")
    .attr("x", 0)
    .attr("y", -30)
    .attr("font-family", "sans-serif")
    .attr("font-size", 15)
    .text("Methods which have the minimum number of stalls for video V7 under different network profiles");

// Add legend
var key = d3.select("#legend")
    .append("svg")
    .attr("width", 400 )
    .attr("height", 70)
    .append("g")
    .attr("transform",
        "translate(" + 80 + "," + 20 + ")");

var legend = key.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#f0c294")
    .attr("stop-opacity", 1);

legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#7b3014")
    .attr("stop-opacity", 1);

key.append("rect")
    .attr("width", 300)
    .attr("height", 20)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

var y1 = d3.scaleLinear()
    .range([300, 0])
    .domain([5,0]);

var yAxis = d3.axisBottom()
    .scale(y1)
    .ticks(5);

key.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,30)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end")
    .text("axis title");

//Read the data
d3.csv("task4.csv", function(data) {

    // create a tooltip
    var tooltip = d3.select("#heatmap")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function() {
        tooltip.style("opacity", 1);
    };
    var mousemove = function(d) {

        tooltip
            .html("Numbers of stalls during playback for this network profile-method combination is : " + d.numStall)
            .style("left", (d3.mouse(this)[0]+70) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
    };
    var mouseleave = function() {
        tooltip.style("opacity", 0);
    };

    // add the squares
    svg.selectAll()
        .data(data, function(d) {return d.method+":"+d.profile;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x(d.method); })
        .attr("y", function(d) { return y(d.profile); })
        .attr("width", x.bandwidth() )
        .attr("height", y.bandwidth() )
        .style("fill", function(d) { return myColor(d.numStall);} )
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
});