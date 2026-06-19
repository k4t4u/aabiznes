namespace SolutionOrders.API.Models;

public class Category
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;

    public List<Product> Products { get; set; } = new();
}