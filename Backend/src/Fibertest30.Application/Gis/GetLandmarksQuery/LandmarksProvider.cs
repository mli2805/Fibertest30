using Iit.Fibertest.Graph;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Fibertest30.Application
{
    public class LandmarksProvider(Model writeModel, ISorFileRepository sorFileRepository,
        LandmarksBaseParser landmarksBaseParser, LandmarksGraphParser landmarksGraphParser)
    {
        public async Task<List<Landmark>> GetLandmarks(Guid traceId)
        {
            var trace = writeModel.Traces.First(t => t.TraceId == traceId);

            var hasBaseRef = trace.PreciseId != Guid.Empty;
            if (hasBaseRef)
            {
                var sorData = await GetBase(trace.PreciseId);
                var traceModel = writeModel.GetTraceComponentsByIds(trace);
                return landmarksBaseParser.GetLandmarksFromBaseRef(sorData, traceModel);
            }
            else
            {
                return landmarksGraphParser.GetLandmarksFromGraph(trace);
            }
        }

        private async Task<OtdrDataKnownBlocks> GetBase(Guid preciseId)
        {
            var baseRef = writeModel.BaseRefs.First(b => b.Id == preciseId);
            var sorBytes = await sorFileRepository.GetSorBytesAsync(baseRef.SorFileId);
            return Iit.Fibertest.UtilsLib.SorData.FromBytes(sorBytes!);
        }
    }
}
