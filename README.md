# LinkApi-challenge - Pipedrive + Bling

##Objective

Building an API RESTful using NodoJS and MongoDB

##Requirements

* Creating test accounts on Pipedrive and Blig platform
* Creating integration beetween Pipedrive and Bling platform
    *   OBS: The integration must find dial with won status, after inserting them on Bling as order. 
* Creating on mongoDB one collection and then aggregating bling deals by day and total value
* Creating an endpoint to give the consolidated dada on MongoDB

##Technical Requirements

* [yarn](https://classic.yarnpkg.com/en/docs/install/#debian-stable) or [npm](https://www.npmjs.com/get-npm) 
* [Docker-compose](https://docs.docker.com/compose/install/)

##Running
The project considers yarn as package manager.
For download project dependencies and execute the NodeJS server use: 
```
   $ yarn && yarn dev
```
NOTE: Don't forget to set .env requirements. the file .emv.example there are all them


## Routes

####List orders

This route list all the orders aggregated by day and total value, storage in MongoDB

Method GET
    
```
/v1/orders
```

**Example**

Request
```
curl -vL 'http://localhost:3333/v1/orders'
```

Response

```json
[
    {
        "_id" : "5fc8f280688f9ee0170b84c0",
        "__v" : 0,
        "createdAt" : "2020-12-03T14:13:20.740Z",
        "updatedAt" : "2020-12-03T14:21:40.113Z",
        "orderDate": "2020-12-03T14:12:40.113Z",
        "total" : 40
    }
]
```
NOTE: The Responses it's using [JSend](https://github.com/omniti-labs/jsend) especification

####Save orders

This route will get all the deals with won status on the Pipedrive, create an order on Bling and save the orders aggregated by day and total value, storage in MongoDB

Method POST
    
```
/v1/orders/sync
```

**Example**

Request
```
curl -vL - X POST 'http://localhost:3333/v1/orders/sync'
```

Response

```json
[
    {
      "code":10416195612,
      "number":"93",
      "volumes":[],
      "value":10,
      "organization":"FakeOrganization",
      "orderDate":"2020-12-02T02:31:20.000Z"
    }
]
```
NOTE: The Responses it's using [JSend](https://github.com/omniti-labs/jsend) especification
