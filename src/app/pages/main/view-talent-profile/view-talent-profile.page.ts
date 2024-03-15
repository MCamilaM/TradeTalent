import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';
import { IonDatetime } from '@ionic/angular';

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

  user: User = {
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
    const day = this.padNumber(currentDate.getDate());
    const hours = this.padNumber(currentDate.getHours());
    const minutes = this.padNumber(currentDate.getMinutes());
    const seconds = this.padNumber(currentDate.getSeconds());

    this.dateToday = `${year}-${currentMonth}-${day}T${hours}:${minutes}:${seconds}`;
    this.dateOneMonthLater = `${year}-${oneMonthLater}-${day}T${hours}:${minutes}:${seconds}`;
  }

  padNumber(number: number): string {
    return number < 10 ? '0' + number : '' + number;
  }

  dateChanged(value){
    console.log(value)
  }


  getUser(uid: string) {
    let path = `users/${uid}`;

    this.firebaseSvc.getDocument(path)
      .then((user: User) => {
        this.user = user;

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
