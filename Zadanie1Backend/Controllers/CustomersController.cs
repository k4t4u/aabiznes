using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Data;
using SolutionOrders.API.Dtos;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(AppDbContext context, ILogger<CustomersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CustomerDto>>> GetAll()
    {
        _logger.LogInformation("Pobieranie listy klientów");

        var customers = await _context.Customers
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email
            })
            .ToListAsync();

        return Ok(customers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CustomerDto>> GetById(string id)
    {
        _logger.LogInformation("Pobieranie klienta o id {CustomerId}", id);

        var customer = await _context.Customers
            .Where(c => c.Id == id)
            .Select(c => new CustomerDto
            {
                Id = c.Id,
                FirstName = c.FirstName,
                LastName = c.LastName,
                Email = c.Email
            })
            .FirstOrDefaultAsync();

        if (customer is null)
        {
            _logger.LogWarning("Nie znaleziono klienta o id {CustomerId}", id);
            return NotFound();
        }

        return Ok(customer);
    }

    [HttpPost]
    public async Task<ActionResult<CustomerDto>> Create(CreateCustomerDto dto)
    {
        _logger.LogInformation(
            "Tworzenie klienta {FirstName} {LastName}",
            dto.FirstName,
            dto.LastName);

        var customer = new Customer
        {
            Id = $"c{Guid.NewGuid():N}"[..10],
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email
        };

        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();

        var result = new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email
        };

        _logger.LogInformation("Klient {CustomerId} został utworzony", customer.Id);

        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CustomerDto>> Update(string id, CreateCustomerDto dto)
    {
        _logger.LogInformation("Aktualizacja klienta o id {CustomerId}", id);

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
        if (customer is null)
        {
            _logger.LogWarning("Nie znaleziono klienta do aktualizacji o id {CustomerId}", id);
            return NotFound();
        }

        customer.FirstName = dto.FirstName;
        customer.LastName = dto.LastName;
        customer.Email = dto.Email;

        await _context.SaveChangesAsync();

        var result = new CustomerDto
        {
            Id = customer.Id,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            Email = customer.Email
        };

        _logger.LogInformation("Klient {CustomerId} został zaktualizowany", id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Usuwanie klienta o id {CustomerId}", id);

        var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == id);
        if (customer is null)
        {
            _logger.LogWarning("Nie znaleziono klienta do usunięcia o id {CustomerId}", id);
            return NotFound();
        }

        var usedByOrders = await _context.Orders.AnyAsync(o => o.CustomerId == id);
        if (usedByOrders)
        {
            _logger.LogWarning(
                "Nie można usunąć klienta {CustomerId}, bo ma przypisane zamówienia",
                id);

            return BadRequest("Nie można usunąć klienta, który ma przypisane zamówienia.");
        }

        _context.Customers.Remove(customer);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Klient {CustomerId} został usunięty", id);

        return NoContent();
    }
}