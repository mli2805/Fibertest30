using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public static class ReSendDtoExt
    {
        public static IEnumerable<AssignBaseRefsDto> CreateReSendDtos(
            this Model model, RtuInitializedDto rtuInitializedDto)
        {
            foreach (var trace in model.Traces
                         .Where(t => t.RtuId == rtuInitializedDto.RtuId && t.IsAttached && t.HasAnyBaseRef))
            {
                var dto = new AssignBaseRefsDto()
                {
                    RtuId = rtuInitializedDto.RtuId,
                    RtuMaker = rtuInitializedDto.Maker,
                    OtdrId = rtuInitializedDto.OtdrId,
                    TraceId = trace.TraceId,
                    OtauPortDto = trace.OtauPort!,
                    BaseRefs = new List<BaseRefDto>(),
                };
                foreach (var baseRef in model.BaseRefs.Where(b => b.TraceId == trace.TraceId))
                {
                    dto.BaseRefs.Add(new BaseRefDto()
                    {
                        SorFileId = baseRef.SorFileId,

                        Id = baseRef.TraceId,
                        BaseRefType = baseRef.BaseRefType,
                        Duration = baseRef.Duration,
                        SaveTimestamp = baseRef.SaveTimestamp,
                        UserName = baseRef.UserName,
                    });
                }
                yield return dto;
            }
        }
    }
}