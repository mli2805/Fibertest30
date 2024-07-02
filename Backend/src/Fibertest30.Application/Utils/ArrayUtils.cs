namespace Fibertest30.Application;

public class ArrayUtils
{
    public static int FindClosest(IEnumerable<int> array, double value)
    {
        return array.Aggregate((currentClosest, current) => 
            Math.Abs(current - value) < Math.Abs(currentClosest - value) ? current : currentClosest);
    }
    
    public static double FindClosest(IEnumerable<double> array, double value)
    {
        return array.Aggregate((currentClosest, current) => 
            Math.Abs(current - value) < Math.Abs(currentClosest - value) ? current : currentClosest);
    }
    
    public static double FindFirstGreaterOrEqual(List<double> array, double value)
    {
        foreach (var current in array)
        {
            if (current >= value)
            {
                return current;
            }
        }

        return array.Last();
    }
}