namespace Fibertest30.Application;

public static class PortLabelNameNormalizerExtensions
{
    public static string NormalizePortLabelName(this string name)
    {
        return name.Trim();
    }
}