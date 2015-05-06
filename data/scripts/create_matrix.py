import csv, re, os, datetime
trips =  [re.split(',',line[:-2]) for line in open('../trips.min.csv','r')]
header = trips.pop(0)
stations = [re.split(',',line[:-2]) for line in open('../stations.csv')]
stations = {int(station[0]):station[1:] for station in stations[1:]}
hood = ['Allston','Kendall','Fenway/Kenmore','Cambridge','South Boston','South End','Central Square', 'Seaport', 'Downtown', 'Charlestown','Brookline','West End','Dudley Square','Beacon Hill','Back Bay','Harvard Square','Somerville','Porter Square', 'Medford']

Matrix = [[0 for x in range(len(hood))] for x in range(len(hood))]
WeekendMatrix = [[0 for x in range(len(hood))] for x in range(len(hood))]
WeekdayMatrix = [[0 for x in range(len(hood))] for x in range(len(hood))]
casualMatrix = [[0 for x in range(len(hood))] for x in range(len(hood))]
registeredMatrix = [[0 for x in range(len(hood))] for x in range(len(hood))]
for trip in trips:
	day = datetime.datetime.strptime(trip[2], "%m/%d/%Y %H:%M:%S").weekday()
	orig = stations[int(trip[3])][-1]
	dest = stations[int(trip[4])][-1]
	Matrix[hood.index(orig)][hood.index(dest)] += 1
	if ((day == 5) or (day ==6)):
		WeekendMatrix[hood.index(orig)][hood.index(dest)] += 1
	else:
		WeekdayMatrix[hood.index(orig)][hood.index(dest)] += 1
	if (trip[5] == 'R'):
		registeredMatrix[hood.index(orig)][hood.index(dest)] += 1
	else:
		casualMatrix[hood.index(orig)][hood.index(dest)] += 1

path = "../matrix.js"
os.remove(path)
datafile = open(path,'a')
datafile.write("_matrixData = ")
datafile.write(str(Matrix))
datafile.write(";\n")

datafile.write("_matrixWeekendData = ")
datafile.write(str(WeekendMatrix))
datafile.write(";\n")

datafile.write("_matrixWeekdayData = ")
datafile.write(str(WeekdayMatrix))
datafile.write(";\n")

datafile.write("_matrixRegisteredData = ")
datafile.write(str(registeredMatrix))
datafile.write(";\n")

datafile.write("_matrixCasualData = ")
datafile.write(str(casualMatrix))
datafile.write(";\n")
datafile.close()
