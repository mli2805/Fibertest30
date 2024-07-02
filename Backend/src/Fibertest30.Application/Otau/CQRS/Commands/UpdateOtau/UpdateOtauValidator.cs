using FluentValidation;

namespace Fibertest30.Application;

public class UpdateOtauValidator : AbstractValidator<UpdateOtauCommand>
{
    public UpdateOtauValidator()
    {
        RuleFor(x => x.Patch).NotNull();
        RuleFor(x => x.Patch).Must(HaveAtLeastOnePropertySet);
    }

    private bool HaveAtLeastOnePropertySet(OtauPatch patch)
    {
        return patch.GetType()
            .GetProperties()
            .Any(prop => prop.GetValue(patch) != null);
    }
}