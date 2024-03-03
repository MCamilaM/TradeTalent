import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user} from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';



@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage  {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  firebaseSvc = inject(FirebaseService);

  submit() {
  if(this.form.valid) {
    this.firebaseSvc.signIn(this.form.value as user) 
    .then(res =>{

    console.log(res);
    })
   } 
  }
}