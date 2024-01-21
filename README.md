# CyberVolunteers.org.uk version 2
This is the second version of the code and the web pages for the [CyberVolunteers](http://cybervolunteers.org.uk/) website. Unfortunately, the project has been shut down because the people involved in it got more busy.

The website was aimed at connecting lesser-known charities with enthusiastic volunteers.

## The technologies used
- Next.js with React
- Node.js
- MongoDB
- TypeScript
- Docker
- JQuery
- MySql

## Attribution of work
We hired a person to write most of the CSS, HTML and JS for the website. However, we did not give them access to this repository (which was kept private while the website was up). 
That means that their work is attributed to me in the commit history. 
A more clear attribution of work would be complicated, as I heavily modified most of the pages to use React instead of plain JavaScript and HTML to make the code easier to read and debug.
I was responsible for all of the back-end and a lot of interactivity of the front-end.

## The folder structure
The `docker` folder contains the files required for docker and docker-compose.
The `next` folder contains the frontend and backend, with the subfolders having meaning as described in the [Next.js docs](https://nextjs.org/docs/getting-started/project-structure).
  The `serverAndClient` and `server` subfolders contain code that is used by both server and client, and just server, respectively.
