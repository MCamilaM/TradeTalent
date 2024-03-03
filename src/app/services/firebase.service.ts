import { Injectable, inject } from '@angular/core';
import  {AngularFireAuth} from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import { user} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  Auth = inject(AngularFireAuth);

//==========Autenticacion==============

signIn(user: user) {
return signInWithEmailAndPassword(getAuth(), user.email,user.password);


}



}
