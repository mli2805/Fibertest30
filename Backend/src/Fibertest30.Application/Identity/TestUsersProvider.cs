namespace Fibertest30.Application;

public static class TestUsersProvider
{
    public static List<TestUser> TestUsers =>
        new()
        {
            new TestUser
            {
                Role = ApplicationDefaultRole.Root,
                UserName = "root",
                FirstName = "Alex",
                LastName = "Khazanov",
                JobTitle = "Product Manager",
                Email = "a.khazanov@yandex.by",
                PhoneNumber = "+1234567890"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.Operator,
                UserName = "spetrov",
                FirstName = "Сергей",
                LastName = "Петров",
                JobTitle = "Оператор 1 смены",
                Email = "s.petrov@yandex.by",
                PhoneNumber = "+1234567891"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.Supervisor,
                UserName = "vkuznetzov",
                FirstName = "Владимир",
                LastName = "Кузнецов",
                JobTitle = "Надсмотрщик",
                Email = "v.kuznetzov@yandex.by",
                PhoneNumber = string.Empty
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.NotificationReceiver,
                UserName = "mhavlicek",
                FirstName = "Martin",
                LastName = "Havlicek",
                JobTitle = string.Empty,
                Email = "m.havlicek@yandex.com",
                PhoneNumber = string.Empty
            }
        };

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

    // public static readonly string DefaultAdminPassword = "admin";
    public static readonly string DefaultRootPassword = "root";

    public static TestUser GetFirstUserByRole(ApplicationDefaultRole role)
    {
        return TestUsers.First(x => x.Role == role);
    }
}