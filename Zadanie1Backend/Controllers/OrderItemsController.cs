using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Data;
using SolutionOrders.API.Dtos;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderItemsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrderItemsController> _logger;

    public OrderItemsController(AppDbContext context, ILogger<OrderItemsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetAll()
    {
        _logger.LogInformation("Pobieranie listy pozycji zamówień");

        var orderItems = await _context.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                OrderId = oi.OrderId,
                OrderLabel = oi.Order != null ? $"Zamówienie {oi.Order.Id}" : string.Empty,
                ProductId = oi.ProductId,
                ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                Quantity = oi.Quantity
            })
            .ToListAsync();

        return Ok(orderItems);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderItemDto>> GetById(string id)
    {
        _logger.LogInformation("Pobieranie pozycji zamówienia o id {OrderItemId}", id);

        var orderItem = await _context.OrderItems
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .Where(oi => oi.Id == id)
            .Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                OrderId = oi.OrderId,
                OrderLabel = oi.Order != null ? $"Zamówienie {oi.Order.Id}" : string.Empty,
                ProductId = oi.ProductId,
                ProductName = oi.Product != null ? oi.Product.Name : string.Empty,
                Quantity = oi.Quantity
            })
            .FirstOrDefaultAsync();

        if (orderItem is null)
        {
            _logger.LogWarning("Nie znaleziono pozycji zamówienia o id {OrderItemId}", id);
            return NotFound();
        }

        return Ok(orderItem);
    }

    [HttpPost]
    public async Task<ActionResult<OrderItemDto>> Create(CreateOrderItemDto dto)
    {
        _logger.LogInformation(
            "Tworzenie pozycji zamówienia dla orderId {OrderId} i productId {ProductId}",
            dto.OrderId,
            dto.ProductId);

        if (dto.Quantity <= 0)
        {
            _logger.LogWarning("Nieprawidłowa ilość przy tworzeniu OrderItem: {Quantity}", dto.Quantity);
            return BadRequest("Ilość musi być większa od zera.");
        }

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == dto.OrderId);
        if (order is null)
        {
            _logger.LogWarning("Nie istnieje zamówienie {OrderId}", dto.OrderId);
            return BadRequest("Podane zamówienie nie istnieje.");
        }

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId);
        if (product is null)
        {
            _logger.LogWarning("Nie istnieje produkt {ProductId}", dto.ProductId);
            return BadRequest("Podany produkt nie istnieje.");
        }

        var orderItem = new OrderItem
        {
            Id = $"oi{Guid.NewGuid():N}"[..11],
            OrderId = dto.OrderId,
            ProductId = dto.ProductId,
            Quantity = dto.Quantity
        };

        _context.OrderItems.Add(orderItem);
        await _context.SaveChangesAsync();

        var result = new OrderItemDto
        {
            Id = orderItem.Id,
            OrderId = orderItem.OrderId,
            OrderLabel = $"Zamówienie {order.Id}",
            ProductId = orderItem.ProductId,
            ProductName = product.Name,
            Quantity = orderItem.Quantity
        };

        _logger.LogInformation("Pozycja zamówienia {OrderItemId} została utworzona", orderItem.Id);

        return CreatedAtAction(nameof(GetById), new { id = orderItem.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OrderItemDto>> Update(string id, CreateOrderItemDto dto)
    {
        _logger.LogInformation("Aktualizacja pozycji zamówienia o id {OrderItemId}", id);

        var orderItem = await _context.OrderItems.FirstOrDefaultAsync(oi => oi.Id == id);
        if (orderItem is null)
        {
            _logger.LogWarning("Nie znaleziono pozycji zamówienia do aktualizacji o id {OrderItemId}", id);
            return NotFound();
        }

        if (dto.Quantity <= 0)
        {
            _logger.LogWarning("Nieprawidłowa ilość przy aktualizacji OrderItem: {Quantity}", dto.Quantity);
            return BadRequest("Ilość musi być większa od zera.");
        }

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == dto.OrderId);
        if (order is null)
        {
            _logger.LogWarning(
                "Nie można zaktualizować OrderItem {OrderItemId}, bo nie istnieje zamówienie {OrderId}",
                id,
                dto.OrderId);

            return BadRequest("Podane zamówienie nie istnieje.");
        }

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.ProductId);
        if (product is null)
        {
            _logger.LogWarning(
                "Nie można zaktualizować OrderItem {OrderItemId}, bo nie istnieje produkt {ProductId}",
                id,
                dto.ProductId);

            return BadRequest("Podany produkt nie istnieje.");
        }

        orderItem.OrderId = dto.OrderId;
        orderItem.ProductId = dto.ProductId;
        orderItem.Quantity = dto.Quantity;

        await _context.SaveChangesAsync();

        var result = new OrderItemDto
        {
            Id = orderItem.Id,
            OrderId = orderItem.OrderId,
            OrderLabel = $"Zamówienie {order.Id}",
            ProductId = orderItem.ProductId,
            ProductName = product.Name,
            Quantity = orderItem.Quantity
        };

        _logger.LogInformation("Pozycja zamówienia {OrderItemId} została zaktualizowana", id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Usuwanie pozycji zamówienia o id {OrderItemId}", id);

        var orderItem = await _context.OrderItems.FirstOrDefaultAsync(oi => oi.Id == id);
        if (orderItem is null)
        {
            _logger.LogWarning("Nie znaleziono pozycji zamówienia do usunięcia o id {OrderItemId}", id);
            return NotFound();
        }

        _context.OrderItems.Remove(orderItem);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Pozycja zamówienia {OrderItemId} została usunięta", id);

        return NoContent();
    }
}