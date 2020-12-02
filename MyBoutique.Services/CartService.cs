﻿using Microsoft.EntityFrameworkCore;
using MyBoutique.Common.Repositories;
using MyBoutique.Infrastructure.InputModels;
using MyBoutique.Mappings;
using MyBoutique.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyBoutique.Services
{
    public class CartService : ICartService
    {
        private readonly IDeletableEntityRepository<Cart> cartRepository;

        public CartService(IDeletableEntityRepository<Cart> cartRepository)
        {
            this.cartRepository = cartRepository;
        }

        public IEnumerable<TViewModel> AllOrders<TViewModel>()
        {
            throw new System.NotImplementedException();
        }

        public Task<bool> DeleteOrderCartAsync<TViewModel>(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<int> MakeOrderCartAsync<TViewModel>(CreateCartInputModel inputModel)
        {
            if (inputModel == null)
            {
                throw new ArgumentNullException();
                //Add errMgs
            }

            var cart = new Cart()
            {
                OrderDataId = inputModel.OrderDataId,
                TotalPrice = inputModel.TotalPrice,
                CreatedOn = DateTime.UtcNow,
                Orders = inputModel.Orders.AsQueryable().To<Order>().ToList(),
            };

            this.cartRepository.Add(cart);

            var result = await this.cartRepository.SaveChangesAsync();

            return result > 0 ? cart.Id : throw new InvalidOperationException();


        }

        // TODO: Implement to display orders only for current session id.
    }
}
