namespace Fibertest30.Application;

public static class TestUsersProvider
{
    public static List<TestUser> TestUsers =>
        new()
        {
            new TestUser
            {
                Role = ApplicationDefaultRole.Root,
                UserName = "akhazanov",
                FirstName = "Alex",
                LastName = "Khazanov",
                JobTitle = "Product Manager",
                Email = "a.khazanov@yandex.by",
                PhoneNumber = "+1234567890",
                Password = "1"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.Operator,
                UserName = "spetrov",
                FirstName = "������",
                LastName = "������",
                JobTitle = "�������� 1 �����",
                Email = "s.petrov@yandex.by",
                PhoneNumber = "+1234567891",
                Password = "1"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.Supervisor,
                UserName = "vkuznetzov",
                FirstName = "��������",
                LastName = "��������",
                JobTitle = "�����������",
                Email = "v.kuznetzov@yandex.by",
                PhoneNumber = string.Empty,
                Password = "1"
            },
            new TestUser
            {
                Role = ApplicationDefaultRole.NotificationReceiver,
                UserName = "mhavlicek",
                FirstName = "Martin",
                LastName = "Havlicek",
                JobTitle = string.Empty,
                Email = "m.havlicek@yandex.com",
                PhoneNumber = string.Empty,
                Password = "1"
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
        public string Password { get;  set; } = null!;
    }
}