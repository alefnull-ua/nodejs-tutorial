Start with 
`PORT=3000 node app.js`

    Running env: development
    Calendar listening at http://localhost:3000


curl -s localhost:3000/events | jq

[
  {
    "id": "1",
    "title": "1to1",
    "location": "zoom",
    "date": "2020-01-01",
    "hour": "12",
    "etc": "etc1"
  },
  {
    "id": "2",
    "title": "signActs",
    "location": "Lviv",
    "date": "2020-01-02",
    "hour": "12",
    "etc": "etc1"
  },
  {
    "id": "3",
    "title": "repairMac",
    "location": "Odesa",
    "date": "2020-01-03",
    "hour": "12",
    "etc": "etc1"
  },
  {
    "id": "5",
    "title": "teamBuild",
    "location": "zoom",
    "date": "2020-01-04",
    "hour": "12",
    "etc": "etc1"
  },
  {
    "id": "8",
    "title": "1to1",
    "location": "zoom",
    "date": "2020-01-05",
    "hour": "12",
    "etc": "etc1"
  }
]

Replace entry with
curl -i localhost:3000/events/2 -H "Content-Type: application/json" -X PUT -d '{"title": "qwer", "location":"Avalon"}'

Delete entry with
curl -i -s localhost:3000/events/2 -X DELETE

Add entry with
curl -i localhost:3000/events -H "Content-Type: application/json" -X POST -d '{"id": 42, "title": "qwer", "location":"Avalon"}'

Get event by id
curl -s localhost:3000/events/2

Get events batch with
curl -s localhost:3000/events-batch