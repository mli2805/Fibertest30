using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.UtilsLib;

namespace Fibertest30.Application;

public class FiberInfoProvider(Model writeModel, ISorFileRepository sorFileRepository)
{
    public async Task<FiberInfo> GetFiberInfo(Guid fiberId)
    {
        var fiber = writeModel.Fibers.First(f => f.FiberId == fiberId);
        var calc = new GraphGpsCalculator(writeModel);
        var result = new FiberInfo()
        {
            FiberId = fiberId,
            GpsLength = calc.GetFiberFullGpsDistance(fiberId, out Node node1, out Node node2),
            UserInputedLength = fiber.UserInputedLength
        };

        foreach (Trace trace in writeModel.Traces)
        {
            var index = trace.FiberIds.IndexOf(fiberId);
            if (index == -1) continue;

            var realIndex = GetRealFiberIndex(trace, index);
            result.TracesThrough.Add(new OpticalLength(trace.TraceId, await GetOpticalLength(trace, realIndex)));

            if (trace.IsIncludedInMonitoringCycle)
            {
                var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == trace.RtuId);
                if (rtu == null) continue;
                if (rtu.MonitoringState == MonitoringState.On)
                    result.HasTraceUnderMonitoring = true;
            }
        }

        return result;
    }

    private int GetRealFiberIndex(Trace trace, int fiberIndexWithAdjustmentPoints)
    {
        var counter = 0;

        for (int i = 1; i <= fiberIndexWithAdjustmentPoints; i++)
        {
            var equipment = writeModel.Equipments.First(e => e.EquipmentId == trace.EquipmentIds[i]);
            if (equipment.Type != EquipmentType.AdjustmentPoint)
                counter++;
        }

        return counter;
    }

    private async Task<double> GetOpticalLength(Trace trace, int index)
    {
        if (trace.PreciseId == Guid.Empty)
            return 0;
        var sorFileId = writeModel.BaseRefs.First(b => b.Id == trace.PreciseId).SorFileId;
        var sorBytes = await sorFileRepository.GetSorBytesAsync(sorFileId);
        if (sorBytes == null) return 0;

        var otdrKnownBlocks = SorData.FromBytes(sorBytes);
        return otdrKnownBlocks.GetDistanceBetweenLandmarksInMm(index, index + 1) / 1000;
    }
}