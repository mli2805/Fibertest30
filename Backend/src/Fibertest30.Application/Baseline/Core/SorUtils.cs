using Optixsoft.PortableGeometry.Extensions;
using Optixsoft.SorExaminer.DomainModel.Sor;

namespace Fibertest30.Application;

public static class SorUtils
{
    public static double GetFirstGreaterOrEqualDistanceRange(SorData sorData,  List<double> sortedDistanceRanges) {
        var owtToDistance = sorData.GetTransform(Space.Owt, Space.Distance);
        var sorDistanceRange = owtToDistance.TransformX((double)sorData.GetDistanceRange());
        
        var closestDistanceRange = ArrayUtils.FindFirstGreaterOrEqual(sortedDistanceRanges, sorDistanceRange);
        return closestDistanceRange;
    }
}