#setwd("/Users/swetha/Google Drive/MSBA/CS5346 Information Visualization/CS5346_A1_D3/d3");
library(dplyr)
results <- read.csv("results.csv")

#Task 1
#Draw plots to show the Average quality and number of changes in quality for a method.Each buffer configuration should have separate plot.
generateTask1Data <- function(bufSize, fileName) { 
  results_bufSize <- results[results[, "bufSize"] == bufSize,]
  arr = c("method", "quality", "change" )
  data <- results_bufSize %>%
    select(arr)
  data$quality <- as.numeric(data$quality)
  data$change <- as.numeric(data$change)
  task1Data_bufSize <- data %>%
    group_by(.dots=c("method")) %>% 
    summarise_all(funs(mean))
  colnames(task1Data_bufSize) <- c("method","avgQuality","avgNumQualityChanges")
  write.table(task1Data_bufSize, file = fileName, sep = ",", row.names=FALSE, quote = FALSE)
}
generateTask1Data("120","task1_120.csv")
generateTask1Data("240","task1_240.csv")
generateTask1Data("30/60","task1_30_60.csv")

#Task 2
#Average QoE for a method grouped by different buffer configuration.
library(reshape2)
library(tidyr)
data <- results %>%
  select(c("method", "bufSize", "qoe" ))
task2Data <- data %>%
  group_by(.dots=c("method","bufSize")) %>% 
  summarise_all(funs(mean))
task2Data$bufSize <- as.character(task2Data$bufSize)
task2Data_wide <- spread(task2Data, bufSize, qoe)
write.table(task2Data_wide, file = "task2.csv", sep = ",", row.names=FALSE, quote = FALSE)

#Task 3
#Draw plots to show the correlation between inefficiency and quality for all methods in different buffer configurations.
arr = c("method", "bufSize","quality", "inefficiency")
data <- results %>%
  select(arr)
#Pearson Correlation is calculated by default
task3Data <- data %>% group_by_(.dots=c("method", "bufSize"))%>% summarise(value=cor(quality,inefficiency))
write.table(task3Data, file = "task3.csv", sep = ",", row.names=FALSE, quote = FALSE)

#Task 4
#We would like to know the methods which have the minimum number of stalls for video V7 under different network profiles.
v7Results <- results[results[, "sample"] == "v7",]
arr = c("profile", "method", "numStall")
data <- v7Results %>%
  select(arr)
task4Data <- aggregate(data$numStall, by=list(data$profile, data$method), FUN=sum)
colnames(task4Data) <- c("profile","method","numStall")
write.table(task4Data, file = "task4.csv", sep = ",", row.names=FALSE, quote = FALSE)
