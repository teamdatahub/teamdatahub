# Overview and Motivation
###### About Hubway

Hubway is a bicycle sharying system in the Boston area. Launched at the end of July in 2011, Hubway started with 61 stations throughout the city and 600 bicycles. In the time afterwards, Hubway expanded to the neighboring cities of Cambridge, Somerville, and Brookline. Since its launch in 2011, Hubway has grown to more than 140 stations and more than 1300 bikes.

In 2013, Hubway in partnership with the Metropolitan Area Planning Council, released data from more than a half million trips that were taken on Hubway bikes between its launch on July 28, 2011 until the end of September 2012. Their mission? Ask the public to put together a visualization of all the trip history. While the challenge itself has officially closed, we decided to take on the Hubway and MAPC visualization challenge.

###### The Team Datahub Way

*We are Team Datahub, and we are on a mission to visualize this bike sharing platform.* As students, we make use of many forms of alternative transporation to explore and commute around Boston. In particular, bikes are a popular, affordable method of transportation for students, professionals, and tourists alike. **We want to understand more about who uses bikes and for what purpose, as well as how people get around Boston.** Our goal is to find answers to these questions for ourselves, and create a visualization for others to discover the answers as well.

# Related Work

The Hubway Visualization Challenge has already come to a close and awards were given out to visualizations in a few categories: Overall Best Visualization, Best Analysis, Best Data Narrative, Best Data Exploration Tool, People's Choice, and Honorable Mention. Despite these being available, we made it a point not to look at the winner's examples. We were intent on not allowing other designs to fixate our own focus. However, there is a possibility we were slightly influenced by some of the winners--since we were able to see the narrow screenshot of each winner, as shown below.


![Image of Challenge Winners](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/img/challengewinners.png)

We also decided to look at some inspiration from a different mode of transportation--taxis. There are a couple visualizations recently about the travel of taxis throughout New York City. Therefore, we took a look at a visualizations tackling this problem. These are available [here](http://www.nytimes.com/interactive/2010/04/02/nyregion/taxi-map.html?_r=0 "here") and [here](http://chriswhong.com/data-visualization/taxitechblog1/ "here").

# Questions
We set out with three main questions that we hoped our visualization would solve. These three main questions guided our visualization in the way we structured our data, the way we designed our visualization, and the ways in which we hoped viewers would interact with our visualization. We wanted to make sure our visualization would allow viewers to ask these same questions for themselves, discover answers on their own, and make new and interesting conclusions. Without further ado, here are the three questions Team Datahub set out to answer.

#### #1 Why do people use Hubway?

When people use Hubway, what are they doing? Are they rushing to work during commuting hours? Are they visitors using bikes to get around the city more easily? Are they taking a leisurely stroll on the weekend? We wanted to help our viewers find and explore the answers to these questions and hopefully, get a better idea of the use cases of Hubway trips.

#### #2 Who is using Hubway?

We wanted to find out more about the riders themselves. Are they visitors or live here in Boston? Are they male or female? Are they old or young? Are they commuters or leisure riders? In answering these questions, we are able to get a better understanding of the people on the bike.

#### #3 Where's everyone going?

We wanted to discover the Hubway hot spots--the places people use bikes most often. This includes finding out which stations see the most traffic, but also which routes see the most traffic. Are there stations that act as the Hubs of all activity? Are there stations that see more incoming than outgoing traffic? Are there certain routes that are extremely popular? Are there certain routes that have never been taken on a Hubway bike? We decided to create a visualization that would answer these specific questions, and in result, allow our viewer to see where everyone is going.

# Data
In 2012, Hubway and the Metropolitan Area Planning Council announced a challenge: they wanted the public to visualize the data from more than 5 million Hubway trips over the course of 13 months. To do so, Hubway released the data of their trip history. This means that anytime a rider checked out a bike from any one of the now 140 Hubway stations, the system recorded some basic information about that trip.

**Duration** The entire duration of the trip. We wanted to use the duration to look at what sort of trips riders were taking. We wanted to define each trip as either a leisure ride or a purposeful ride. We decided that leisure rides would be defined as any trip that took less than 1.5x times the suggest ride time on Google maps.

**Start Date + End Date** This includes both start and end dates as well as start time and end time. We wanted to use the dates and times to determine a number of factors concerning how riders are using Hubway. This would potentially give us a better idea of riders' purpose for riding. Do riders ride more on weekends or weekdays? This could tell us a bit more about leisure trips vs. commuting trips. Do riders ride during peak rush hours or in the off-hours? This could also inform us about the trip's purpose.

**Start + End Stations** Each station has a unique ID number as well as the station name. The start station is where the bicycle is checked out from and the end station is where the bicycle is checked back into. We can use the station information to find the "Hubs" of Hubway--which of the stations are most popular as starting locations and end locations. We can use the start and end stations together to get an idea of whether trips are Point A to Point B or are roundtrips. Lastly, we can use this information to find the most popular routes that people take.

**Bike Number** Each bike has a unique bike number. This bike number can be used to track every trip a bicycle has made during the dataset time period. We were curious about using the bike number as a way to track how a single bike might travel throughout the city during the dataset time.

**Member Type** On Hubway, there are two types of users: both registered and casual users. Registered users have signed up for a Hubway subscription. At this point in time, Hubway subscriptions are $85 annually or $20 monthly. Casual users have signed up for a shorter subscription--either 72 or 24 hours. In both cases, any ride under 30 minutes is free. However, rides that takes 31-60 minutes cost an additional $2 and rides that take 61-90 minutes cost an additional $4. Beyond that, every additional half hour costs another $8.

**Zip Code + Birthdate + Gender** For trips taken by registered users, the dataset has some additional data points. First, the zip code given for a registered user. Since Hubway is limited to the Boston area and there are zip codes outside of the Boston area, we know that zip codes don't represent where the rider is at the time, but rather where the rider is originally from (most likely from credit zip code). We are able to use this zip code to determine which riders are visitors and which riders live in the city. Furthermore, we are able to use the birthdate given to get a better sense of rider's age. Lastly, we are able to use the gender to determine whether riders are female or male.

This data is available for download in a CSV file at the [Hubway Data Visualization Challenge](http://hubwaydatachallenge.org/trip-history-data/ "Hubway Data Visualization Challenge"). We immediately ran into two main issues with the dataset. First, the dataset was a large file at more than 17MB. Second, we needed to manipulate the data such that they were in the correct layout for our visualization. To do this, Niamh wrote a number of python scripts to both cut down the size of the data as well as to derive additional values. As a result, we have a number of CSV files with data for different purposes.

To summarize, here are the data files that were derived. There are now data files for filtering by registered/unregistered or by gender. There is now one stations data file that includes coordinates, name, neighborhoods, and all other stations traveled to from that station. Furthermore, we used the Google API to calculate the distance of each possible route. This was necessary in order to compute leisure vs. commuting rides. For each possible trip, the actual biking distance was calculated, as well as the recommended biking time from Google maps. This data was then used to specify whether or not a trip is considered commuting or leisure.

#Exploratory Data Analysis

Most of our exploration with the data happened during the process in which we fine-tuned and manipulated the data into the

# Design Evolution

From the beginning, we had a rather clear idea of what types of visualizations we wanted to implement. We wanted multiple views, with the option to explore with filters, ranges, and brushes. The initial sketches of our visualization concepts are displayed below.

![Image of Figure 1](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/map.jpg)

Figure 1: Map visualization by Hubway station

![Image of Figure 2](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/maptrips.JPG)

Figure 2: Map visualization of Hubway trips

![Image of Figure 3](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/stationdetails.jpg)

Figure 3: In Depth View of Hubway Stations

![Image of Figure 4](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/databreakdown.jpg)

Figure 4: In-depth view of stations + users

Our main view will be a map of the Boston, Cambridge, Somerville, & Brookline area. There will be two visualizations that you can switch between that are overlayed on the map. Figure 1 shows nodes at the station locations. Each node will vary in size depending on how a particular station is. You will be able to add filters for the time of day, gender, age, etc. that will modify the nodes. Figure 2 will be lines connecting the stations that will show the popularity of the route based on color. You will be able to apply the same filters from Figure 1 to this visualization. Also, hovering over a route can show more details of that route such as the average trip length, average speed, gender, and age of the rider. We also plan on having two more visualizations that will show other stats of the routes, stations, and the average user of Hubway (Figures 3 & 4). We plan on switching to these views by either clicking on a station or route. Each of these visualizations will also have some filters and a time slider to allow the user to see how they change over time.

We decided on these four main visualizations since they could answer our main questions. As a reminder, we wanted to know why do people use Hubway, who is using Hubway, and where they are going. Using the four visualizations outlined above, we are able to show where they're going on a map view. Also, it allows viewers to explore more about who is using Hubway in certain respects. Furthermore, it allows them to draw their own conclusions about why people are using Hubway.

A week into the project, we decided that we should be working on a backup view in case we were unable to implement the map view exactly as we wanted to. We decided upon a chord layout that would depict the relationship between separate neighborhoods. This new view is shown in the figure below. The main screen shows the relationship of trips between the four cities--Cambridge, Brooklin, Boston and Somerville. The chords can be toggled to represent three different aspects--volume of trips, speed of the average trip, and average duration of the trip. Furthermore, any chord can be examined further to see additional user, station and trip information (as we also had in our initial design). Second, there is the option to select one particular city and look within that city. Therefore, if we selected Cambridge, we would then transition to a similar chord layout that displays all the neighborhoods of Cambridge (i.e. Porter, Central, Kendall, and Harvard Squares). We would be able to see the names of individual stations at this point. Like the previous design, this design encompasses all three of our main questions and gives the user the ability to explore.


![Image of Figure 5](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/design2.JPG)

Figure 5: Chord layout design

By the time the design studio came around, it seemed that both layouts were each doable, but we would not be able to do both views. Therefore, we used the design studio to get feedback from another group whether to pursue the map or the chord layout. While the other team informed us that they did like the chord layout, it was clear that the map design was more intuitive and preferable for better exploring. Therefore, we decided to focus our efforts on the map layout moving forward.

# Implementation

Our first step was deciding how to create a map view. After some research and experimentation, we decided upon using Leaflet and MapBox. More about these libraries can be found [here](http://leafletjs.com/features.html "here") and [here](https://www.mapbox.com/mapbox.js/api/v2.1.8/ "here"). From here, we were able to create a map view, as shown in Figure 6. The nodes in the figure are sized in area according to the average trip volume per hour for that hub. Furthermore, the color of the nodes represent the proportion of average trip volume that is arriving. That means if more than 50% of trips are arriving, the nodes are green; if less than 50% of trips are arriving, the nodes are red; and if 50% of trips are arriving and departing, the nodes are grey. Both color and size of the trips are determined on a scale. Since all nodes fell between the 40%-60% range for arrivals, the scale for color is in a range from .45 to .55. In addition, we created a hovering option for routes that quick displays the two stations as well as the volume of trips.

![Image of Figure 6](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/map_view.png)

Figure 6: Map View

When it came to drawing the routes between stations, we ran into a problem. There were so many trips between stations that the map became essentially impossible to see. Therefore, at this point, we decided to show only routes with a minimum number of trips. Below, we have included views that include ALL routes (Figure 7), routes with more than 200 trips (Figure 8) and routes with more than 500 trips (Figure 9).

![Image of Figure 7](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/ALL.png)

Figure 7: All Routes

![Image of Figure 8](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/200.png)

Figure 8: Routes with 200+ Trips

![Image of Figure 9](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/500.png)

Figure 9: Routes with 500+ Trips

Lastly, we have begun to create the filtering process. As shown below, we have decided to create a brush for time of the day.

![Image of Figure 10](https://github.com/niamhdurfee/cs171-pr-datahub/blob/master/design/img/brush.png)

Figure 10: Brush of time

# Evaluation
To be completed when nearing project's end...