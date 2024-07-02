using FluentValidation;

namespace Fibertest30.Application;

public static partial class SharedValidationRules
{
    public static void ValidateIpAddress<T>(IRuleBuilder<T, string> ruleBuilder)
    {
        ruleBuilder.NotEmpty().WithMessage("IP Address must not be empty")
            .Must(BeAValidIpAddress).WithMessage("IP Address must be valid");
    }

    public static void ValidateTcpPort<T>(IRuleBuilder<T, int> ruleBuilder)
    {
        ruleBuilder.InclusiveBetween(1, 65535).WithMessage("Port must be between 1 and 65535");
    }
    
    private static bool BeAValidIpAddress(string ipAddress)
    {
        return System.Net.IPAddress.TryParse(ipAddress, out _);
    }
    
    
}