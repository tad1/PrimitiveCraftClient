# PrimitiveCraftClient
Another result of a college assignment.. **we are not proud about this one**\
A client for a multiplayer chopping simulator (_that was meant to be a survival and crafting game_) that uses WebRTC communication protocol.

![prc2](https://github.com/tad1/PrimitiveCraftClient/assets/47014347/f29542b9-90da-4124-9e47-4eece01e252d)

Game Client by [tad1](https://github.com/tad1)\
Game Server by [lukgla](https://github.com/lukgla)

## How to play
### Run Server (requires Golang)
note: this is currently a private repo
```sh
git clone https://github.com/lukgla/pr_game
cd pr_game
go run ./cmd/server
```
Server will run on `localhost:10002`.

### Run Client
```sh
git clone https://github.com/tad1/PrimitiveCraftClient
cd PrimitiveCraftClient
npm install
npm start
```
It will launch a client with a browser console.
Use those commands to log into the server
```js
login("test", "pass", "server_address:10002") //player 1
login("test", "pass2", "server_address:10002") //player 2
```

**Controlls:**\
Arrows - movement\
Left Click - Attack\
Right Click - Item Use\
Middle Click - Place Item
