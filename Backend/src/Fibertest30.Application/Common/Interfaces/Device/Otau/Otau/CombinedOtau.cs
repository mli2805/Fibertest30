namespace Fibertest30.Application;

public class CombinedOtau
{
    public Otau Otau { get; init; }
    public OtauInfo OtauInfo { get; init; }
    
    public CombinedOtau(Otau otau, OtauInfo otauInfo)
    {
        Otau = otau;
        OtauInfo = otauInfo;
    }
}