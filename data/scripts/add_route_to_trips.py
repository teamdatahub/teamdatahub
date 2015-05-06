import os, re, csv

temp = [re.sub('\r\n','',route) for route in open('../routes_stats.csv')]
temp = [re.split(',',route) for route in temp]

routes = dict()

for route in temp[1:]:
	routes[str(route[1])] = dict()
	
for route in temp[1:]:
	routes[str(route[1])][str(route[2])] = { 'id': route[0], 'dist': route[3], 'time':route[4], 'speed': route[5]}
trips = [re.sub('\r\n','',trip) for trip in open('../trips.min.csv')]
trips = [re.split(',',trip) for trip in trips]
header = trips[0] + ["type","distance"]
path = 'trips.temp.csv'
# os.remove(path)
f = csv.writer(open(path,'a'))
f.writerow(header)
for trip in trips[1:]:
	if (trip[3] == trip[4]):
		# trip.append('L')
 	# 	est = float("{0:.1f}".format(float(trip[1])/ 9.0)) # Assuming leisure riders go 2/3 the speed recommended by googlemaps
 	# 	trip.append(est)
 		f.writerow(trip)
 	else:
 		orig = str(min(int(trip[3]),int(trip[4])))
		dest = str(max(int(trip[3]),int(trip[4])))
 		temp = routes[orig][dest]
 		if ((float(temp['time'])*1.2) < float(trip[1])):
 			trip[-2] = "L"
 		else:
 			trip[-2]= "M"
 		f.writerow(trip)