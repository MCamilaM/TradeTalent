import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProfileComponent } from 'src/app/shared/components/add-update-profile/add-update-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user?: User;

  constructor() { }

  ngOnInit() {
    this.user = this.getUserFromLocalStorage();
  }

  getUserFromLocalStorage(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  getUser() {
    let path = `users/${this.user.uid}`;

    this.firebaseSvc.getDocument(path)
      .then((user: User) => {

        this.utilsSvc.saveInLocalStorage('user', user);
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

  async addUpdateProfile(user?: User) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProfileComponent,
      cssClass: 'add-update-modal',
      componentProps: { user }
    })

    if (success) this.getUser();

  }

}
