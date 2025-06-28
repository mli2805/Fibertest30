using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Fibertest30.Application;

// Singleton который будет хранить модель между запросами клиента
public class LandmarksModelManager(ILogger<LandmarksModelManager> logger, IServiceScopeFactory serviceScopeFactory)
{
    // Guid - рандомный id созданный на клиенте, чтобы обращаться к определенной модели
    // Ориентиры не модальная форма, каждый клиент может создать более одной
    private readonly ConcurrentDictionary<Guid, LandmarksModel> _models = new();

    // если клик на рту - присылай первую трассу
    // если на узле и там более одной трассы - выбери трассу и присылай
    public async Task<LandmarksModel?> Create(Guid modelId, Guid traceId, GpsInputMode gpsInputMode)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var model = new LandmarksModel();
        if (await model.Initialize(scope, modelId, traceId, gpsInputMode))
        {
            _models.AddOrUpdate(modelId, _ => model, (_, _) => model);
            return model;
        }

        return null;
    }

    public LandmarksModel? Get(Guid modelId)
    {
        bool _ = _models.TryGetValue(modelId, out LandmarksModel? model);
        return model;
    }

    public async Task<LandmarksModel?> UpdateOneLandmark(Guid modelId, ColoredLandmark changedLandmark)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        using var scope = serviceScopeFactory.CreateScope();
        return await model!.UpdateOneLandmark(changedLandmark, scope);
    }

    public LandmarksModel? UpdateFilterEmptyNodes(Guid modelId, bool isFilterOn)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        return model!.UpdateFilterEmptyNodes(isFilterOn);
    }
    
    public LandmarksModel? UpdateGpsInputMode(Guid modelId, GpsInputMode gpsInputMode)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        return model!.UpdateGpsInputMode(gpsInputMode);
    }

    public LandmarksModel? CancelChanges(Guid modelId)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        return model!.CancelAllRowsChanges();
    }

    public void DeleteModel(Guid modelId)
    {
        _models.TryRemove(modelId, out LandmarksModel? _);
    }
}