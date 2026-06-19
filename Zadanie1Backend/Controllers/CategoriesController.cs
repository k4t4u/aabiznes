using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolutionOrders.API.Data;
using SolutionOrders.API.Dtos;
using SolutionOrders.API.Models;

namespace SolutionOrders.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<CategoriesController> _logger;

    public CategoriesController(AppDbContext context, ILogger<CategoriesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        _logger.LogInformation("Pobieranie listy kategorii");

        var categories = await _context.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CategoryDto>> GetById(string id)
    {
        _logger.LogInformation("Pobieranie kategorii o id {CategoryId}", id);

        var category = await _context.Categories
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .FirstOrDefaultAsync();

        if (category is null)
        {
            _logger.LogWarning("Nie znaleziono kategorii o id {CategoryId}", id);
            return NotFound();
        }

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CreateCategoryDto dto)
    {
        _logger.LogInformation("Tworzenie kategorii o nazwie {CategoryName}", dto.Name);

        var category = new Category
        {
            Id = $"cat{Guid.NewGuid():N}"[..10],
            Name = dto.Name
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        var result = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        _logger.LogInformation("Kategoria {CategoryId} została utworzona", category.Id);

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<CategoryDto>> Update(string id, CreateCategoryDto dto)
    {
        _logger.LogInformation("Aktualizacja kategorii o id {CategoryId}", id);

        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category is null)
        {
            _logger.LogWarning("Nie znaleziono kategorii do aktualizacji o id {CategoryId}", id);
            return NotFound();
        }

        category.Name = dto.Name;
        await _context.SaveChangesAsync();

        var result = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };

        _logger.LogInformation("Kategoria {CategoryId} została zaktualizowana", id);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        _logger.LogInformation("Usuwanie kategorii o id {CategoryId}", id);

        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
        if (category is null)
        {
            _logger.LogWarning("Nie znaleziono kategorii do usunięcia o id {CategoryId}", id);
            return NotFound();
        }

        var usedByProducts = await _context.Products.AnyAsync(p => p.CategoryId == id);
        if (usedByProducts)
        {
            _logger.LogWarning(
                "Nie można usunąć kategorii {CategoryId}, bo jest używana przez produkty",
                id);

            return BadRequest("Nie można usunąć kategorii przypisanej do produktów.");
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Kategoria {CategoryId} została usunięta", id);

        return NoContent();
    }
}