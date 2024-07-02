namespace Fibertest30.Application;

public static class QualifiedValueExtension
{
    public static (bool IsReflective, bool IsClipped) ToReflectanceProperties(this ValueExactness exactness)
    {
        return (exactness != ValueExactness.AtMost, exactness == ValueExactness.AtLeast);
    }
    
    public static ValueExactness FromReflectanceProperties(bool isReflective, bool isClipped)
    {
        return (isReflective, isClipped) switch
        {
            (true, true) => ValueExactness.AtLeast,
            (true, false) => ValueExactness.Exact,
            (false, false) => ValueExactness.AtMost,
            
            // There was a bug in FiberizerModel, that does not set isReflective if isClipped is true
            // The bug was fixed, but FiberizerModel not yet updated, so let's handle this case here too
            // Anyway, it's safe to assume that if isClipped is true, we should behave the same as if isReflective is true
            (false, true) => ValueExactness.AtLeast 
        };
    }
}