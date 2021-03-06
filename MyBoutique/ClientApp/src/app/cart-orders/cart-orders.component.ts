import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/_services';
import { ProductsService } from '../../_services/products.service';

@Component({
  selector: 'app-cart-orders',
  templateUrl: './cart-orders.component.html',
  styleUrls: ['./cart-orders.component.css']
})
export class CartOrdersComponent implements OnInit {
  public orders = [];
  public subTotal = 0;
  form: FormGroup;
  loading = false;
  submitted = false;
  selectedDeliveryType = '';

  constructor(private service: ProductsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    this.orders = [];
    this.subTotal = 0;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(9)]],
      email: ['', [Validators.required, Validators.minLength(2)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      deliveryType: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(2)]],
      additionalInformation: [''],
      orders: this.formBuilder.array([])
    });
    this.getOrdersBySessionId();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.form.value.orders = this.orders

    this.loading = true;

    this.service.createOrder(this.form.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log(this.form.value);
          this.router.navigate(['/successfull-order'], { relativeTo: this.route });
          this.cleartCartProducts();
        },
        error => {
          console.log(error);
          this.loading = false;
        });

  }

  cleartCartProducts(): void {
    this.service.deleteAllProductsFromCart()
      .subscribe(event => {
        console.log(event);
      })
  }

  getOrdersBySessionId(): void {
    this.service.getAllOrders()
      .subscribe(success => {
        if (success) {
          this.orders = this.service.orders;
          this.subTotal = 0;
          this.orders.forEach(element => {
            this.subTotal += element.totalPrice
          });
        }
      })
  }

  incrementQTY(item: any) {
    if (item.quantity >= 1) {
      item.quantity += 1;
      item.totalPrice = item.product.price * item.quantity;
      this.subTotal += item.product.price;
    }

  }

  decrementQTY(item: any) {
    if (item.quantity > 1) {
      item.quantity -= 1;
      item.totalPrice -= item.product.price;
      this.subTotal -= item.product.price;
    }
  }

  public removeProduct = (id: number, productName: string) => {
    this.service.deleteOrder(id)
      .subscribe(event => {
        console.log(event);
        let message = `Успешно премахнахте ${productName} от вашата количка.`;
        this.alertService.success(message, { autoClose: true });
        this.getOrdersBySessionId();
      })
  }

}
