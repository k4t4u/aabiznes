using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Data;
using SolutionOrders.API.Dtos;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(AppDbContext context, ILogger<ProductsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetAll()
    {
        _logger.LogInformation("Pobieranie listy produktów");

        var products = await _context.Products
            .Include(p => p.Category)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .ToListAsync();

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(string id)
    {
        _logger.LogInformation("Pobieranie produktu o id {ProductId}", id);

        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                CategoryId = p.CategoryId,
                CategoryName = p.Category != null ? p.Category.Name : string.Empty
            })
            .FirstOrDefaultAsync();

        if (product is null)
        {
            _logger.LogWarning("Nie znaleziono produktu o id {ProductId}", id);
            return NotFound();
        }

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto)
    {
        _logger.LogInformation(
            "Tworzenie produktu: {ProductName}, categoryId: {CategoryId}",
            dto.Name,
            dto.CategoryId);

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            _logger.LogWarning(
                "Nie można utworzyć produktu {ProductName}, bo nie istnieje kategoria {CategoryId}",
                dto.Name,
                dto.CategoryId);

            return BadRequest("Podana kategoria nie istnieje.");
        }

        var product = new Product
        {
            Id = $"p{Guid.NewGuid():N}"[..10],
            Name = dto.Name,
            Price = dto.Price,
            CategoryId = dto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var category = await _context.Categories.FirstAsync(c => c.Id == product.CategoryId);

        var result = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            CategoryId = product.CategoryId,
            CategoryName = category.Name
        };

        _logger.LogInformation("Produkt {ProductId} został utworzony", product.Id);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> Update(string id, CreateProductDto dto)
    {
        _logger.LogInformation("Aktualizacja produktu o id {ProductId}", id);

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            _logger.LogWarning("Nie znaleziono produktu do aktualizacji o id {ProductId}", id);
            return NotFound();
        }

        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == dto.CategoryId);
        if (!categoryExists)
        {
            _logger.LogWarning(
                "Nie można zaktualizować produktu {ProductId}, bo nie istnieje kategoria {CategoryId}",
                id,
                dto.CategoryId);

            return BadRequest("Podana kategoria nie istnieje.");
        }

        product.Name = dto.Name;
        product.Price = dto.Price;
        product.CategoryId = dto.CategoryId;

        await _context.SaveChangesAsync();

        var category = await _context.Categories.FirstAsync(c => c.Id == product.CategoryId);

        var result = new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Price = product.Price,
            CategoryId = product.CategoryId,
            CategoryName = category.Name
        };

        _logger.LogInformation("Produkt {ProductId} został zaktualizowany", id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Usuwanie produktu o id {ProductId}", id);

        var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        if (product is null)
        {
            _logger.LogWarning("Nie znaleziono produktu do usunięcia o id {ProductId}", id);
            return NotFound();
        }

        var usedInOrderItems = await _context.OrderItems.AnyAsync(oi => oi.ProductId == id);
        if (usedInOrderItems)
        {
            _logger.LogWarning(
                "Nie można usunąć produktu {ProductId}, bo jest używany w OrderItems",
                id);

            return BadRequest("Nie można usunąć produktu używanego w pozycjach zamówień.");
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Produkt {ProductId} został usunięty", id);

        return NoContent();
    }
}