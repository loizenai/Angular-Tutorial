import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { CustomerService } from '../customer.service';
import { Message } from '../message';
import { Customer } from '../customer';

const pageSize:number = 5;

@Component({
  selector: 'app-angulartable',
  templateUrl: './angulartable.component.html'
})
export class AngulartableComponent implements OnInit {
  currentSelectedPage:number = 0;
  totalPages: number = 0;
  customers: Array<Customer> = [];
  pageIndexes: Array<number> = [];

  // salaries list
  salaries: Array<number> = [];
  selectedSalary: number = -1;

  // sorting
  agesorting: boolean = false;
  desc: boolean = false;

  constructor(private customerService: CustomerService) { 
  }

  ngOnInit(): void {
    // get the first Page
    this.getPage(0, -1, false, false);
    // get Salaries
    this.getSalaries();
  }

  getPage(page: number, selectedSalary: number, agesorting: boolean, desc: boolean){

    this.customerService.getPagableCustomers(page, pageSize, selectedSalary, 
                                              agesorting, desc)
            .subscribe(
                (message: Message) => {
                  console.log(message);
                  this.customers = message.customers;
                  this.totalPages = message.totalPages;
                  this.pageIndexes = Array(this.totalPages).fill(0).map((x,i)=>i);
                  this.currentSelectedPage = message.pageNumber;
                },
                (error) => {
                  console.log(error);
                }
            );
  }

  getPaginationWithIndex(index: number) {
    this.getPage(index, this.selectedSalary, this.agesorting, this.desc);
  }

  getSalaries() {
    this.customerService.getListSalaries()
          .subscribe(
            (salaries: Array<number>) => {
              console.log(salaries);
              this.salaries = salaries;
            },
            (error) => {
              console.log(error);
            }
          );
  }

  getCustomerPagesWithSalaryFiltering(optionValue: any) {
    // convert option string value to appropriate number
    if(optionValue != "All"){
      this.selectedSalary = parseInt(optionValue);
    } else {
      this.selectedSalary = -1;
    }

    // load customer again with filtering and pagination api
    this.getPage(0, this.selectedSalary, this.agesorting, this.desc);
  }

  sortNow(){
    if(this.desc == true && this.agesorting == false){
      alert("Please select 'agesorting' option before selecting 'desc' option!");
      return;
    }
    // load again from backend for sorting with age field
    this.getPage(0, this.selectedSalary, this.agesorting, this.desc);
  }

  onAgeSortingChange(value: any){
    this.agesorting = !this.agesorting;
    if(!this.agesorting){
      // reset desc
      this.desc = false;
    }
  }

  active(index: number) {
    if(this.currentSelectedPage == index ){
      return {
        active: true
      };
    }
  }

  nextClick(){
    if(this.currentSelectedPage < this.totalPages-1){
      this.getPage(++this.currentSelectedPage,
                   this.selectedSalary, this.agesorting, this.desc);
    }  
  }

  previousClick(){
    if(this.currentSelectedPage > 0){
      this.getPage(--this.currentSelectedPage,
                   this.selectedSalary, this.agesorting, this.desc);
    }  
  }
}