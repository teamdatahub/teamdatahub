import re,os,csv

routes = [line for line in open('../routes_stats.csv')]
routes = [re.split(',', line[:-2]) for line in routes]
header = [['origdest']+routes.pop(0)[3:]]
for route in routes:
	key = str(route[1]).zfill(3) + str(route[2]).zfill(3)
	route = [key] + route[3:]
	header.append(route)
datafile = csv.writer(open('verytemp.csv','w'))
datafile.writerows(header)