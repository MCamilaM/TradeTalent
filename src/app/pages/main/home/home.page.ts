import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];
  users: User[] = [];
  loading: boolean = false;

  constructor(private navCtrl: NavController, private router: Router) { }

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProfiles();
  }

  getProfiles() {
    let path = `users`;

    this.loading = true;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        this.users = res;

        this.loading = false;
        sub.unsubscribe;
      }
    })
  }

  viewTalentProfile(user: User) {
    this.router.navigate(['main/talent-profile', user.uid]);
  }

  // ========== Get products =======================
  // getProducts() {

  //   let path = `user/${this.user().uid}/products`;

  //   this.loading = true;

  //   let sub = this.firebaseSvc.getCollectionData(path).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       this.products = res;

  //       this.loading = false;
  //       sub.unsubscribe;
  //     }
  //   })

  //   let sub2 = this.firebaseSvc.getCollectionData('users').subscribe({
  //     next: (res: any) => {
  //       console.log(res);

  //       sub2.unsubscribe;
  //     }
  //   })

  // }

  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    })

    if (success) this.getProfiles();

  }

  // ========== confirm product elimination =======================
  async confirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Eliminar producto',
      message: '¿Quieres eliminar este producto?',
      buttons: [
        {
          text: 'Cancelar',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }

  async deleteProduct(product: Product) {

    let path = `user/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present()

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path)
      .then(async res => {

        this.products = this.products.filter(p => p.id !== product.id)

        this.utilsSvc.presentToast({
          message: 'Producto eliminado correctamente',
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
