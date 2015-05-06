import csv,re,os,datetime

#days = {line[:-2]:{"days":0,"t":0,"f":0,"r":0,"l":0,'dist':0,'time':0} for line in open('../daysofyear.csv')}
trips = [re.split(',',trip[:-2]) for trip in open('../trips.min.csv')]
dates = [re.split(',',line[:-2])[0] for line in open('../breakdown.csv')]
dates = {line:[0 for x in range(81)] for line in dates[1:]}
#days = {line[:-2]:[0 for i in range(81)] for line in open('../daysofyear.csv')}

#for each in breakdown[1:]:
#	days[each[:-5]]['days'] +=1
#
#for trip in trips[1:]:
#	date = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S")
#	day = str(date.month)+'/'+str(date.day)
#	days[day]["t"] += 1
#	days[day]['time'] += int(trip[1])
#	days[day]['dist'] += float(trip[-1])
#	if (trip[5] =='R'):
#		days[day]['r'] += 1
#		try:
#			if (int(trip[7]) > max):
#				max = int(trip[7])
#			if (int(trip[7]) < min):
#				min = int(trip[7])
#		except:
#			pass
#		if (trip[8] =='F'):
#			days[day]['f'] += 1
#	if (trip[-2] =='L'):
#		days[day]['l'] +=1
#
#header = [['day','days','total','female','reg','leisure','dist','time']]
#
#for day in days:
#	days[day]['dist'] = float("%.2f" % days[day]['dist'])
#	row = [day,days[day]['days'],days[day]['t'],days[day]['f'],days[day]['r'],days[day]['l'],days[day]['dist'],days[day]['time']]
#	header.append(row)
#
#datafile = csv.writer(open('yeardata.csv','w'))
#datafile.writerows(header)

for trip in trips[1:]:
	date = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S")
	date = str(date.month)+'/'+str(date.day) + '/' +str(date.year)
	if (trip[5] =='R'):
		print date, trip[7]
		try:
			dates[date][int(trip[7])] += 1
		except:
			pass
header = [['date']+range(81)]

#for day in dates:
#	row = [day]+dates[day]
#	header.append(row)
#
#datafile = csv.writer(open('ages.csv','w'))
#datafile.writerows(header)