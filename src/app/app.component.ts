import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Danganronpa Online';
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  chatSub: Subscription;

  gameID: string = 'DYUN';
  room: string = 'Lobby';

  enteredID: string = '';
  name: string = 'Bongo';
  message: string;

  player$: Player[];
  message$: Chat[];

  //Initializes any necessary functions for the game to run
  constructor(private firestore: AngularFirestore) {
    this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Player>('players').valueChanges()
      .subscribe(result => this.player$ = result);

    this.chatSub = this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Chat>('chat', ref => ref.where('room', '==', this.room).orderBy('timestamp'))
      .valueChanges().subscribe(result => this.message$ = result);
  }

  //Scrolls the chat to the bottom on initialization
  ngOnInit() {
    this.scrollToBottom();
  }

  //Calls scrollToBottom when a new chat message is sent or received
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  //Auto-scrolls chat to the bottom
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  //createGame() creates a game with a random 4 character ID
  createGame(): void {
    //TODO: Add check for duplicate IDs
    //TODO: Add timeout for games with no activity
    console.log("Test");
    let resultID = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for (let i = 0; i < 4; ++i) { //generates a random 4-character game id
      resultID += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.firestore.collection<Game>('games').doc(resultID).set({
      ID: resultID,
      Phase: 'Lobby',
      Time: 8,
      Day: 1,
    });

    this.firestore.collection<Game>('games').doc(resultID)
      .collection<Player>('players').doc(this.name).set({
        name: this.name,
      });

    this.gameID = resultID;
    this.room = 'Lobby';

    this.subscribeToCollections();
  }

  //joinGame() attempts to connect the player using the name and code they entered
  joinGame(): void {
    this.enteredID = this.enteredID.toUpperCase();
    const usersRef = this.firestore.collection('games').doc(this.enteredID).get().toPromise().then(async (docSnapshot) => {
      if (await docSnapshot.exists) {
        this.firestore.collection<Game>('games').doc(this.enteredID)
          .collection<Player>('players').get().toPromise().then(snap => {
            let size = snap.size // will return the collection size
            if (size < 16) { //checks to make sure player cap hasn't been reached
              //TODO: Check if a player in the lobbby already has the name you want
              this.gameID = this.enteredID;
              this.room = 'Lobby';
              this.firestore.collection<Game>('games').doc(this.gameID)
                .collection<Player>('players').doc(this.name).set({
                  name: this.name,
                });

              this.subscribeToCollections();
            }
            else {
              //TODO: Add error message for full lobby
            }
          });
      }
      else {
        //TODO: Add error message that lobby doesn't exist
      }
    });
  }

  //Subscribes to the collections needed for the lobby
  subscribeToCollections(): void {
    this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Player>('players').valueChanges()
      .subscribe(result => this.player$ = result);

    this.chatSub = this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Chat>('chat', ref => ref.where('room', '==', this.room).orderBy('timestamp'))
      .valueChanges().subscribe(result => this.message$ = result);
  }

  //Send a message to the chat in the current room
  sendMessage(): void {
    this.firestore.collection<Game>('games').doc(this.gameID).collection<Chat>('chat').add({
      author: this.name,
      message: this.message,
      room: this.room,
      gametime: 0,
      day: 0,
      timestamp: new firebase.default.firestore.Timestamp(Date.now() / 1000, 0),
    });
    this.message = "";
  }

  //Debug function for switching the room to test chat
  switchRoom(): void {
    this.room = 'Nothing'
    this.chatSub.unsubscribe();
    this.chatSub = this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Chat>('chat', ref => ref.where('room', '==', this.room).orderBy('timestamp')).valueChanges()
      .subscribe(result => this.message$ = result);
  }

  //Starts the game with the players currently in the lobby
  startGame(): void {
    this.firestore.collection<Game>('games').doc(this.gameID).update({
      Phase: 'Day',
    });
  }
}

interface Game {
  ID: string
  Phase: string
  Time: Number
  Day: Number
}

interface Player {
  name: string
}

interface Chat {
  author: string
  message: string
  room: string
  gametime: number
  day: number
  timestamp: firebase.default.firestore.Timestamp
}