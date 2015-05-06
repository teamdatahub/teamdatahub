import csv
import re
import os
trips =  open('/Users/niamhdurfee/Downloads/hubway/hubway_trips.csv','r').readlines()
header = re.split(",",trips[0][:-2])
header.remove('status')
header.remove('seq_id')
header.remove('hubway_id')
header.remove('bike_nr')
header.remove('end_date')
header[-2] = 'age'
header.append('ID')

path = "../trips_mayor.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
i = 0
j = 0
for trip in trips[1:]:
	trip = re.sub("Female",'F',trip)
	trip = re.sub("Male",'M',trip)
	trip = re.sub("Casual",'C', trip)
	trip = re.sub("Registered",'R',trip)
	trip = re.split(",",trip[:-2])
	if (int(trip[3]) > 60):
		i += 1
		trip.append(i)
		if (trip[-6] == 'B00001'):
			j += 1
			del trip[0:3]
			del trip[3]
			del trip[4]
			trip[0] = int(trip[0])/60
			if trip[-5] == 'R':
				if trip[-3] != '':
					trip[-3] = str(2011 - int(trip[-3]))
				else:
					trip[-3] = None
			datafile.writerow(trip)
print j