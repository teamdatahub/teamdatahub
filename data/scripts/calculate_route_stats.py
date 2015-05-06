import csv,re,os

mtomi = 0.000621371
stohr = 3600

routes = [re.sub('\r\n','',route) for route in open('../routes_raw.csv')]
routes = [re.split(',',route) for route in routes]
os.remove("../routes_stats.csv")
f = csv.writer(open("../routes_stats.csv",'a'))
f.writerow(['ID','orig','dest','dist','time','speed'])

for route in routes[1:]:
	hr = float(route[-2]) / stohr
	min = float(route[-2]) / 60
	mi = float(route[-1]) * mtomi
	spd = mi/hr
	mi = float("{0:.2f}".format(mi))
	min = float("{0:.1f}".format(min))
	spd = float("{0:.1f}".format(spd))
	row = route[:3] + [mi,min,spd]
	f.writerow(row)