# Checkers-Game

## Introduction

Welcome to the README for my Peer to Peer Checkers Game! This is a multiplayer game where two players can play checkers against each other using a peer to peer connection. The game is built using a modern technology stack and designed to be easy to use for players of all skill levels.
In this README, I'll provide an overview of the game and its features, as well as instructions for how to get started with playing.
I hope you enjoy playing our Peer to Peer Checkers Game and look forward to hearing your feedback!

## Design choices

For the server side I used Express which is a framework for web applications for Node.js and MySQL for the database.
The web pages, client side, were created using html, css and javascript. For the functioning of the checkers game, I decided to develop it leveraging PeerJs which provides a full peer-to-peer connection API, configurable. It has only an ID with which a peer can create an P2P data connection to a remote peer.

## Project operation

To launch the project, there is only one valid option, which requires the use of XAMPP, the command prompt, and Node.js. First, it is necessary to load the database, which is included in the delivery folder, onto PhpMyAdmin. To function correctly, the database must be named "accounts" and will contain a series of credentials with which you can log in.
Next, to start the server that connects to the database, it is necessary to open the command prompt, navigate to the directory containing the project, and run the command "npm start".
Once the server is running, you can connect to it through any browser (we recommend using Google Chrome). If you are on the same machine as the server, you can connect via "localhost:4000". If you are on the same LAN, you can connect to the server via "IPv4 address:4000".

## Log-In

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226751051-b624006a-d63b-4aed-8b97-b0f6c28b4232.jpg" alt="Log-In" width="400px" height="300px">
</div>

In this section you can enter your credentials and enter as users for play a game.

## Sign-In

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226751199-165a2559-deed-4146-a661-6ead65469f81.jpg" alt="Sign-In" width="400px" height="300px">
</div>

In this section you can enter your credentials and register as new users to play a game.

## Game Menù

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226751491-c9d36fe0-911e-4eb2-b219-b59afefca036.jpg" alt="Sign-In" width="400px" height="300px">
</div>

After logging in, the user can click on "Play" to be directed to the game page, where they can start a game against an opponent. Clicking on "Exit" will log the user out and redirect them to the login page.

## Match game

On this web page, you can view your Peer ID, which you must share if you want to play, the checkerboard with the game pieces, a "quit" button that allows you to return to the previous page, a section where you can enter your opponent's Peer ID, and a "Connect" button to establish a connection.

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226752362-197d9720-16c4-43cb-b19d-dfefe5eaf759.jpg" alt="Sign-In" width="400px" height="300px">
</div>

When a user enters the correct Peer ID of their opponent and clicks the "Connect" button, the connection is established and an alert is displayed to notify both players. The section related to the connection disappears for both players.

Afterwards, the player who clicked the "Connect" button will be allowed to make the first move of the game.

During the game, you can move a checker piece by clicking on it and moving it diagonally forward by one space.
If there is an opponent's checker piece in the way, you can jump over it to capture it, also diagonally. If there are two or more checker pieces in a row that can be jumped over, the player is obliged to capture all of them, as their checker piece will remain selected after the first jump.

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226752595-a9f498e9-71b6-4577-a47c-0a582aefd457.jpg" alt="Sign-In" width="400px" height="300px">
</div>

When one of the two players gets one or more of their checker pieces to the opponent's back row, that checker piece will be crowned as a king.

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226752791-6a901076-55eb-4402-ab73-eef8eff4fb4f.jpg" alt="Sign-In" width="400px" height="300px">
</div>

Finally, when a player captures all of their opponent's checker pieces or blocks their opponent's last remaining checker pieces from being moved, that player wins the game.
The victory or defeat of the players is notified by a message displaying "YOU WIN" or "YOU LOSE" on the checkerboard. Once the game is over, you need to click the arrow to return to the "START GAME" page.

<div align="center"> 
  <img src="https://user-images.githubusercontent.com/92525345/226752982-97cd038b-13a9-418f-a447-b0a90221c14e.jpg" alt="Sign-In" width="400px" height="300px">
</div>

## Extra

On the game page it will be possible to listen to a song.
















