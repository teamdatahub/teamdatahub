import csv
import re
import os
trips =  open('../trips.min.csv','r').readlines()
trips = [re.split(",",trip[:-2]) for trip in trips]

headCasual=['ID','duration', 'start_date', 'strt_statn', 'end_statn','type','distance']
headRegistered = ['ID','duration', 'start_date', 'strt_statn', 'end_statn', 'zip_code', 'age', 'gender','type','distance']
headGender = ['ID','duration', 'start_date', 'strt_statn', 'end_statn', 'zip_code', 'age','type','distance']

pathCasual = '../trips_casual.csv'
pathReg = "../trips_registered.csv"
pathMale = "../trips_male.csv"
pathFemale = "../trips_female.csv"
os.remove(pathCasual)
os.remove(pathReg)
os.remove(pathMale)
os.remove(pathFemale)

casual =  csv.writer(open(pathCasual,'a'))
reg =  csv.writer(open(pathReg,'a'))
male = csv.writer(open(pathMale,'a'))
female = csv.writer(open(pathFemale,'a'))

casual.writerow(headCasual)
reg.writerow(headRegistered)
male.writerow(headGender)
female.writerow(headGender)
for trip in trips[1:]:
	if trip[5] =='R':
		trip.remove('R')
		reg.writerow(trip)
		if trip.pop(-3) == 'M':
			male.writerow(trip)
		else:
			female.writerow(trip)
	else:
		casual.writerow(trip[:5] + trip[-2:])