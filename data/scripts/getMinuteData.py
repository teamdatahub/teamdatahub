import csv,re,os,datetime

times = {line[:-2]:{"t":0,"f":0,"r":0,"l":0,'dist':0,'time':0} for line in open('../timeofday.csv')}
timesEnd = {line[:-2]:{"t":0,"f":0,"r":0,"l":0,'dist':0,'time':0} for line in open('../timeofday.csv')}
timesDay = {line[:-2]:{"t":0,"f":0,"r":0,"l":0,'dist':0,'time':0} for line in open('../timeofday.csv')}

trips = [re.split(',',trip[:-2]) for trip in open('../trips.min.csv')]
def quarterHour(m):
	if (m < 15):
		return '00'
	if (m < 30):
		return '15'
	if (m < 45):
		return '30'
	else:
		return '45'

for trip in trips[1:]:
	date = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S")
	t = str(date.hour) + ":" + quarterHour(date.minute)
	times[t]["t"] += 1
	times[t]['time'] += int(trip[1])
	times[t]['dist'] += float(trip[-1])
	if (trip[5] =='R'):
		times[t]['r'] += 1
		if (trip[8] =='F'):
			times[t]['f'] += 1
	if (trip[-2] =='L'):
		times[t]['l'] +=1
	if ((date.weekday() == 6) or (date.weekday() == 6)):
		timesEnd[t]["t"] += 1
		timesEnd[t]['time'] += int(trip[1])
		timesEnd[t]['dist'] += float(trip[-1])
		if (trip[5] =='R'):
			timesEnd[t]['r'] += 1
			if (trip[8] =='F'):
				timesEnd[t]['f'] += 1
		if (trip[-2] =='L'):
			timesEnd[t]['l'] +=1
	else:
		timesDay[t]["t"] += 1
		timesDay[t]['time'] += int(trip[1])
		timesDay[t]['dist'] += float(trip[-1])
		if (trip[5] =='R'):
			timesDay[t]['r'] += 1
			if (trip[8] =='F'):
				timesDay[t]['f'] += 1
		if (trip[-2] =='L'):
			timesDay[t]['l'] +=1
		

header = [['time','total','female','reg','leisure','dist','time']]
headerDay = [['time','total','female','reg','leisure','dist','time']]
headerEnd = [['time','total','female','reg','leisure','dist','time']]

for t in times:
	times[t]['dist'] = float("%.2f" % times[t]['dist'])
	timesEnd[t]['dist'] = float("%.2f" % timesEnd[t]['dist'])
	timesDay[t]['dist'] = float("%.2f" % timesDay[t]['dist'])
	row = [t,times[t]['t'],times[t]['f'],times[t]['r'],times[t]['l'],times[t]['dist'],times[t]['time']]
	rowEnd = [t,timesEnd[t]['t'],timesEnd[t]['f'],timesEnd[t]['r'],timesEnd[t]['l'],timesEnd[t]['dist'],timesEnd[t]['time']]
	rowDay = [t,timesDay[t]['t'],timesDay[t]['f'],timesDay[t]['r'],timesDay[t]['l'],timesDay[t]['dist'],timesDay[t]['time']]
	header.append(row)
	headerEnd.append(rowEnd)
	headerDay.append(rowDay)

datafile = csv.writer(open('../timeofdaydata.csv','w'))
datafile.writerows(header)

datafile = csv.writer(open('../timeofdaydata_weekend.csv','w'))
datafile.writerows(headerEnd)

datafile = csv.writer(open('../timeofdaydata_weekday.csv','w'))
datafile.writerows(headerDay)
