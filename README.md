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

Node.js is used as server to communicate with Hyperledger Farbic network through Fabric SDK and CouchDB for user authentication. Endpoints are configured in Node.js for various processes. (login, logout, store titles into blockchain etc.). Other than that, File Sytem Wallet are created on land administrator local machine therefore only machine with certified public & private key can communicate with the Hyperledger Fabric network.


<h2> Frontend </h2>

![image](https://user-images.githubusercontent.com/98612606/192155493-65699b99-b7ef-4566-91ee-dda51bf2ba4a.png)
 <br /> Frontend is done with Angular.js. Services files are used to fetch and post to the endpoints.

1. Login 

![image](https://user-images.githubusercontent.com/98612606/192146995-08c914c9-d2a6-4491-b066-42d8d52f58d1.png)

Landowners and Land Administrator can login into their respective account after being authenticated and authorized. Users information are stored in CouchDB.<br />


2. Update Profile

![image](https://user-images.githubusercontent.com/98612606/192155371-5ce6a7a0-7619-4947-a9cd-1546d7354b77.png)

Landowners and Land Administrator can update their user profile. The fields comes with relevant validation (required, email etc.)
 <br />
 
3. View Profile

![image](https://user-images.githubusercontent.com/98612606/192155992-bfdca71b-fdfe-4da4-8c2a-7830346f9fba.png)

Landowners and Land Administrator can view their profile with latest updated information.
 <br />
 
4. Store Land Title into blockchain network

![image](https://user-images.githubusercontent.com/98612606/192156361-b316dd91-c62f-4b34-a923-61ab4c427462.png)

Land administrator can store land title into the network by inputing relevant information of landowner and update PDF file of the land title. The content of the PDF will be converted into hash by using SHA-256 algorithm. Other than that, the PDF file will be stored in server machine for displaying later.
<br />


5. View All Land Title

![image](https://user-images.githubusercontent.com/98612606/192156388-cbb69f7a-7f05-40f7-92ef-d61bbec1bca9.png)

Land administrator can view all land title stored into the blockchain network. With the pdf viewer, the can print the hardcopy and download the softcopy into server machine.
<br />

6. Verify Land Title

![image](https://user-images.githubusercontent.com/98612606/192156519-dc416322-609a-4be9-a9fd-573a2ee6d0aa.png)

Land administrator can check the validity of a land title by uploading the PDF on the website. If the hash of the uploaded land title is found in the blockchain, it means the contents are valid, else it means the contents are invalid.
<br />

7. Delete Land Title

![image](https://user-images.githubusercontent.com/98612606/192157014-a35b0f10-fbb9-459e-b675-ae4641da38af.png)

Land administrator can search the land title with its address and mark it as deleted in the blockchain. It will then be removed from world state database (CouchDB) and it won't be shown again as a title in the web application.
<br />

8. Create Landowner Account

![image](https://user-images.githubusercontent.com/98612606/192157387-f453dbf5-052d-4730-9409-2279666292f1.png)

![image](https://user-images.githubusercontent.com/98612606/192157504-888fd727-3709-4d17-be04-cb4e388fc0e9.png)


Land administrator can create landowner account and the account will be automatically sent to the landowner by the system through the phone number.
<br />

9. Change Password

![image](https://user-images.githubusercontent.com/98612606/192157573-7e9844d9-c91a-409c-a028-8d98e51f551d.png)

After receiving user credential for the web application, landowner can update their account password after inserting old password and new password. Password must match pattern of at least 1 uppercase, 1 lowercase, 1 digit and 1 special character.


10. View Land Title

![image](https://user-images.githubusercontent.com/98612606/192157605-56d77639-43d7-4ced-87fb-92ab6873cef9.png)

Landowner can view the housing title that matches his/her identity number. It can also be printed and downloaded.

