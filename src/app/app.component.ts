import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
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
  gameID : string = '';
  enteredID : string = '';
  name : string = '';

  constructor(private firestore: AngularFirestore) {
    //this.getMessages().subscribe(result => this.message$ = result);
  }

  // getMessages() : Observable<FirestoreRec[]>{
  //   //return this.firestore.collection<FirestoreRec>('messages', ref => ref.orderBy('timestamp')).valueChanges()
  // }

  createGame() : void {
    //TODO: Add check for duplicate IDs
    //TODO: Add timeout for games with no activity
    console.log("Test");
    let resultID = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for(let i = 0; i < 4; ++i) { //generates a random 4-character game id
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

  joinGame() : void {

  }
}

interface Game {
  ID : string
  Phase : string
  Time : Number
  Day : Number
}

interface Player {
  name: string
}