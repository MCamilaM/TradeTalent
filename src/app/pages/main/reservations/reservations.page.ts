import { Component, OnInit, inject } from '@angular/core';
import { Reservation } from 'src/app/models/reservation.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  user: User;
  reservations: Reservation[];

  constructor() { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.getReservations();
  }

  getReservations() {
    const path = `user/${this.user.uid}/reservations`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
       // console.log(res);
        this.reservations = res;
        this.getUsers();



        //this.loading = false;
        sub.unsubscribe;
      }
    })



  }

  getUsers() {
    if (this.reservations.length > 0) {
      for (let i = 0; i < this.reservations.length; i++) {
        let reservation: Reservation = this.reservations[i];
        //this.reservations[i].user = this.getUser(reservation.uidTalent);

        let path = `users/${reservation.uidTalent}`;
        let userTalent: User
    
        this.firebaseSvc.getDocument(path)
          .then((user: User) => {
            this.reservations[i].user  = user;
    
          }).catch(error => {
            console.log(error);
    
            this.utilsSvc.presentToast({
              message: error.message,
              duration: 2500,
              color: 'primary',
              position: 'middle',
              icon: 'alert-circle-outline'
            })
    
          })
      }
      console.log (this.reservations);


    }
  }

  getUser(uid: string): User {
    let path = `users/${uid}`;
    let userTalent: User

    this.firebaseSvc.getDocument(path)
      .then((user: User) => {
        userTalent = user;

      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      })
    return userTalent;
  }

}
