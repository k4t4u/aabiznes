namespace SolutionOrders.API.Dtos;

public class CreateOrderItemDto
{
    public string OrderId { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public int Quantity { get; set; }
}