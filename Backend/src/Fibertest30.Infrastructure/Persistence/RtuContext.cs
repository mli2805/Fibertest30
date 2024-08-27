using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Fibertest30.Infrastructure;

public class RtuContext : IdentityDbContext<ApplicationUser>
{
    public RtuContext() { /* Empty ctor for EF Moq */ }
    public RtuContext(DbContextOptions<RtuContext> options) : base(options) { }
    public DbSet<UserSettings> UserSettings { get; set; }
    public DbSet<SystemEventEf> SystemEvents { get; set; }
    public DbSet<UserSystemNotificationEf> UserSystemNotifications { get; set; }
    public DbSet<NotificationSettingsEf> NotificationSettings { get; set; }
    
  

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }
}
