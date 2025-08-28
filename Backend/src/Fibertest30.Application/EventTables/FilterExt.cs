﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application;
public static class FilterExt
{
    public static bool Filter(this Measurement measurement, string filterRtu, string filterTrace, Model writeModel, Guid zondeId)
    {
        if (measurement.EventStatus == EventStatus.JustMeasurementNotAnEvent)
            return false;

        var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == measurement.RtuId);
        if (rtu == null
            || !rtu.ZoneIds.Contains(zondeId)
            || (!string.IsNullOrEmpty(filterRtu) && !rtu.Title.Contains(filterRtu)))
        {
            return false;
        }

        var trace = writeModel.Traces.FirstOrDefault(t => t.TraceId == measurement.TraceId);
        if (trace == null
            || !trace.ZoneIds.Contains(zondeId)
            || (!string.IsNullOrEmpty(filterTrace) && !trace.Title.Contains(filterTrace)))
        {
            return false;
        }
        return true;
    }
}
