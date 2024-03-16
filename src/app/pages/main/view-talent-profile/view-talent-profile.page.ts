import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime } from '@ionic/angular';
import { Reservation } from 'src/app/models/reservation.model';

@Component({
  selector: 'app-view-talent-profile',
  templateUrl: './view-talent-profile.page.html',
  styleUrls: ['./view-talent-profile.page.scss'],
})
export class ViewTalentProfilePage implements OnInit {

  isActiveDateTime: boolean = false;
  userId!: string;
  dateToday: string;
  dateOneMonthLater: string;

  selectedDate: string;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user: User;

  userTalent: User = {
    uid: '',
    email: '',
    password: '',
    name: '',
    biography: '',
    image: '',
    abilities: '',
    country: '',
    priceForHour: undefined
  };

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');

    this.getCurrentDateTime()

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
    });
    this.getUser(this.userId)
  }


  getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const currentMonth = this.padNumber(currentDate.getMonth() + 1);
    const oneMonthLater = this.padNumber(currentDate.getMonth() + 2);
    const day = this.padNumber(currentDate.getDate() + 1);
    // const hours = this.padNumber(currentDate.getHours());
    const hours = "08"
    const hours2 = "22"
    const minutes = this.padNumber(currentDate.getMinutes());
    const seconds = this.padNumber(currentDate.getSeconds());

    this.dateToday = `${year}-${currentMonth}-${day}T${hours}:${minutes}:${seconds}`;
    this.dateOneMonthLater = `${year}-${oneMonthLater}-${day}T${hours2}:${minutes}:${seconds}`;
  }

  padNumber(number: number): string {
    return number < 10 ? '0' + number : '' + number;
  }

  dateChanged(value) {
    this.selectedDate = value;
    this.createReservation()
  }

  async createReservation() {

    if (this.selectedDate == undefined) {
      this.utilsSvc.presentToast({
        message: "Selecciona una fecha",
        duration: 2500,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      })
    } else {
      this.utilsSvc.presentAlert({
        header: 'Reservar talento',
        message: `¿Quieres reservar con ${this.userTalent.name} ?`,
        buttons: [
          {
            text: 'Cancelar',
          }, {
            text: 'Si, reservar',
            handler: () => {
              console.log("reservar");
              this.addReservation();
            }
          }
        ]
      });
    }
  }

  async addReservation() {

    let path = `user/${this.user.uid}/reservations`;

    const reservation: Reservation = {
      uidTalent: `${this.userTalent.uid}`,
      dateOfReserve: `${this.selectedDate}`,
    }

    console.log(reservation)

    const loading = await this.utilsSvc.loading();
    await loading.present()

    this.firebaseSvc.addDocument(path, reservation)
      .then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Reserva creada correctamente',
          duration: 1500,
          color: 'success',
          position: 'bottom',
          icon: 'checkmark-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })


      }).finally(() => {
        loading.dismiss();
      })
  }

  cancelReservation() {
    this.isActiveDateTime = false;
  }

  getUser(uid: string) {
    let path = `users/${uid}`;

    this.firebaseSvc.getDocument(path)
      .then((user: User) => {
        this.userTalent = user;

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

  showDateTimePicker() {
    this.isActiveDateTime = true;
  }

}
