/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-profile',
  templateUrl: './add-update-profile.component.html',
  styleUrls: ['./add-update-profile.component.scss'],
})
export class AddUpdateProfileComponent implements OnInit {

  form: FormGroup;
  user: User;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {

    this.form = new FormGroup({
      uid: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl(''),
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      biography: new FormControl(null),
      image: new FormControl(''),
      abilities: new FormControl(''),
      country: new FormControl(''),
      priceForHour: new FormControl(null),
    });

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.user) this.form.patchValue(this.user);
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls['image'].setValue(dataUrl);
  }


  async submit() {
    if (this.form.valid) {
      let path = `users/${this.user.uid}`;

      const loading = await this.utilsSvc.loading();
      await loading.present()

      // create image file
      if (this.form.value.image != '' && this.user.image == '' || this.user.image == undefined) {
        let dataUrl = this.form.value.image;
        let imagePath = `users/${this.user.uid}/${Date.now()}`;
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls['image'].setValue(imageUrl);
      }

      // if change the image, upload the new image and get the url
      if (this.form.value.image != this.user.image && this.form.value.image !== '' && this.user.image !== '' && this.user.image !== undefined) {
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseSvc.getFilePath(this.user.image);
        let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
        this.form.controls['image'].setValue(imageUrl);
      }

      delete this.form.value.id;

      this.firebaseSvc.updateDocument(path, this.form.value)
        .then(async res => {

          this.utilsSvc.dismissModal({ success: true });

          this.utilsSvc.presentToast({
            message: 'Perfil actualizado correctamente',
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
  }
}

