import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTalentProfilePage } from './view-talent-profile.page';

describe('ViewTalentProfilePage', () => {
  let component: ViewTalentProfilePage;
  let fixture: ComponentFixture<ViewTalentProfilePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewTalentProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
