# d3-charts

# Repository for the code
https://github.com/swethanarayanan/d3-charts

# How to run
The tasks are organized across html files under html folder

# Dataset

In this visualization task, we have dataset from a team that has performed several experiments to test the efficiency of video streaming methods.

The result csv file has following attributes. The definitions for the attributes are:
- profile: Network profile used for testing.
- sample: Video sample on which test is conducted.
- method: Method used for streaming.
- quality: Average quality played (in Kbps).
- change: Changes in quality during the playback.
- inefficiency: Inefficiency of the method to fully utilize the available bandwidth.
- stall: Total stall duration (in seconds) during the playback.
- numStall: Number of stalls happened during the playback.
- avgStall: Average stall duration (in seconds) during the playback.
- overflow: The duration (in seconds) for which buffer was full.
- numOverflow: Number of times when buffer was full.
- qoe: Quality of experience during the playback.
- bufSize: Buffer configuration, i.e., the maximum content that can be buffered/ buffer capacity (in seconds). Do note that there are three configurations : 30 seconds and 60 seconds come under the same buffer configuration category. The other two configurations are 120 seconds and 240 seconds.

# Pre-processing
We pre-process the data in R. For each of the tasks we use libraries like dplyr, reshape2, tidyr to convert the data into the required format for consumption by d3 libraries. The processed data is stored in data folder.

# Tasks
## 1.  Draw plots to show the Average quality and number of changes in quality for a method. Each buffer configuration should have separate plot.

### Type of chart:
We use dual-axis bar chart for this task, ordered by decreasing average quality and a separate plot for each buffer configuration. 

### Why?
Dual axis bar charts help us compare methods across 2 different dimensions in a visually appealing way and the tooltips help drill into details. No legend here as its obvious as the colors are obvious from the graph itself. We can clearly see compare average quality and avg number of changes in quality across methods and with in a method.

### Other alternatives considered : Stacked Bar, dual axis Line Graph

### Visual Encoding:
Average quality : Quantitative -> Color Hue, Length
Method: Ordinal -> Position
Average number of changes in quality : Quantitative -> Color Hue, Length

### Insights gained:
1) Method 5 has the high average quality across all buffer configurations
2) Buffer configuration type 240s has the lowest number of changes in quality overall as well for top 3 methods: 5,6,10
3) Method 1 has the least average quality as well as least average changes in quality

## 2. Draw a single plot to show the Average QoE for a method grouped by different buffer configuration. 

### Type of chart:
We use clustered bar chart for this task with each cluster having all 3 buffer configurations. 

### Why?
The plots are in such a way that we can compare the Average QoE of the method with itself for different buffer configurations as well as with different methods within a buffer configuration (by selecting and unselecting the legend select box).

### Other alternatives considered : Stacked bar

### Visual Encoding:
Average QoE: Quantitative -> Length
Buffer Size: Quantitative Ordinal -> Color Saturation
Method: Ordinal -> Position

### Insights gained:
1) Methods 5,6,10 have generally higher average QoE across buffer configurations
2) For 30/60,120 and 240 buffer configurations, Method 5 has the best QoE
3) Method 1 has the least QoE for all 3 buffer configurations

## 3. Draw plots to show the correlation between inefficiency and quality for all methods in different buffer configurations.

### Type of chart:
We use heatmap of pearson correlation coefficient between inefficiency and quality for all methods in different buffer configurations.

### Why?
The correlation coefficents help us easily compare which methods are positively correlated and which are negatively correlation. In general, for higher quality, we want lower inefficiency. So negative correlation would mean we prefer that method for that buffer configuration

### Visual Encoding:
correlation coefficient between inefficiency and quality: Quantitative -> Color Saturation
Buffer Size: Quantitative Ordinal -> Postion
Method: Ordinal -> Position

### Insights gained:
1) For buffer configuration 30/60 second, Method 7 has the highest negative correlation
2) For buffer configuration 120 second, Method 1 and 7 has the highest negative correlation
3) For buffer configuration 240 second, Method 4 has the highest negative correlation
4) Method 8 has the most positive correlation

## 4. We would like to know the methods which have the minimum number of stalls for video V7 under different network profiles. Draw appropriate plot for it.

### Type of chart:
We use heatmap of number of stalls for all methods in different network profiles.

### Why?
Heatmaps seem to be the best suited for this as it's immediately apparent for the color shading which methods have the minimum number of stalls for different network profiles for V7.

### Visual Encoding:
Number of stalls: Quantitative -> Color Saturation
Network Profile: Ordinal -> Postion
Method: Ordinal -> Position

### Insights gained:
1) For profile p1, all methods except 1,3,4 have no stalls
2) For profile p2, all methods have no stalls
3) For profile p3, all methods except 3,4 have no stalls
4) For profile p4, all methods except 3 have no stalls
5) Method 3 has the most number of stalls across all network profiles

# Next Steps after submission for personal learning
- I will host this in github pages in a single index.html after the submission. I will be using npm to manage package dependencies
- I will port all the tasks to use d3 v5
- Refactor the code more and make it as modular and DRY (Dont repeat yourself) as possible and follow javascript/D3 best practices
- More animation and drill down capabilities