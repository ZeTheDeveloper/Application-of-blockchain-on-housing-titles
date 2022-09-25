# Application-of-blockchain-on-housing-titles
Storing land titles into Hyperledger Fabric Network to ensure easy storing and verification.

<h2> Hyperledger Fabric Framework </h2>
1. Configure WSL and Ubuntu for development of Hyperledger Fabric. </n>
2. Creating blockchain peers, orderers (with certificate and private key) and genesis block.
3. Start the blockchain network with Docker.

![image](https://user-images.githubusercontent.com/98612606/192152174-a2422747-9526-4106-a834-cbaa83c0b482.png)

4. Creating channel (communication medium between peers and with client side) with shell script.
5. Writing chaincode (smart contract) written in Golang.
6. Deploying chaicode (smart contract) in the channel with shell script.


<h2> Node.js </h2>
![image](https://user-images.githubusercontent.com/98612606/192154658-87b7a79a-798a-49fe-b377-9831d5680732.png)

Node.js is used as server to communicate with Hyperledger Farbic network through Fabric SDK and CouchDB for user authentication. Endpoints are configured in Node.js for various processes. (login, logout, store titles into blockchain etc.)


<h2> Frontend </h2>
1. Login 

![image](https://user-images.githubusercontent.com/98612606/192146995-08c914c9-d2a6-4491-b066-42d8d52f58d1.png)

Landowners and Land Administrator can login into their respective account after being authenticated and authorized. Users information are stored in CouchDB.
