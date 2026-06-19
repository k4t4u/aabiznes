namespace SolutionOrders.API.Dtos;

public class CreateOrderDto
{
    public string CustomerId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}