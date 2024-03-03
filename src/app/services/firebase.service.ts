import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService)

  //========================Autenticacion===================================

  getAuth() {
    return getAuth();
  }

  //==========Log in==============

  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //==========Create user==============

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  //==========Update user==============
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }
  //=========Send email  for reset password======
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }
  //=========Log out ===========
  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }


  //======================== Database ===================================

  //==========Create a document==============
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  //==========Get a document==============
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }



}
