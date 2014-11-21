BurningChat
===========

Extream high temperature chatting service for communities powered by Firebase. You can setup your community's own chat server for free! <br>
[Official chatting space](https://burningchat.firebaseapp.com)

## What is BurningChat?

BurningChat is a simple chatting program based on web and firebase service. With this, you can setup your own chat server for free and chatting with your friends via web page/widget.

## How can i setup my own BurningChat server?

Ok, just follow me. Then you can get your BurningChat server just for free!

1. At first you need to install node.js for setup. This is needed just for initial setup, and optional manage. If you don't have it, just [install node.js](http://www.nodejs.org/)

1. Be sure that you have a Firebase account. If you don't, just [sign up](https://www.firebase.com).

1. Create a new Firebase application. And remember it's name. Don't forget!
    >Firebase free tier has some limitation to use.<br>
    >For instance, only 50 users can join your chatting server at same time.<br>
    >And your chat data limit is 100MB, while transfer limit is 5GB.<br>
    >But it's ok, that's pretty enough for plain chatting server.

1. Download all files from this github repository and put it in your computer.

1. Now you need to edit some of source code. Open js/app.js and find single <code>https://burningchat.firebaseio.com</code>. And replace <code>burningchat</code> with your own app's name.

1. Open the console window in your BurningChat installation directory. And type <code>npm install -g firebase-tools</code>.

1. When it done, type <code>firebase init</code>. Then it will initialize your firebase hosting information.

1. Almost there! Finally, type <code>firebase deploy</code>.

1. And done! Now join https://{yourchatapp}.firebaseapp.com and enjoy your chat!