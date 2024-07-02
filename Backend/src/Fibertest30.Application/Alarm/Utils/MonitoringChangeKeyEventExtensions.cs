using Optixsoft.FiberizerModel.Utils;
using Optixsoft.SorExaminer.DomainModel.Sor;

namespace Fibertest30.Application;

public static class MonitoringChangeKeyEventExtensions
{
    public static MonitoringChangeKeyEvent? GetMonitoringChangeKeyEvent(this SorData sorData, int keyEventIndex)
    {
        if (keyEventIndex < 0 || keyEventIndex >= sorData.KeyEvents.Count)
        {
            return null;
        }

        var keyEvent = sorData.KeyEvents[keyEventIndex];
        var owtToDistance = sorData.GetTransform(Space.Owt, Space.Distance);

        return new MonitoringChangeKeyEvent()
        {
            KeyEventIndex = keyEventIndex,
            DistanceMeters = owtToDistance.TransformX(keyEvent.EventPropagationTime).Value * 1000,
            EventLoss = keyEvent.IsLossCalculable ? keyEvent.EventLoss.Value : null,
            EventReflectance  = new QualifiedValue(
                keyEvent.EventReflectance.Value,
                QualifiedValueExtension.FromReflectanceProperties(keyEvent.IsReflective, keyEvent.IsClipped)),
            SectionAttenuation = keyEvent.LeadInFiberAttenuationCoefficient.ToDbByKm(sorData.RefractionIndex).Value,
              
            IsClipped = keyEvent.IsClipped,
            IsReflective = keyEvent.IsReflective,
            
            Comment = keyEvent.Comment ?? string.Empty
        };
    }
}