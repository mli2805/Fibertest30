using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;
using Iit.Fibertest.UtilsLib;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure
{
    public class BaseRefRepairman(ILogger<BaseRefRepairman> logger, Model writeModel,
        IRtuManager rtuManager, BaseRefLandmarksTool baseRefLandmarksTool,
        SorFileRepository sorFileRepository) : IBaseRefRepairman
    {
        public async Task<string?> AmendForTracesWhichUseThisNode(Guid nodeId)
        {
            var tracesWhichUseThisNode = writeModel.Traces
                .Where(t => t.NodeIds.Contains(nodeId) && t.HasAnyBaseRef).ToList();
            return await AmendBaseRefs(tracesWhichUseThisNode);
        }

        public async Task<string?> AmendForTracesFromRtu(Guid rtuId)
        {
            var traceFromRtu = writeModel.Traces.Where(t => t.RtuId == rtuId && t.HasAnyBaseRef).ToList();
            return await AmendBaseRefs(traceFromRtu);
        }

        public async Task<string?> ProcessUpdateEquipment(Guid equipmentId)
        {
            var tracesWhichUseThisEquipment = writeModel.Traces
                .Where(t => t.EquipmentIds.Contains(equipmentId) && t.HasAnyBaseRef).ToList();
            return await AmendBaseRefs(tracesWhichUseThisEquipment);
        }

        public async Task<string?> ProcessUpdateFiber(Guid fiberId)
        {
            var tracesWhichUseThisFiber = writeModel.GetTracesPassingFiber(fiberId).Where(t => t.HasAnyBaseRef).ToList();
            return await AmendBaseRefs(tracesWhichUseThisFiber);
        }

        public async Task<string?> ProcessNodeRemoved(List<Guid> traceIds)
        {
            var tracesWhichUsedThisNode = new List<Trace>();
            foreach (var id in traceIds)
            {
                var trace = writeModel.Traces.FirstOrDefault(t => t.TraceId == id);
                if (trace != null && trace.HasAnyBaseRef)
                    tracesWhichUsedThisNode.Add(trace);
            }
            return await AmendBaseRefs(tracesWhichUsedThisNode);
        }

        private async Task<string?> AmendBaseRefs(List<Trace> traces)
        {
            string? returnStr = null;
            foreach (var trace in traces)
            {
                var res = await AmendBaseRefsForOneTrace(trace);
                if (res.ReturnCode != ReturnCode.Ok)
                    returnStr = res.ErrorMessage;
            }

            return returnStr;
        }



        public async Task<RequestAnswer> AmendBaseRefsForOneTrace(Trace trace)
        {
            var listOfBaseRef = await GetBaseRefDtos(trace);

            if (!listOfBaseRef.Any())
                return new RequestAnswer()
                {
                    ReturnCode = ReturnCode.FailedToGetBaseRefs,
                    ErrorMessage = string.Format(Resources.SID_Can_t_get_base_refs_for_trace__0_,
                        trace.TraceId.First6())
                };

            foreach (var baseRefDto in listOfBaseRef.Where(b => b.SorFileId > 0))
            {
                var requestAnswer = Modify(trace, baseRefDto);
                if (requestAnswer.ReturnCode != ReturnCode.BaseRefsForTraceModifiedSuccessfully)
                    return requestAnswer;
                var saveResult = await sorFileRepository
                    .UpdateSorBytesAsync(baseRefDto.SorFileId, baseRefDto.SorBytes!);
                if (saveResult != null)
                    return new RequestAnswer()
                    {
                        ReturnCode = ReturnCode.FailedToSaveBaseRefs,
                        ErrorMessage = saveResult,
                    };
            }

            if (trace.OtauPort == null) // unattached trace
                return new RequestAnswer() { ReturnCode = ReturnCode.BaseRefsSavedSuccessfully };

            var rtu = writeModel.Rtus.FirstOrDefault(r => r.Id == trace.RtuId);
            if (rtu == null)
                return new RequestAnswer() { ReturnCode = ReturnCode.NoSuchRtu };

            if (rtu.IsAvailable)
            {
                var result = await rtuManager.TransmitBaseRefs(CreateAssignBaseRefsDto(rtu, trace, listOfBaseRef));
                if (result.ReturnCode != ReturnCode.BaseRefAssignedSuccessfully)
                    return new RequestAnswer()
                    {
                        ReturnCode = ReturnCode.FailedToSendBaseToRtu,
                        ErrorMessage = result.ErrorMessage,
                    };
            }
            else
            {
                return new RequestAnswer()
                {
                    ReturnCode = ReturnCode.FailedToSendBaseToRtu,
                };
            }

            return new RequestAnswer() { ReturnCode = ReturnCode.BaseRefsForTraceSentSuccessfully };
        }

        // вернет список dto где SorBytes не пустая
        private async Task<List<BaseRefDto>> GetBaseRefDtos(Trace trace)
        {
            var list = new List<BaseRef?>
            {
                writeModel.BaseRefs.FirstOrDefault(b => b.Id == trace.PreciseId),
                writeModel.BaseRefs.FirstOrDefault(b => b.Id == trace.FastId),
                writeModel.BaseRefs.FirstOrDefault(b => b.Id == trace.AdditionalId && b.BaseRefType == BaseRefType.Additional)
            };

            var listOfBaseRef = new List<BaseRefDto>();

            foreach (var baseRef in list)
            {
                if (baseRef == null) continue;
                var sorBytes = await sorFileRepository.GetSorBytesAsync(baseRef.SorFileId);
                if (sorBytes == null)
                    continue;
                listOfBaseRef.Add(baseRef.CreateFromBaseRef(sorBytes));
            }

            logger.LogInformation($"{listOfBaseRef.Count} base refs changed");
            return listOfBaseRef;
        }

        private RequestAnswer Modify(Trace trace, BaseRefDto baseRefDto)
        {
            try
            {
                var sorData = SorData.FromBytes(baseRefDto.SorBytes!);

                baseRefLandmarksTool.ApplyTraceToBaseRef(sorData, trace, false);

                baseRefDto.SorBytes = sorData.ToBytes();

                return new RequestAnswer() { ReturnCode = ReturnCode.BaseRefsForTraceModifiedSuccessfully };
            }
            catch (Exception e)
            {
                logger.LogError($"Amend base ref - Modify: {e.Message}");
                return new RequestAnswer() { ReturnCode = ReturnCode.FailedToModifyBaseRef, ErrorMessage = e.Message };
            }
        }

        private AssignBaseRefsDto CreateAssignBaseRefsDto(Rtu rtu, Trace trace, List<BaseRefDto> baseRefDtos)
        {
            return new AssignBaseRefsDto()
            {
                TraceId = trace.TraceId,
                RtuId = rtu.Id,
                RtuMaker = rtu.RtuMaker,
                OtdrId = rtu.OtdrId,
                OtauPortDto = trace.OtauPort,
                MainOtauPortDto = new OtauPortDto()
                {
                    OtauId = rtu.MainVeexOtau.id,
                    Serial = rtu.MainVeexOtau.serialNumber,
                    OpticalPort = trace.OtauPort!.MainCharonPort,
                    IsPortOnMainCharon = true,
                },
                BaseRefs = baseRefDtos,
            };
        }

    }
}
