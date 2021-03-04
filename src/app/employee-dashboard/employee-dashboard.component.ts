import { EmployeeService } from './employee.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent implements OnInit{
  public employees;

  constructor (private api:EmployeeService) {}

  ngOnInit() {
    this.api.getEmployee().subscribe(res => {
      this.employees = res;
        console.log('data of employee', this.employees)
    })
  }
  
}
