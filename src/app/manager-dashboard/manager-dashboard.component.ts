import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employees';

@Component({
  selector: 'manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.css']
})
export class ManagerDashboardComponent implements OnInit {

  public employees;
  constructor(private api: EmployeeService) {}
  ngOnInit() {
    this.api.getEmployee().subscribe((res) => {
      this.employees = res;
      console.log('data of employee', this.employees);
    });
  }
}
