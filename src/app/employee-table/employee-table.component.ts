import { Component, OnInit } from '@angular/core';
import { EmployeeDetails } from '../../EmployeeDetails';
import { EmployeeService} from "../services/employees";
import { MatTableDataSource } from '@angular/material/table';
import {Input} from '@angular/core';

// /**
//  * @title Basic use of `<table mat-table>`
//  */
@Component({
  selector: 'employee-table',
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css']
})

@Input('ELEMENT_DATA')
export class EmployeeTableComponent implements OnInit {
  ELEMENT_DATA! : EmployeeDetails[];
  displayedColumns: string[] = ['id', 'name', 'username', 'email','phone'];
  dataSource = new MatTableDataSource<EmployeeDetails>(this.ELEMENT_DATA);

  constructor(private service: EmployeeService){}

  ngOnInit(){
    this.getAllEmployees();
  }

  public getAllEmployees() {
    let response = this.service.getEmployee();
    response.subscribe(employee => this.dataSource.data = employee as EmployeeDetails[])
  }
}