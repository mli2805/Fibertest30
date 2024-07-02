namespace Fibertest30.Application;

public static class TestUsersProvider
{
    public class TestUser
    {
        public ApplicationDefaultRole Role { get; set; } 
        public string UserName { get;  set; } = null!;
        public string FirstName { get;  set; } = null!;
        public string LastName { get;  set; } = null!;
        
        public string JobTitle { get;  set; } = null!;
        public string Email { get;  set; } = null!;
        public string PhoneNumber { get;  set; } = null!;
    }
    public static List<TestUser> TestUsers =>
        new()
        {
            new TestUser
            {
                Role = ApplicationDefaultRole.Administrator,
                UserName = "admin",
                FirstName = "John",
                LastName = "Smith",
                JobTitle = "Project Supervisor",
                Email = "john.smith@veexinc.com",
                PhoneNumber = "+1234567890"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.User,
                UserName = "mdavis",
                FirstName = "Maria",
                LastName = "Davis",
                JobTitle = "RFTS Expert",
                Email = "maria.davis@veexinc.com",
                PhoneNumber = "+1234567891"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.User,
                UserName = "wjones",
                FirstName = "William",
                LastName = "Jones",
                JobTitle = "Fiber Installation Inspector",
                Email = "wjones@veexinc.com",
                PhoneNumber = string.Empty
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.Viewer,
                UserName = "lrodriguez",
                FirstName = "Luis",
                LastName = "Rodriguez",
                JobTitle = string.Empty,
                Email = "lrodriguez@veexinc.com",
                PhoneNumber = "+1234567896"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.NotificationReceiver,
                UserName = "gmartin",
                FirstName = "Greg",
                LastName = "Martin",
                JobTitle = string.Empty,
                Email = "greg.martin@veexinc.com",
                PhoneNumber = string.Empty
            }
        };

    public static readonly string DefaultAdminPassword = "admin";

    public static TestUser GetFirstUserByRole(ApplicationDefaultRole role)
    {
        return TestUsers.First(x => x.Role == role);
    }
}