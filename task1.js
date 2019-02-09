/* eslint-disable no-unused-vars */
/*global d3*/

function createChart(csvFile,subTitle) {
// Create the parent SVG
    var marginTopValue = 150;
    var marginRightValue = 150;
    var marginBottomValue = 150;
    var marginLeftValue = 150;
    var leftAxisLowerRange = 0;
    var leftAxisUpperRange = 2500;
    var rightAxisLowerRange = 0;
    var rightAxisUpperRange = 250;

    var chartTitleFontSize = 20;
    var chartSubTitleFontSize = 15;

    var chartTitleYCoordinate = -120;
    var chartSubTitleYCoordinate = -80;

    var svg = d3.select("svg");
    var margin = { top: marginTopValue, right: marginRightValue, bottom: marginBottomValue, left: marginLeftValue };
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //create scales
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    var y0 = d3.scale.linear().domain([leftAxisLowerRange, leftAxisUpperRange]).range([height, 0]),
        y1 = d3.scale.linear().domain([rightAxisLowerRange, rightAxisUpperRange]).range([height, 0]);

    //addAxes
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxisLeft = d3.svg.axis().scale(y0).ticks(5).orient("left");
    var yAxisRight = d3.svg.axis().scale(y1).ticks(5).orient("right");

    //add tips
    const tip_numQuality = d3.tip().html(d => d.avgNumQualityChanges);
    svg.call(tip_numQuality);
    const tip_avgQuality = d3.tip().html(d => d.avgQuality);
    svg.call(tip_avgQuality);

    //add titles
    g.append("text")
        .attr("class", "chart title")
        .attr("x", 0)
        .attr("y", chartTitleYCoordinate)
        .attr("font-family", "sans-serif")
        .attr("font-size", chartTitleFontSize)
        .text("Average quality and average number of changes in quality for a method");

    d3.csv(csvFile, type, function(error, data){
        createSubtitle(subTitle, chartSubTitleYCoordinate);
        createBarChart(data,1);
    });

    function createSubtitle(subTitle,y){
        g.append("text")
            .attr("class", "chart subtitle")
            .attr("x", 0)
            .attr("y", y )
            .attr("font-family", "sans-serif")
            .attr("font-size", chartSubTitleFontSize)
            .text(subTitle);
    }

    //create chart
    function createBarChart(data,i) {

        data.forEach(row => {
            row.avgQuality = parseInt(row.avgQuality);
        });

        data.sort((a, b) => b.avgQuality - a.avgQuality);

        x.domain(data.map(function(d) { return d.method; }));
        y0.domain([0, d3.max(data, function(d) { return d.avgQuality; })]);

        g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height*i + ")")
            .call(xAxis)
            .style("font", "13px sans-serif");

        g.append("g")
            .attr("class", "y axis axisLeft")
            .attr("transform", "translate(0,0)")
            .call(yAxisLeft)
            .style("font", "13px sans-serif")
            .append("text")
            .attr("y", 0)
            .attr("dy", "-2em")
            .attr("dx", "2em")
            .style("text-anchor", "end")
            .style("text-anchor", "end")
            .text("Average Quality (in Kbps)");

        g.append("g")
            .attr("class", "y axis axisRight")
            .attr("transform", "translate(" + (width) + ",0)")
            .call(yAxisRight)
            .style("font", "13px sans-serif")
            .append("text")
            .attr("x", 100)
            .attr("y", 0)
            .attr("dy", "-2em")
            .attr("dx", "2em")
            .style("text-anchor", "end")
            .text("Average number of changes in quality");

        var bars = g.selectAll(".bar").data(data).enter();

        bars.append("rect")
            .attr("class", "bar1")
            .attr("x", function(d) { return x(d.method); })
            .attr("width", x.rangeBand()/2)
            .attr("y", function(d) { return y0(d.avgQuality); })
            .attr("height", function(d) { return height - y0(d.avgQuality); })
            .on("mouseover", tip_avgQuality.show)
            .on("mouseout", tip_avgQuality.hide);

        bars.append("rect")
            .attr("class", "bar2")
            .attr("x", function(d) { return x(d.method) + x.rangeBand()/2; })
            .attr("width", x.rangeBand() / 2)
            .attr("y", function(d) { return y1(d.avgNumQualityChanges); })
            .attr("height", function(d) { return height - y1(d.avgNumQualityChanges); })
            .on("mouseover", tip_numQuality.show)
            .on("mouseout", tip_numQuality.hide);
    }

    function type(d) {
        d.avgQuality = +d.avgQuality;
        return d;
    }
}