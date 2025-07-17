using FluentValidation;

namespace Fibertest30.Application.UnitTests;

[TestClass]
public class DateTimeFilterValidatorTests
{
    private class DateTimeFilterTestValidator : AbstractValidator<DateTimeFilter>
    {
        public DateTimeFilterTestValidator()
        {
            RuleFor(x => x).ValidateDateTimeFilter();
        }
    }
    
    private readonly DateTimeFilterTestValidator _validator = new DateTimeFilterTestValidator();

    [TestMethod]
    public void BothNull_Fail()
    {
        var df = new DateTimeFilter
        {
            SearchWindow = null, 
            RelativeFromNow = null
        };
        
        var result = _validator.Validate(df);
        result.IsValid.Should().BeFalse();
    }
    
    [TestMethod]
    public void BothSet_Fail()
    {
        var df = new DateTimeFilter { 
            SearchWindow = new DateTimeRange
            {
                Start = DateTime.UtcNow, 
                End = DateTime.UtcNow.AddHours(1)
            }, 
            RelativeFromNow = TimeSpan.FromHours(1) };
        var result = _validator.Validate(df);
        result.IsValid.Should().BeFalse();
    }
    
    [TestMethod]
    public void OnlySearchWindow_Pass()
    {
        var df = new DateTimeFilter
        {
            SearchWindow = new DateTimeRange
            {
                Start = DateTime.UtcNow, 
                End = DateTime.UtcNow.AddHours(1)
            }, 
            RelativeFromNow = null
        };
        var result = _validator.Validate(df);
        result.IsValid.Should().BeTrue();
    }
    
    [TestMethod]
    public void OnlyRelativeFromNow_Pass()
    {
        var df = new DateTimeFilter
        {
            SearchWindow = null,
            RelativeFromNow = TimeSpan.FromHours(1)
        };
        var result = _validator.Validate(df);
        result.IsValid.Should().BeTrue();
    }
    
    [TestMethod]
    public void SearchWindowStartAfterEnd_Fail()
    {
        var df = new DateTimeFilter
        {
            SearchWindow = new DateTimeRange
            {
                Start = DateTime.UtcNow.AddHours(1), 
                End = DateTime.UtcNow
            }, 
            RelativeFromNow = null
        };
        var result = _validator.Validate(df);
        result.IsValid.Should().BeFalse();
    }
}