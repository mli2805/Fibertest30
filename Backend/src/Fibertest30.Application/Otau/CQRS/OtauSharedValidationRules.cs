using FluentValidation;

namespace Fibertest30.Application;

public static class OtauSharedValidationRules
{
    public static void ValidateChainAddress<T>(IRuleBuilder<T, int> ruleBuilder)
    {
        // Osm switch itself has 8 pins, and could be setup in range [0; 255]
        // But our system supports only [1;16], because 16 is a max built-in switch that OCM could have
        ruleBuilder.InclusiveBetween(1, 16);
    }
}