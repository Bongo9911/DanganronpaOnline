import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Danganronpa Online';

  gameID: string = 'DYUN';
  room: string = 'Lobby';

  enteredID: string = '';
  name: string = 'Bongo';
  message: string;

  player$: Player[];
  message$: Chat[];

  constructor(private firestore: AngularFirestore) {
    this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Player>('players').valueChanges()
      .subscribe(result => this.player$ = result);

    this.firestore.collection<Game>('games').doc(this.gameID)
      .collection<Chat>('chat', ref => ref.orderBy('timestamp')).valueChanges()
      .subscribe(result => this.message$ = result);
  }

  // getMessages() : Observable<FirestoreRec[]>{
  //   //return this.firestore.collection<FirestoreRec>('messages', ref => ref.orderBy('timestamp')).valueChanges()
  // }

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
  }

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
              this.firestore.collection<Game>('games').doc(this.gameID)
                .collection<Player>('players').doc(this.name).set({
                  name: this.name,
                });

              this.firestore.collection<Game>('games').doc(this.gameID)
                .collection<Player>('players').valueChanges()
                .subscribe(result => this.player$ = result);

              this.firestore.collection<Game>('games').doc(this.gameID)
                .collection<Chat>('chat', ref => ref.orderBy('timestamp')).valueChanges()
                .subscribe(result => this.message$ = result);
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

  sendMessage() : void {
    this.firestore.collection<Game>('games').doc(this.gameID).collection<Chat>('chat').add({
      message: this.name + ': ' + this.message,
      room: this.room,
      gametime: 0,
      day: 0,
      timestamp: new firebase.default.firestore.Timestamp(Date.now() / 1000, 0),
    });
    this.message = "";
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
  message: string
  room: string
  gametime: number
  day: number
  timestamp: firebase.default.firestore.Timestamp
}