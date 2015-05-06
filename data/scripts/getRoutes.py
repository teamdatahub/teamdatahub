import csv, re, os, simplejson, urllib,time

temp = open('../stations.csv').readlines()
temp = [re.split(',',station[:-2]) for station in temp[1:]]
stations = dict()
for station in temp:
	stations[station[0]] = station[1:]
trips = [re.split(',', trip) for trip in open('../routes.csv')]
trips = trips[1:]
trips = [trips[-1]]
print trips
for trip in trips:
	orig = stations[str(trip[1])]
	dest = stations[str(trip[2])]
	orig_coord = float(orig[-3]), float(orig[-2])
	dest_coord = float(dest[-3]), float(dest[-2])
	url = "http://maps.googleapis.com/maps/api/directions/json?origin={0}&destination={1}&mode=bicycling".format(str(orig_coord),str(dest_coord))
	result= simplejson.load(urllib.urlopen(url))
	if result['status'] == 'OVER_QUERY_LIMIT':
		print "OVER LIMIT AT INDEX "+str(trip[0])
		break
	res = result['routes'][0]['overview_polyline']['points']
	trip.append(res)
	print trip

