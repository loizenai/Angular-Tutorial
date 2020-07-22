import { Customer } from './customer';

export class Message {
    customers: Customer[];
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}