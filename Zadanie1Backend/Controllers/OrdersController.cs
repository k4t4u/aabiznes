using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Data;
using SolutionOrders.API.Dtos;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll()
    {
        _logger.LogInformation("Pobieranie listy zamówień");

        var orders = await _context.Orders
            .Include(o => o.Customer)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer != null
                    ? $"{o.Customer.FirstName} {o.Customer.LastName}"
                    : string.Empty,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetById(string id)
    {
        _logger.LogInformation("Pobieranie zamówienia o id {OrderId}", id);

        var order = await _context.Orders
            .Include(o => o.Customer)
            .Where(o => o.Id == id)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                CustomerId = o.CustomerId,
                CustomerName = o.Customer != null
                    ? $"{o.Customer.FirstName} {o.Customer.LastName}"
                    : string.Empty,
                Status = o.Status,
                CreatedAt = o.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (order is null)
        {
            _logger.LogWarning("Nie znaleziono zamówienia o id {OrderId}", id);
            return NotFound();
        }

        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderDto dto)
    {
        _logger.LogInformation(
            "Tworzenie zamówienia dla klienta {CustomerId}",
            dto.CustomerId);

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == dto.CustomerId);
        if (customer is null)
        {
            _logger.LogWarning(
                "Nie można utworzyć zamówienia, bo nie istnieje klient {CustomerId}",
                dto.CustomerId);

            return BadRequest("Podany klient nie istnieje.");
        }

        var order = new Order
        {
            Id = $"o{Guid.NewGuid():N}"[..10],
            CustomerId = dto.CustomerId,
            Status = dto.Status,
            CreatedAt = dto.CreatedAt
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        var result = new OrderDto
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            CustomerName = $"{customer.FirstName} {customer.LastName}",
            Status = order.Status,
            CreatedAt = order.CreatedAt
        };

        _logger.LogInformation("Zamówienie {OrderId} zostało utworzone", order.Id);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> Update(string id, CreateOrderDto dto)
    {
        _logger.LogInformation("Aktualizacja zamówienia o id {OrderId}", id);

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order is null)
        {
            _logger.LogWarning("Nie znaleziono zamówienia do aktualizacji o id {OrderId}", id);
            return NotFound();
        }

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == dto.CustomerId);
        if (customer is null)
        {
            _logger.LogWarning(
                "Nie można zaktualizować zamówienia {OrderId}, bo nie istnieje klient {CustomerId}",
                id,
                dto.CustomerId);

            return BadRequest("Podany klient nie istnieje.");
        }

        order.CustomerId = dto.CustomerId;
        order.Status = dto.Status;
        order.CreatedAt = dto.CreatedAt;

        await _context.SaveChangesAsync();

        var result = new OrderDto
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            CustomerName = $"{customer.FirstName} {customer.LastName}",
            Status = order.Status,
            CreatedAt = order.CreatedAt
        };

        _logger.LogInformation("Zamówienie {OrderId} zostało zaktualizowane", id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Usuwanie zamówienia o id {OrderId}", id);

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);
        if (order is null)
        {
            _logger.LogWarning("Nie znaleziono zamówienia do usunięcia o id {OrderId}", id);
            return NotFound();
        }

        var usedByOrderItems = await _context.OrderItems.AnyAsync(oi => oi.OrderId == id);
        if (usedByOrderItems)
        {
            _logger.LogWarning(
                "Nie można usunąć zamówienia {OrderId}, bo ma przypisane pozycje",
                id);

            return BadRequest("Nie można usunąć zamówienia, które ma pozycje.");
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Zamówienie {OrderId} zostało usunięte", id);

        return NoContent();
    }
}