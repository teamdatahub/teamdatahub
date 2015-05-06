import re, os, csv, datetime

trips = [re.split(',',line[:-2]) for line in open('../trips_mayor.csv')]
header = trips.pop(0)
allData =[]
for trip in trips:
	trip = trip[:5] + [trip[-2]]
	if ((trip[2] != '') and (trip[3] != '')):
		startDate = datetime.datetime.strptime(trip[1], "%m/%d/%Y %H:%M:%S")
		delta = int(trip[0]) * 60
		endDate = datetime.timedelta(0,delta) + startDate
		orig = int(trip[2])
		dest = int(trip[3])
		allData.append([int(trip[0]),startDate,endDate,orig,dest,trip[-2],trip[-1],'trip'])
		allData.append([None,endDate,None,dest,None,'wait'])
trips = allData[:-1]
allData = []
for i in range(len(trips)):
	temp =range(8)
	if (trips[i][0] == None):
		temp[1] = trips[i][1]
		temp[2] = trips[i+1][1]
		temp[0] = int((temp[2] - temp[1]).total_seconds() / 60)
		temp[3] = trips[i][3]
		temp[4] = trips[i+1][3]
		temp[5] = ''
		temp[6] = ''
		temp[7] = 'wait'
		allData.append(temp)
	else:
		temp = trips[i]
		allData.append(temp)
trips = allData
allData = [[trip[0],trip[1].strftime("%m/%d/%Y %H:%M:%S"), trip[2].strftime("%m/%d/%Y %H:%M:%S")] + trip[3:] for trip in trips]
header = ['duration','start','end','strt_statn','end_statn','userType','gender','tripType']
datafile = csv.writer(open("mayorsbike.csv",'w'))
datafile.writerow(header)
datafile.writerows(allData)