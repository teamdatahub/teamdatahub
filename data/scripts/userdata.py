import re, csv, os

trips = [re.split(',',line[:-2]) for line in open('../trips.min.csv')]
trips = trips[1:10]
header = ['date','dur',]
for trip in trips:
	trip[2] = re.split(' ', trip[2])[0]
