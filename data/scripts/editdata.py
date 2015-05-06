import csv, re, os
trips =  open('/Users/niamhdurfee/Downloads/hubway/hubway_trips.csv','r').readlines()
header = re.split(",",trips[0][:-2])
header.remove('status')
header.remove('seq_id')
header.remove('hubway_id')
header.remove('bike_nr')
header.remove('end_date')
header[-2] = 'age'
header = ['ID']+ header

path = "../trips.min.csv" 
os.remove(path)
datafile = csv.writer(open(path,'a'))
datafile.writerow(header)
i = 0
for trip in trips[1:]:
	trip = re.sub("Female",'F',trip)
	trip = re.sub("Male",'M',trip)
	trip = re.sub("Casual",'C', trip)
	trip = re.sub("Registered",'R',trip)
	trip = re.split(",",trip[:-2])
	if ((int(trip[3]) > 60) and ('' != trip[5]) and ('' != trip[7])):
		i += 1
		trip = [i]+trip
		del trip[1:4]
		del trip[4]
		del trip[5]
		trip[1] = int(trip[1])/60
		if trip[-4] == 'R':
			if trip[-2] != '':
				trip[-2] = str(2011 - int(trip[-2]))
			else:
				trip[-2] = None
		datafile.writerow(trip)

