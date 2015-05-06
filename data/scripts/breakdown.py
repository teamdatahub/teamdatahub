import re,os,csv
def isLocal(s):
	n = s[1:]
	if ((n == '') or ((int(s[1:]) > 2017) and (int(s[1:]) < 2792))):
		return "local"
	else:
		return "visit"
trips = [re.split(',',line[:-2]) for line in open('../trips.min.csv')]

trips = trips[1:]
dates = [re.split(' ',trip[2])[0] for trip in trips[1:]]
dates = list(set(dates))
dates = {date:{"total":0,"reg":0,"fem":0,"lei":0,"local":0,'visit':0} for date in dates}
for trip in trips:
	d = re.split(" ",trip[2])[0]
	dates[d]["total"] +=1
	if (trip[5] == "R"):
		dates[d]["reg"] += 1
		dates[d][isLocal(trip[6])] += 1
		if (trip[8] == "F"):
			dates[d]['fem'] +=1
	if (trip[-2] == 'L'):
		dates[d]['lei'] +=1

weather = [re.split(',', line[:-2]) for line in open("../weather.csv")]
hw = weather.pop(0)[3:]
imp = [re.split(',', line[:-2]) for line in open('../importantdates.csv')]
imp = {line[0]:line[1:] for line in imp[1:]}
header = ['date','total','females','registered','leisure','locals'] + hw + ['notes']
header = [header]
for w in weather:
	date = w[0]
	try:
		t = dates[date]
		row = [date, t['total'], t['fem'], t['reg'], t['lei'], t['local']] + w[1:] + imp[date] 
		header.append(row)
	except:
		row = [date, 0,0,0,0,0] + w + imp[date] 
		header.append(row)
datafile = csv.writer(open('../breakdown.csv','w'))
datafile.writerows(header)