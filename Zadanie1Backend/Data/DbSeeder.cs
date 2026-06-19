using SolutionOrders.API.Models;

namespace SolutionOrders.API.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Customers.Any())
        {
            var customer1 = new Customer
            {
                Id = "c1",
                FirstName = "Jan",
                LastName = "Kowalski",
                Email = "jan.kowalski@example.com"
            };

            var customer2 = new Customer
            {
                Id = "c2",
                FirstName = "Anna",
                LastName = "Nowak",
                Email = "anna.nowak@example.com"
            };

            context.Customers.AddRange(customer1, customer2);
        }

        if (!context.Categories.Any())
        {
            var category1 = new Category
            {
                Id = "cat1",
                Name = "Elektronika"
            };

            var category2 = new Category
            {
                Id = "cat2",
                Name = "Biuro"
            };

            context.Categories.AddRange(category1, category2);
        }

        if (!context.Products.Any())
        {
            var product1 = new Product
            {
                Id = "p1",
                Name = "Laptop Dell",
                Price = 4200,
                CategoryId = "cat1"
            };

            var product2 = new Product
            {
                Id = "p2",
                Name = "Monitor LG",
                Price = 1200,
                CategoryId = "cat1"
            };

            var product3 = new Product
            {
                Id = "p3",
                Name = "Drukarka HP",
                Price = 800,
                CategoryId = "cat2"
            };

            context.Products.AddRange(product1, product2, product3);
        }

        if (!context.Orders.Any())
        {
            var order1 = new Order
            {
                Id = "o1",
                CustomerId = "c1",
                Status = "Nowe",
                CreatedAt = "2026-02-01"
            };

            var order2 = new Order
            {
                Id = "o2",
                CustomerId = "c2",
                Status = "Zrealizowane",
                CreatedAt = "2026-02-02"
            };

            context.Orders.AddRange(order1, order2);
        }

        if (!context.OrderItems.Any())
        {
            var orderItem1 = new OrderItem
            {
                Id = "oi1",
                OrderId = "o1",
                ProductId = "p1",
                Quantity = 1
            };

            var orderItem2 = new OrderItem
            {
                Id = "oi2",
                OrderId = "o1",
                ProductId = "p2",
                Quantity = 2
            };

            context.OrderItems.AddRange(orderItem1, orderItem2);
        }

        context.SaveChanges();
    }
}