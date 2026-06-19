namespace SolutionOrders.API.Models;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string CustomerId { get; set; } = string.Empty;
    public Customer? Customer { get; set; }

    public string Status { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;

    public List<OrderItem> OrderItems { get; set; } = new();
}