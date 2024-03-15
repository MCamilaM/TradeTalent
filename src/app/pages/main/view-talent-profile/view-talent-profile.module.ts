import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTalentProfilePageRoutingModule } from './view-talent-profile-routing.module';

import { ViewTalentProfilePage } from './view-talent-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTalentProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [ViewTalentProfilePage]
})
export class ViewTalentProfilePageModule {}
