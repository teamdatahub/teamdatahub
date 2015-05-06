Structure of the stations.json file

[
  {
    "id": 25,
    "fullname": "Tremont St \/ W Newton St",
    "short": "Tremont St \/ W Newton St",
    "loc": [
      42.341332,
      -71.076847
    ],
    "hood": "South End",
    "overall": {
      "hourly": [				index in hourly corresponds
      	{						to hour of day
          "a": 0.329617834416,  arriving (trips/hour)
          "c": 0.100318471344,  commuting (trips/hour)
          "d": 0.184713375808,	departing (trips/hour)
          "f": 0.05573248408,	females (riders/hour)
          "r": 0.351910828048,	registered (riders/hour)
          "t": 0.514331210224	total (trips/hour)
        },
        .... 
      ],
      "average": {				daily average
        "a": 27.391719746981,	arriving (trips/day)
        "c": 9.5923566885117,	commuting (trips/day)
        "d": 30.58598726311,	departing (trips/day)
        "f": 15.380573249393,	female (trips/day)
        "r": 47.893312104988,	registered (trips/day)
        "t": 57.977707010095	total (trips/day)
      }
    },
    "weekend": {				same structure for weekend
      "hourly": [...],
      "average": {...}
    },
    "weekday": {
      "hourly": [...],
      "average": {...}
    },
    "routes": {					total number of trips taken
      "133": 1,					from station to a station in
      "132": 3,					this list
      "131": 5,
      "130": 4,
      "137": 2,
      "136": 9,
      "135": 1,
      ...
    }
  },