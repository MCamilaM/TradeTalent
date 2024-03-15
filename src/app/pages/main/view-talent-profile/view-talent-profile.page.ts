import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-talent-profile',
  templateUrl: './view-talent-profile.page.html',
  styleUrls: ['./view-talent-profile.page.scss'],
})
export class ViewTalentProfilePage implements OnInit {

  userId!: string;

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
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
    });
    this.getUser(this.userId)
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

}
