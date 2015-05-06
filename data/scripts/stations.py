import re,os,csv
import datetime
trips = [re.sub('\r\n','',line) for line in open('../trips.min.csv')]
trips = [re.split(',',line) for line in trips[1:]]
stations = open('../stations.csv').readlines()
stations = re.split("\r",stations[0]) 
stations = [re.split(',',line) for line in stations[1:]]


p = 0.001592356688          # 1/628
pDay = 0.002229299363		 # 1/((5/7)*628)
pEnd = 0.005573248408		 # 1/((2/7)*628)


routes = dict()
for station in stations:
	routes[station[0]] = dict()
	for ea in stations:
		routes[station[0]][ea[0]] = 0
overall = dict()
weekday = dict()
weekend = dict()
stats = dict()


for station in stations:
	overall[str(station[0])] = { 'average':{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0}, 'hourly': []}
	weekend[str(station[0])] = { 'average':{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0}, 'hourly': []}
	weekday[str(station[0])] = { 'average':{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0}, 'hourly': []}
	overall[str(station[0])]['hourly'] = [{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0} for x in range(24)]
	weekend[str(station[0])]['hourly'] = [{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0} for x in range(24)]
	weekday[str(station[0])]['hourly'] = [{"t":0.0,"a":0.0,"d":0.0,"f":0.0,"c":0.0,"r":0.0} for x in range(24)]

for trip in trips:
	routes[str(trip[3])][str(trip[4])] += 1
	ddate = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S")
	delta = int(trip[1]) * 60
	adate = datetime.timedelta(0,delta) + ddate
	dhour = ddate.hour
	ahour = adate.hour
	aday = adate.weekday()
	a = str(trip[4])
	d = str(trip[3])
	overall[a]['average']["t"] += p
	overall[a]['average']["a"] += p
	overall[a]['hourly'][ahour]['t'] += p
	overall[a]['hourly'][ahour]['a'] += p
	overall[d]['average']['t'] += p
	overall[d]['average']['d'] += p
	overall[d]['hourly'][dhour]['t'] += p
	overall[d]['hourly'][dhour]['d'] += p
	if (trip[5] =='R'):
		overall[a]['average']['r'] += p
		overall[a]['hourly'][ahour]['r'] += p
		overall[d]['average']['r'] += p
		overall[d]['hourly'][dhour]['r'] += p
		if (trip[8] =="F"):
			overall[a]['average']['f'] += p
			overall[a]['hourly'][ahour]['f'] += p
			overall[d]['average']['f'] += p
			overall[d]['hourly'][dhour]['f'] += p
	if (trip[-2] =="M"):
		overall[a]['average']['c'] += p
		overall[a]['hourly'][ahour]['c'] += p
		overall[d]['average']['c'] += p
		overall[d]['hourly'][dhour]['c'] += p
	if ((aday == 5) or (aday == 6)):
		weekend[a]['average']['t'] += pEnd
		weekend[a]['average']['a'] += pEnd
		weekend[a]['hourly'][ahour]['t'] += pEnd
		weekend[a]['hourly'][ahour]['a'] += pEnd
		weekend[d]['average']['t'] += pEnd
		weekend[d]['average']['d'] += pEnd
		weekend[d]['hourly'][dhour]['t'] += pEnd
		weekend[d]['hourly'][dhour]['d'] += pEnd
		if (trip[5] =='R'):
			weekend[a]['average']['r'] += pEnd
			weekend[a]['hourly'][ahour]['r'] += pEnd
			weekend[d]['average']['r'] += pEnd
			weekend[d]['hourly'][dhour]['r'] += pEnd
			if (trip[8] =="F"):
				weekend[a]['average']['f'] += pEnd
				weekend[a]['hourly'][ahour]['f'] += pEnd
				weekend[d]['average']['f'] += pEnd
				weekend[d]['hourly'][dhour]['f'] += pEnd
		if (trip[-2] =="M"):
			weekend[a]['average']['c'] += pEnd
			weekend[a]['hourly'][ahour]['c'] += pEnd
			weekend[d]['average']['c'] += pEnd
			weekend[d]['hourly'][dhour]['c'] += pEnd
	else:
		weekday[a]['average']['t'] += pDay
		weekday[a]['average']['a'] += pDay
		weekday[a]['hourly'][ahour]['t'] += pDay
		weekday[a]['hourly'][ahour]['a'] += pDay
		weekday[d]['average']['t'] += pDay
		weekday[d]['average']['d'] += pDay
		weekday[d]['hourly'][dhour]['t'] += pDay
		weekday[d]['hourly'][dhour]['d'] += pDay
		if (trip[5] =='R'):
			weekday[a]['average']['r'] += pDay
			weekday[a]['hourly'][ahour]['r'] += pDay
			weekday[d]['average']['r'] += pDay
			weekday[d]['hourly'][dhour]['r'] += pDay
			if (trip[8] =="F"):
				weekday[a]['average']['f'] += pDay
				weekday[a]['hourly'][ahour]['f'] += pDay
				weekday[d]['average']['f'] += pDay
				weekday[d]['hourly'][dhour]['f'] += pDay
		if (trip[-2] =="M"):
			weekday[a]['average']['c'] += pDay
			weekday[a]['hourly'][ahour]['c'] += pDay
			weekday[d]['average']['c'] += pDay
			weekday[d]['hourly'][dhour]['c'] += pDay

for station in stations:
	weekday[str(station[0])] = str(re.sub("'",'"',str(weekday[str(station[0])])))
	weekend[str(station[0])] = str(re.sub("'",'"',str(weekend[str(station[0])])))
	overall[str(station[0])] = str(re.sub("'",'"',str(overall[str(station[0])])))
	routes[str(station[0])] = str(re.sub("'",'"',str(routes[str(station[0])])))


path ="../stations.json"
os.remove(path)
f = open(path,"a")
f.write('[')
for station in stations:
	f.write('{"id":'+station[0]+',\n')
	f.write('"fullname":"'+station[1]+'",\n')
	f.write('"short":"'+station[2]+'",\n')
	f.write('"loc":['+station[3]+','+station[4]+'],\n')
	f.write('"hood":"'+station[5]+'",\n')
	f.write('"overall":'+overall[str(station[0])] +  ',\n')
	f.write('"weekend":'+weekend[str(station[0])] +  ',\n')
	f.write('"weekday":'+weekday[str(station[0])] +  ',\n')
	f.write('"routes":'+routes[str(station[0])]+'\n },\n')
f.write("]")
f.close()

path ="../stations_keyed.json"
os.remove(path)
f = open(path,"a")
f.write('{')
for station in stations:
	f.write('"'+station[0]+'": {\n')
	f.write('"fullname":"'+station[1]+'",\n')
	f.write('"short":"'+station[2]+'",\n')
	f.write('"loc":['+station[3]+','+station[4]+'],\n')
	f.write('"hood":"'+station[5]+'",\n')
	f.write('"overall":'+overall[str(station[0])] +  ',\n')
	f.write('"weekend":'+weekend[str(station[0])] +  ',\n')
	f.write('"weekday":'+weekday[str(station[0])] +  ',\n')
	f.write('"routes":'+routes[str(station[0])]+'\n },\n')
f.write("}")
f.close()
