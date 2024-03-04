/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del Producto')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  async createProduct() {

    let path = `user/${this.user.uid}/products`;

    const loading = await this.utilsSvc.loading();
    await loading.present()

    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl)
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    this.firebaseSvc.addDocument(path, this.form.value)
      .then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Producto creado correctamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })


      }).finally(() => {
        loading.dismiss();
      })
  }

  async updateProduct() {

    let path = `user/${this.user.uid}/products/${this.product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present()

    // if change the image, upload the new image and get the url
    if(this.form.value.image != this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl)
      this.form.controls.image.setValue(imageUrl);  
    }

    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value)
      .then(async res => {

        this.utilsSvc.dismissModal({ success: true });

        this.utilsSvc.presentToast({
          message: 'Producto actualizado correctamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })


      }).catch(error => {
        console.log(error);

        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })


      }).finally(() => {
        loading.dismiss();
      })
  }
}
