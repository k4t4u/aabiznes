namespace SolutionOrders.API.Models;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public string CategoryId { get; set; } = string.Empty;
    public Category? Category { get; set; }

    public List<OrderItem> OrderItems { get; set; } = new();
}