import { Component, OnInit } from '@angular/core';
import { CategoryConstants } from '../../environments/CategoryConstants';
import { Product } from '../../_models/product';
import { ProductsService } from '../../_services/products.service';

@Component({
  selector: 'app-male-product-list',
  templateUrl: './male-product-list.component.html',
  styleUrls: ['./male-product-list.component.css']
})
export class MaleProductListComponent implements OnInit {
  public products = [];
  filteredProducts: Product[] = [];
  subcategory = '';
  isExpanded = false;

  constructor(private productsService: ProductsService) { 
    this.products = [];
  }

  ngOnInit(): void {
    this.getProductsByCategory();
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  getProductsBySubcategory(value: any){
    this.subcategory = value;

    this.productsService.getAll()
    .subscribe(success => {
      if(success){
        this.products = this.productsService.products;
        this.filteredProducts = this.products.filter(p =>  {
          return p.categoryName === CategoryConstants.Male && p.categoryType === this.subcategory
        });
        this.filteredProducts.sort((a, b) => a.price - b.price);
      }
    })
  }

  getProductsByCategory(): void{
    this.productsService.getAll()
    .subscribe(success => {
      if(success){
        this.products = this.productsService.products;
        this.filteredProducts = this.products.filter(p =>  {
          return p.categoryName === CategoryConstants.Male
        });
        this.filteredProducts.sort((a, b) => a.price - b.price);
      }
    })
  }

}

