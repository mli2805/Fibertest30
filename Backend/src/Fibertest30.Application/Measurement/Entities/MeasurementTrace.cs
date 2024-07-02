using Optixsoft.SorExaminer;
using Optixsoft.SorExaminer.DomainModel.Sor;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Fibertest30.Application;

public class MeasurementTrace
{
    private readonly Lazy<OtdrDataKnownBlocks> _otdrData;
    private readonly Lazy<SorData> _sorData;

    public OtdrDataKnownBlocks OtdrData => _otdrData.Value;
    public SorData SorData => _sorData.Value;
    public byte[] SorBytes { get; init; }

    public MeasurementTrace(byte[] sor)
    {
        SorBytes = sor;
        
        _otdrData = new Lazy<OtdrDataKnownBlocks>(() => SorBytes.ToSorData());
        _sorData = new Lazy<SorData>(() => OtdrData.ToFiberizerModel());
    }
}