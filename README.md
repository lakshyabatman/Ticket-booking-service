# Ticket Booking Service

This application is part of hiring assignment by Zomentum.

## Task
To create a REST application for movie ticket bookings.
### User side Requirements
- As a user, I can book ticket for a movie at a given time slot if available.
- As a user, I can update booking timings if possible.
- As a user, I can fetch user details via ticket id.
- As a user, I can delete ticket if possible.
- As a user, I can retrieve all tickets at a given time.

### Application side requirements

- For a given slot for a movie upto 20 people can book tickets.
- Tickets should be set expired after 8 hours of booking time.


## Selected tech stack
 - Backend Service : NodeJS
 - Caching : Redis
 - Database: MongoDB

## Installation
- Make sure you have docker installed on your machine.
- Run `docker-compose up ` from root directory of application to start up redis server. (Please: Don't close this terminal instance).
- Open another terminal.
- To start server, write on your terminal `npm start` or `npm run dev`.
- This will run server on post `3000`.

## Database design
### User
| Email | Phone Number  |  User_id |
|--|--|--|
| String| String; Max-Length:10  |Primary key |

### Movie

| Movie Name | Movie ID |
|--|--|
| String | Primary Key |


### Movie Schedule

| Time Slot Id | Movie ID | Start Time | End Time | Tickets booked |
|--|--|--|--|--|
| Primary key | Ref To Movie | Date or Number| Date or Number | Number |


### Ticket

| Ticket ID | User Id | Movie Schedule| 
|--|--|--|
| Primary key | Ref to User | Ref to Movie Schedule| 



