import re,os,csv

breakdown = [re.sub('\r\n','',line) for line in open('../breakdown.csv')]
breakdown = [re.sub('\n','',line) for line in breakdown]
breakdown = [re.split(',',line) for line in breakdown]
breakdown = [[line[0],line[-1]] for line in breakdown]

datafile = csv.writer(open('../importantdates.csv','w'))
datafile.writerows(breakdown)