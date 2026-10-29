
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend2.Data;
using backend2.Models;

namespace backend2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SecurityPersonnelController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SecurityPersonnelController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class CreateSecurityPersonnelDto
        {
            public string FirebaseUid { get; set; } = string.Empty;
            public string UserNumber { get; set; } = string.Empty;
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string EmployeeNumber { get; set; } = string.Empty;
            public string AssignedShift { get; set; } = "Day";
        }

        public class UpdateSecurityPersonnelDto
        {
            public string Name { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string UserNumber { get; set; } = string.Empty;
            public string EmployeeNumber { get; set; } = string.Empty;
            public string AssignedShift { get; set; } = "Day";
        }

        // GET: api/SecurityPersonnel
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var personnel = await _context.SecurityPersonnel
                .Select(p => new
                {
                    p.UserId,
                    p.FirebaseUid,
                    p.UserNumber,
                    p.Name,
                    p.Email,
                    p.EmployeeNumber,
                    p.AssignedShift
                })
                .ToListAsync();

            return Ok(personnel);
        }

        // POST: api/SecurityPersonnel
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateSecurityPersonnelDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.FirebaseUid) ||
                string.IsNullOrWhiteSpace(dto.UserNumber) ||
                string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.EmployeeNumber) ||
                string.IsNullOrWhiteSpace(dto.AssignedShift))
            {
                return BadRequest("Please provide all required fields.");
            }

            var email = dto.Email.Trim();

            if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute()
                    .IsValid(email))
            {
                return BadRequest("Please provide a valid email address.");
            }

            var uidExists = await _context.Users
                .AnyAsync(u => u.FirebaseUid == dto.FirebaseUid);

            if (uidExists)
                return Conflict("This Firebase account is already registered.");

            var userNumberExists = await _context.Users
                .AnyAsync(u => u.UserNumber == dto.UserNumber);

            if (userNumberExists)
                return Conflict("This user number is already registered.");

            var employeeNumberExists = await _context.SecurityPersonnel
                .AnyAsync(p => p.EmployeeNumber == dto.EmployeeNumber);

            if (employeeNumberExists)
                return Conflict("This employee number is already registered.");

            var person = new SecurityPersonnel
            {
                FirebaseUid = dto.FirebaseUid.Trim(),
                UserNumber = dto.UserNumber.Trim(),
                Name = dto.Name.Trim(),
                Email = email,
                UserRole = "Security",
                EmployeeNumber = dto.EmployeeNumber.Trim(),
                AssignedShift = dto.AssignedShift.Trim(),
                IsParked = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.SecurityPersonnel.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetAll),
                new { id = person.UserId },
                new
                {
                    person.UserId,
                    person.UserNumber,
                    person.Name,
                    person.Email,
                    person.EmployeeNumber,
                    person.AssignedShift
                });
        }

        // PUT: api/SecurityPersonnel/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateSecurityPersonnelDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) ||
                string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.UserNumber) ||
                string.IsNullOrWhiteSpace(dto.EmployeeNumber) ||
                string.IsNullOrWhiteSpace(dto.AssignedShift))
            {
                return BadRequest("All fields are required.");
            }

            var person = await _context.SecurityPersonnel
                .FirstOrDefaultAsync(p => p.UserId == id);

            if (person == null)
                return NotFound("Security personnel record not found.");

            var email = dto.Email.Trim();
            var userNumber = dto.UserNumber.Trim();
            var employeeNumber = dto.EmployeeNumber.Trim();

            if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute()
                    .IsValid(email))
            {
                return BadRequest("Please provide a valid email address.");
            }

            if (await _context.Users.AnyAsync(u =>
                u.UserNumber == userNumber && u.UserId != id))
            {
                return Conflict("This user number is already registered.");
            }

            if (await _context.SecurityPersonnel.AnyAsync(p =>
                p.EmployeeNumber == employeeNumber && p.UserId != id))
            {
                return Conflict("This employee number is already registered.");
            }

            person.Name = dto.Name.Trim();
            person.Email = email;
            person.UserNumber = userNumber;
            person.EmployeeNumber = employeeNumber;
            person.AssignedShift = dto.AssignedShift.Trim();

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Security personnel updated successfully."
            });
        }

        // DELETE: api/SecurityPersonnel/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var person = await _context.SecurityPersonnel
                .FirstOrDefaultAsync(p => p.UserId == id);

            if (person == null)
                return NotFound("Security personnel record not found.");

            _context.SecurityPersonnel.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
