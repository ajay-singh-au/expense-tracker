import { NgModule } from '@angular/core';
import { ProtectedRoute } from './protected-router.service';

import { RouterModule, Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { ReportComponent } from './report/report.component';
import { LoginComponent } from './login/login.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
  },
  {
    path: 'manager-dashboard',
    component: ManagerDashboardComponent,
  },
  {
    path: 'manager-dashboard/register-employee',
    component: RegisterEmployeeComponent
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'employee-reports',
    component: ReportComponent,
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
