# Application-of-blockchain-on-housing-titles
Storing land titles into Hyperledger Fabric Network to ensure easy storing and verification.

<h2> Hyperledger Fabric Framework </h2>
1. Configure WSL and Ubuntu for development of Hyperledger Fabric. <br />
2. Creating blockchain peers, orderers (with certificate and private key) and genesis block. <br />
3. Start the blockchain network with Docker.

![image](https://user-images.githubusercontent.com/98612606/192152174-a2422747-9526-4106-a834-cbaa83c0b482.png)
<br /><br />
4. Creating channel (communication medium between peers and with client side) with shell script. <br />
5. Writing chaincode (smart contract) written in Golang. <br />
6. Deploying chaicode (smart contract) in the channel with shell script.


<h2> Node.js </h2>

![image](https://user-images.githubusercontent.com/98612606/192154658-87b7a79a-798a-49fe-b377-9831d5680732.png)
<br />

Node.js is used as server to communicate with Hyperledger Farbic network through Fabric SDK and CouchDB for user authentication. Endpoints are configured in Node.js for various processes. (login, logout, store titles into blockchain etc.)


<h2> Frontend </h2>

![image](https://user-images.githubusercontent.com/98612606/192155493-65699b99-b7ef-4566-91ee-dda51bf2ba4a.png)
Frontend is done with Angular.js. Services files are used to fetch and post to the endpoints. <br />

1. Login 

![image](https://user-images.githubusercontent.com/98612606/192146995-08c914c9-d2a6-4491-b066-42d8d52f58d1.png)

Landowners and Land Administrator can login into their respective account after being authenticated and authorized. Users information are stored in CouchDB.<br />


2. Update Profile

![image](https://user-images.githubusercontent.com/98612606/192155371-5ce6a7a0-7619-4947-a9cd-1546d7354b77.png)

Landowners and Land Administrator can update their user profile. The fields comes with relevant validation (required, email etc.)
