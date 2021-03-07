import { Component, OnInit } from '@angular/core';
import { EmployeeDetails } from '../../EmployeeDetails';
import { EmployeeService} from "../services/employees";
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';

/**
 * @title Basic use of `<table mat-table>`
 */
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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private service: EmployeeService){}

  ngOnInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getAllEmployees();
  }

  public getAllEmployees() {
    let response = this.service.getEmployee();
    response.subscribe(employee => this.dataSource.data = employee as EmployeeDetails[])
  }

  applyFilter(filterValue: string) {
    // const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}