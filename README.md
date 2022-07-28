# Installation (for newbies, windows)
1. create github account
2. download git bash
3. download [postgresql](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) latest version is fine
4. download [pgadmin](https://www.pgadmin.org/download/pgadmin-4-windows/) latest version is fine
5. you'll probably need to restart, do so now.
6. open pgadmin4, create a master password. go to the browser 
7. open git bash, navigate to a directory you want to install, run this command `git clone https://github.com/jmankhan/Scrimr.git` You can also use ssh but you have to configure a few things on your github account. i'd recommend doing that if you have time. if so, use this command `git@github.com:jmankhan/Scrimr.git`
8. check if you have node by running `node --version` in git bash. if not, download from here: https://nodejs.org/dist/v14.17.0/ x64.msi is what most people need
9. check if you have npm `npm --version`. if you have node, you should have npm
10. rest of steps assume you are in git bash and are at the root folder. if you type `ls` you should see this README.md file in your output
11. run `cd client && npm install` . you can check that it worked by then running `npm start`. a browser tab should open with the scrimr UI.
12. run `cd ../server && npm install`. 
13. run `npm install --global nodemon`
14. run `npx prisma migrate dev`. you can check this worked by looking at pgadmin > postgresql13 > scrimr > schemas > tables. you should see a bunch of tables like "User", "Summoner", etc
15. finally, you'll need to create a file called .env (don't use notepad to do this, make sure it doesn't end in a .txt extension). You'll need to create a bunch of secret tokens and passwords. 

| Key                 | Value                                                                                                          |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| PG_URL              | [connection string](https://stackoverflow.com/a/52718093/7537946)                                              |
| ACCESS_TOKEN_SECRET | generate jwt token. in git bash, type `node`, then run this command `crypto.randomBytes(64).toString("hex");`. |
| RIOT_API_KEY        | contact me                                                                                                     |
| PORT                | 3001                                                                                                           |
| WHITELISTED_DOMAINS | <http://localhost:3001/,http://localhost:3000>                                                                 |
| EMAIL_FROM          | noreply.scrimr@gmail.com                                                                                       |
| SENDGRID_KEY        | contact me                                                                                                     |
| DOMAIN              | scrimr.herokuapp.com                                                                                           |
| NODE_ENV            | dev                                                                                                            |

16. you can now run a local instance of scrimr. although you can do it with just one terminal window, i recommend you open two. navigate to the server subfolder and type `npm run dev` in the first git bash window. then navigate to the client subfolder and type `npm start` in the second git bash window.