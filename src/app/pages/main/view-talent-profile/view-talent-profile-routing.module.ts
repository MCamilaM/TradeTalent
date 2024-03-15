import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTalentProfilePage } from './view-talent-profile.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTalentProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTalentProfilePageRoutingModule {}
