﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MyBoutique.Infrastructure.InputModels;
using MyBoutique.Infrastructure.ViewModels;
using MyBoutique.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MyBoutique.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDataController : ControllerBase
    {
        private readonly IOrderDataService orderDataService;

        public OrderDataController(IOrderDataService orderDataService)
        {
            this.orderDataService = orderDataService;
        }

        // GET: api/<OrderDataController>
        [HttpGet]
        public IActionResult Get()
        {
            var orderData = this.orderDataService.GetAllOrderDataAsynq<OrderDataViewModel>();

            if (orderData != null)
            {
                return this.Ok(orderData);
            }

            return this.BadRequest($"Failed to load orderData from db");
        }

        // GET api/<OrderDataController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var orderData = await this.orderDataService.GetOrderDataByIdAsynq<OrderDataViewModel>(id);

            if (orderData != null)
            {
                return this.Ok(orderData);
            }

            return this.BadRequest($"Failed to load orderData with id={id} from db");
        }

        // POST api/<OrderDataController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] OrderDataInputModel input)
        {
            if (this.ModelState.IsValid)
            {
                try
                {
                    var result = await this.orderDataService.CreateOrderDataAsynq(input);

                    if (result != 0)
                    {
                        return this.Ok(result);
                    }

                }
                catch (Exception e)
                {

                    return this.BadRequest(e.Message);
                }
            }

            return this.BadRequest("Failed to create data");
        }

        // PUT api/<OrderDataController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<OrderDataController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await this.orderDataService.DeleteOrderDataAsynq(id);

            if (order)
            {
                return this.Ok(order);
            }

            return this.BadRequest($"Failed to delete orderData.");
        }
    }
}