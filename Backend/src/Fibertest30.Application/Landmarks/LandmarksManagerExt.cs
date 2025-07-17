using Iit.Fibertest.Graph;

namespace Fibertest30.Application
{
    public static class LandmarksManagerExt
    {
        public static IEnumerable<Trace> GetTracesInvolved(this Model writeModel, List<object> objects)
        {
            var traces = objects.Select(writeModel.GetTracesThrough).SelectMany(x => x).Distinct();
            return traces;
        }

        private static IEnumerable<Trace> GetTracesThrough(this Model writeModel, object obj)
        {
            switch (obj)
            {
                case UpdateAndMoveNode cmd:
                    return writeModel.Traces.Where(t => t.NodeIds.Contains(cmd.NodeId));
                case UpdateFiber cmd:
                    return writeModel.Traces.Where(t => t.FiberIds.Contains(cmd.Id));
                case UpdateEquipment cmd:
                    return writeModel.Traces.Where(t => t.EquipmentIds.Contains(cmd.EquipmentId));
                case IncludeEquipmentIntoTrace cmd:
                    return writeModel.Traces.Where(t => t.TraceId == cmd.TraceId);
            }

            // сюда не попадаем никогда
            return new List<Trace>();
        }
    }
}
