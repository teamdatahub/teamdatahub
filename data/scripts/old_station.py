import re,os,csv
import datetime
trips = [re.sub('\r\n','',line) for line in open('../trips.min.csv')]
trips = [re.split(',',line) for line in trips[1:]]

weekday = 0.002229299363
weekend = 0.005573248408
dayaverage = weekday/24
endaverage = weekend/24


stations = [re.split(',',station[:-2]) for station in open('../stations.csv').readlines()[1:]]


routes = dict()
for station in stations:
	routes[station[0]] = dict()
	for ea in stations:
		routes[station[0]][ea[0]] = 0
temp = dict()
final = dict()
for station in stations:
	temp[str(station[0])] = { 'average':{"a":0.0,"d":0.0}, 'weekend': [],'weekday':[]}
	temp[str(station[0])]['weekend'] = [{"a":0.0,"d":0.0} for x in range(24)]
	temp[str(station[0])]['weekday'] = [{"a":0.0,"d":0.0} for x in range(24)]
for trip in trips:
	routes[str(trip[3])][str(trip[4])] += 1
	ddate = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S")
	delta = int(trip[1]) * 60
	adate = datetime.timedelta(0,delta) + ddate
	dhour = ddate.hour
	dday = ddate.weekday()
	ahour = adate.hour
	aday = adate.weekday()
	a = trip[4]
	d = trip[3]
	if ((aday == 5) or (aday == 6)):
		temp[a]['weekend'][ahour]['a'] += weekend
		temp[a]['average']['a'] += endaverage
	else:
		temp[a]['weekday'][ahour]['a'] += weekday
		temp[a]['average']['a'] += dayaverage
	if ((dday == 5) or (dday == 6)):
		temp[d]['weekend'][dhour]['d'] += weekend
		temp[d]['average']['d'] += endaverage
	else:
		temp[d]['weekday'][dhour]['d'] += weekday
		temp[d]['average']['d'] += dayaverage
strtemp = dict()
for station in stations:
	strtemp[str(station[0])] = str(re.sub("'",'"',str(temp[str(station[0])])))
	routes[str(station[0])] = str(re.sub("'",'"',str(routes[str(station[0])])))

lines = [re.sub("\r\n","",line) for line in open("../stations.csv")]
lines = [re.split(",",line) for line in lines[1:]]
path ="../stations_keyed.json"
os.remove(path)
f = open(path,"a")
f.write('{')
for station in stations:
	f.write('"'+station[0]+'":{\n')
	f.write('"fullname":"'+station[1]+'",\n')
	f.write('"short":"'+station[2]+'",\n')
	f.write('"loc":['+station[3]+','+station[4]+'],\n')
	f.write('"hood":"'+station[5]+'",\n')
	f.write('"hourly":'+strtemp[str(station[0])] +  ',\n')
	f.write('"routes":'+routes[str(station[0])]+'\n },\n')
f.write("}")
f.close()		
