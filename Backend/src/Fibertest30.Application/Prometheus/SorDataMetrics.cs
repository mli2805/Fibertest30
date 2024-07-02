using Optixsoft.FiberizerModel.Utils;
using Optixsoft.SorExaminer.DomainModel.Sor;
using System.Diagnostics;

namespace Fibertest30.Application;

public class SorDataMetrics
{
    public (double totalLoss, double totalOrl) CumulativeStats { get; }
    public (int index, double loss, double reflectance)[]? FiberEvents { get; }
    public (int index, double attenuation, double loss)[]? FiberSections { get; }

    public SorDataMetrics(SorData sorData)
    {
        var ri = sorData.RefractionIndex;
        var transform = sorData.GetTransform(Space.Owt, Space.Distance);

        var eventTableRows = new List<(MyEvent e, bool isSegment)>(sorData.KeyEvents.Count * 2);

        foreach (var mergedEvents in sorData.KeyEvents.ToMergedEvents())
        {
            var firstMergedEvent = mergedEvents[0];
            if (firstMergedEvent.IsBeginOfFiber && !firstMergedEvent.IsBeginOfFiberWithLoss)
            {
                /* don't show section for BeginOfFiber if it doesn't have it*/
            }
            else
            {
                eventTableRows.Add((firstMergedEvent,true));
            }
            eventTableRows.Add((firstMergedEvent, false));
        }

        var sections = new List<(double from, double till, double attenuation, double loss)>(eventTableRows.Count / 2 + 1);
        for (var i = eventTableRows[0].isSegment ? 2 : 1; i < eventTableRows.Count; i += 2)
        {
            Debug.Assert(!eventTableRows[i - 1].isSegment);
            Debug.Assert(eventTableRows[i].isSegment);
            Debug.Assert(!eventTableRows[i + 1].isSegment);

            var sectionAttenuation = eventTableRows[i].e.LeadInFiberAttenuationCoefficient.ToDbByKm(ri);
            var fiberLength = eventTableRows[i].e.LeadInSegmentLength.ToLen(ri);
            
            var loss = (double)(sectionAttenuation.Value * fiberLength);

            var from = transform.TransformX(eventTableRows[i - 1].e.EventPropagationTime).Value;
            var till = transform.TransformX(eventTableRows[i + 1].e.EventPropagationTime).Value;

            sections.Add((from, till, sectionAttenuation.Value, loss));
        }

        var totalLoss = sorData.Span.GetLoss();
        var totalOrl = sorData.OpticalReturnLoss.Value;

        CumulativeStats = (totalLoss, totalOrl);

        var spanDistance = sorData.Span.GetDistance();
        if (Math.Abs(spanDistance) < 1e-5 || sections.Count == 0)
        {
            // invalid data
            return;
        }

        // exclude the Fiber begin (the first event) & EOF (the last event)
        FiberEvents = eventTableRows.Where(r => !r.isSegment).Select(r => r.e)
            .Skip(1).SkipLast(1)
            .Select((e, i) => (i + 1, e.EventLoss.Value, e.EventReflectance.Value)).ToArray();

        FiberSections = sections.Select((s, i) => (i + 1, s.attenuation, s.loss)).ToArray();
    }
}