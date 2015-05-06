import re,os,csv

trips = [line for line in open("../trips.min.csv")]
trips = [re.split(",", line[:-2]) for line in trips]
routes = [line for line in open("../routes_stats.csv")]
routes = [re.split(",", line[:-2]) for line in routes]

header = [routes.pop(0)+['trips']]
temp = {route[0]:0 for route in routes}
for trip in trips[1:]:
	orig = int(trip[3])
	dest = int(trip[4])
	if (orig != dest):
		a = min(orig,dest)
		b = max(orig,dest)
		key = str(a).zfill(3)+str(b).zfill(3)
		temp[key] += 1

routes = [route + [temp[route[0]]] for route in routes]
final = header + routes
datafile = csv.writer(open('routes_stats.csv','w'))
datafile.writerows(final)