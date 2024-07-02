using System.Text.RegularExpressions;

namespace Fibertest30.Application;

public static class UserValidationExt
{
    public static bool IsValidPhoneNumber(this string phoneNumber)
    {
        return new Regex("^\\+?[0-9]{5,15}$").IsMatch(phoneNumber);
    }

    public static bool IsValidPassword(this string password)
    {
        return new Regex("^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9])(?=.*[!@#$%^&*])[A-Za-z\\d!$%@#£€*?&]{8,}$").IsMatch(password);
    }
}