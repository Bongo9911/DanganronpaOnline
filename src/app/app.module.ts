import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { firebaseConfig } from './credentials';

const firebaseConfig = {
  apiKey: "AIzaSyAg-qfGaL_tzYNGOnWmJevd2lBP5kN6c5E",
  authDomain: "danganronpaonline-545fa.firebaseapp.com",
  projectId: "danganronpaonline-545fa",
  storageBucket: "danganronpaonline-545fa.appspot.com",
  messagingSenderId: "390013565471",
  appId: "1:390013565471:web:8da4232b1d6f2a126f332a",
  measurementId: "G-XYDB800650"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    MatInputModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
