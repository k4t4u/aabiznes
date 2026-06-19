namespace SolutionOrders.API.Models;

public class OrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string OrderId { get; set; } = string.Empty;
    public Order? Order { get; set; }

    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; }

    public int Quantity { get; set; }
}