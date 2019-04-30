import xlrd
import csv
import json

source = xlrd.open_workbook('data/source/summary undercounts.xlsx')
lowSheet = source.sheet_by_name('low risk')
mediumSheet = source.sheet_by_name('medium risk')
highSheet = source.sheet_by_name('high risk')

lowFile = open('data/low.csv', 'w')
lowWriter = csv.writer(lowFile, quoting=csv.QUOTE_ALL)
for rownum in range(lowSheet.nrows):
	lowWriter.writerow(lowSheet.row_values(rownum))
lowFile.close()

mediumFile = open('data/medium.csv', 'w')
mediumWriter = csv.writer(mediumFile, quoting=csv.QUOTE_ALL)
for rownum in range(mediumSheet.nrows):
	mediumWriter.writerow(mediumSheet.row_values(rownum))
mediumFile.close()

highFile = open('data/high.csv', 'w')
highWriter = csv.writer(highFile, quoting=csv.QUOTE_ALL)
for rownum in range(highSheet.nrows):
	highWriter.writerow(highSheet.row_values(rownum))
highFile.close()


lowReader = csv.reader(open("data/low.csv", "rU"))
mediumReader = csv.reader(open("data/medium.csv", "rU"))
highReader = csv.reader(open("data/high.csv", "rU"))

data = {}
dataOut = []

lowJunk = lowReader.next()
mediumJunk = mediumReader.next()
highJunk = highReader.next()

lowHeader = lowReader.next()
mediumHeader = mediumReader.next()
highHeader = highReader.next()

for row in lowReader:
	if row[0] == "":
		break
	state = row[0]
	fips = "99" if (row[3] == "") else format(int(float(row[3])), "02")
	whitePop = round(float(row[4]),-2)
	blackPop = round(float(row[5]),-2)
	nativePop = round(float(row[6]),-2)
	asianPop = round(float(row[7]),-2)
	latinxPop = round(float(row[8]),-2)
	age0Pop = round(float(row[9]),-2)
	age5Pop = round(float(row[10]),-2)
	age18Pop = round(float(row[11]),-2)
	age30Pop = round(float(row[12]),-2)
	age50Pop = round(float(row[13]),-2)
	totalPop = round(float(row[14]),-2)

	whiteNumber = round(-float(row[15]),-2)
	blackNumber = round(-float(row[16]),-2)
	nativeNumber = round(-float(row[17]),-2)
	asianNumber = round(-float(row[18]),-2)
	latinxNumber = round(-float(row[19]),-2)
	age0Number = round(-float(row[20]),-2)
	age5Number = round(-float(row[21]),-2)
	age18Number = round(-float(row[22]),-2)
	age30Number = round(-float(row[23]),-2)
	age50Number = round(-float(row[24]),-2)
	totalNumber = round(-float(row[25]),-2)

	whitePercent = whiteNumber/whitePop
	blackPercent = blackNumber/blackPop
	nativePercent = nativeNumber/nativePop
	asianPercent = asianNumber/asianPop
	latinxPercent = latinxNumber/latinxPop
	age0Percent = age0Number/age0Pop
	age5Percent = age5Number/age5Pop
	age18Percent = age18Number/age18Pop
	age30Percent = age30Number/age30Pop
	age50Percent = age50Number/age50Pop
	totalPercent = totalNumber/totalPop

	data[state] = {"fips": fips, "whitePop": whitePop, "blackPop": blackPop, "nativePop": nativePop, "asianPop": asianPop, "latinxPop": latinxPop, "age0Pop": age0Pop, "age5Pop": age5Pop, "age18Pop": age18Pop, "age30Pop": age30Pop, "age50Pop": age50Pop, "totalPop": totalPop, "whiteNumberLow": whiteNumber, "blackNumberLow": blackNumber, "nativeNumberLow": nativeNumber, "asianNumberLow": asianNumber, "latinxNumberLow": latinxNumber, "age0NumberLow": age0Number, "age5NumberLow": age5Number, "age18NumberLow": age18Number, "age30NumberLow": age30Number, "age50NumberLow": age50Number, "totalNumberLow": totalNumber, "whitePercentLow": whitePercent, "blackPercentLow": blackPercent, "nativePercentLow": nativePercent, "asianPercentLow": asianPercent, "latinxPercentLow": latinxPercent, "age0PercentLow": age0Percent, "age5PercentLow": age5Percent, "age18PercentLow": age18Percent, "age30PercentLow": age30Percent, "age50PercentLow": age50Percent, "totalPercentLow": totalPercent}


for row in mediumReader:
	if row[0] == "":
		break
	state = row[0]

	whitePop = round(float(row[4]),-2)
	blackPop = round(float(row[5]),-2)
	nativePop = round(float(row[6]),-2)
	asianPop = round(float(row[7]),-2)
	latinxPop = round(float(row[8]),-2)
	age0Pop = round(float(row[9]),-2)
	age5Pop = round(float(row[10]),-2)
	age18Pop = round(float(row[11]),-2)
	age30Pop = round(float(row[12]),-2)
	age50Pop = round(float(row[13]),-2)
	totalPop = round(float(row[14]),-2)

	whiteNumber = round(-float(row[15]),-2)
	blackNumber = round(-float(row[16]),-2)
	nativeNumber = round(-float(row[17]),-2)
	asianNumber = round(-float(row[18]),-2)
	latinxNumber = round(-float(row[19]),-2)
	age0Number = round(-float(row[20]),-2)
	age5Number = round(-float(row[21]),-2)
	age18Number = round(-float(row[22]),-2)
	age30Number = round(-float(row[23]),-2)
	age50Number = round(-float(row[24]),-2)
	totalNumber = round(-float(row[25]),-2)

	whitePercent = whiteNumber/whitePop
	blackPercent = blackNumber/blackPop
	nativePercent = nativeNumber/nativePop
	asianPercent = asianNumber/asianPop
	latinxPercent = latinxNumber/latinxPop
	age0Percent = age0Number/age0Pop
	age5Percent = age5Number/age5Pop
	age18Percent = age18Number/age18Pop
	age30Percent = age30Number/age30Pop
	age50Percent = age50Number/age50Pop
	totalPercent = totalNumber/totalPop

	data[state]["whiteNumberMedium"] = whiteNumber
	data[state]["blackNumberMedium"] = blackNumber
	data[state]["nativeNumberMedium"] = nativeNumber
	data[state]["asianNumberMedium"] = asianNumber
	data[state]["latinxNumberMedium"] = latinxNumber
	data[state]["age0NumberMedium"] = age0Number
	data[state]["age5NumberMedium"] = age5Number
	data[state]["age18NumberMedium"] = age18Number
	data[state]["age30NumberMedium"] = age30Number
	data[state]["age50NumberMedium"] = age50Number
	data[state]["totalNumberMedium"] = totalNumber
	data[state]["whitePercentMedium"] = whitePercent
	data[state]["blackPercentMedium"] = blackPercent
	data[state]["nativePercentMedium"] = nativePercent
	data[state]["asianPercentMedium"] = asianPercent
	data[state]["latinxPercentMedium"] = latinxPercent
	data[state]["age0PercentMedium"] = age0Percent
	data[state]["age5PercentMedium"] = age5Percent
	data[state]["age18PercentMedium"] = age18Percent
	data[state]["age30PercentMedium"] = age30Percent
	data[state]["age50PercentMedium"] = age50Percent
	data[state]["totalPercentMedium"] = totalPercent

for row in highReader:
	if row[0] == "":
		break
	state = row[0]

	whitePop = round(float(row[4]),-2)
	blackPop = round(float(row[5]),-2)
	nativePop = round(float(row[6]),-2)
	asianPop = round(float(row[7]),-2)
	latinxPop = round(float(row[8]),-2)
	age0Pop = round(float(row[9]),-2)
	age5Pop = round(float(row[10]),-2)
	age18Pop = round(float(row[11]),-2)
	age30Pop = round(float(row[12]),-2)
	age50Pop = round(float(row[13]),-2)
	totalPop = round(float(row[14]),-2)

	whiteNumber = round(-float(row[15]),-2)
	blackNumber = round(-float(row[16]),-2)
	nativeNumber = round(-float(row[17]),-2)
	asianNumber = round(-float(row[18]),-2)
	latinxNumber = round(-float(row[19]),-2)
	age0Number = round(-float(row[20]),-2)
	age5Number = round(-float(row[21]),-2)
	age18Number = round(-float(row[22]),-2)
	age30Number = round(-float(row[23]),-2)
	age50Number = round(-float(row[24]),-2)
	totalNumber = round(-float(row[25]),-2)

	whitePercent = whiteNumber/whitePop
	blackPercent = blackNumber/blackPop
	nativePercent = nativeNumber/nativePop
	asianPercent = asianNumber/asianPop
	latinxPercent = latinxNumber/latinxPop
	age0Percent = age0Number/age0Pop
	age5Percent = age5Number/age5Pop
	age18Percent = age18Number/age18Pop
	age30Percent = age30Number/age30Pop
	age50Percent = age50Number/age50Pop
	totalPercent = totalNumber/totalPop
	
	data[state]["whiteNumberHigh"] = whiteNumber
	data[state]["blackNumberHigh"] = blackNumber
	data[state]["nativeNumberHigh"] = nativeNumber
	data[state]["asianNumberHigh"] = asianNumber
	data[state]["latinxNumberHigh"] = latinxNumber
	data[state]["age0NumberHigh"] = age0Number
	data[state]["age5NumberHigh"] = age5Number
	data[state]["age18NumberHigh"] = age18Number
	data[state]["age30NumberHigh"] = age30Number
	data[state]["age50NumberHigh"] = age50Number
	data[state]["totalNumberHigh"] = totalNumber
	data[state]["whitePercentHigh"] = whitePercent
	data[state]["blackPercentHigh"] = blackPercent
	data[state]["nativePercentHigh"] = nativePercent
	data[state]["asianPercentHigh"] = asianPercent
	data[state]["latinxPercentHigh"] = latinxPercent
	data[state]["age0PercentHigh"] = age0Percent
	data[state]["age5PercentHigh"] = age5Percent
	data[state]["age18PercentHigh"] = age18Percent
	data[state]["age30PercentHigh"] = age30Percent
	data[state]["age50PercentHigh"] = age50Percent
	data[state]["totalPercentHigh"] = totalPercent


for state in data:
	obj = data[state]
	obj["state"] = state
	dataOut.append(obj)
	


#write a pretty printed json for human readability
with open('data/pretty.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, indent=4, separators=(',', ': '))


#write a one line json for consumption in JS
with open('data/data.json', 'wt') as out:
    res = json.dump(dataOut, out, sort_keys=True, separators=(',', ':'))



