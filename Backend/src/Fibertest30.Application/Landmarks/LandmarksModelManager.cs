using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Fibertest30.Application;

// Singleton который будет хранить модели между запросами клиентов
public class LandmarksModelManager(ILogger<LandmarksModelManager> logger, IServiceScopeFactory serviceScopeFactory)
{
    // Guid - рандомный id созданный на клиенте, чтобы обращаться к определенной модели
    // Ориентиры не модальная форма, каждый клиент может создать более одной
    private readonly ConcurrentDictionary<Guid, LandmarksModel> _models = new();

    // если клик на рту - присылай первую трассу
    // если на узле и там более одной трассы - выбери трассу и присылай
    public async Task<LandmarksModel?> Create(Guid modelId, Guid traceId)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var model = new LandmarksModel();
        if (await model.Initialize(scope, modelId, traceId))
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

    public LandmarksModel? CancelOneRowChanges(Guid modelId, int row)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        return model!.CancelOneRowChanges(row, serviceScopeFactory);
    }
    
    public LandmarksModel? CancelAllChanges(Guid modelId)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) return null;

        return model!.CancelAllRowsChanges();
    }

    public void DeleteModel(Guid modelId)
    {
        _models.TryRemove(modelId, out LandmarksModel? _);
    }

    public Task SaveAllChanges(List<Guid> modelIds)
    {
        using var scope = serviceScopeFactory.CreateScope();

        foreach (var modelId in modelIds)
        {
            var result = _models.TryGetValue(modelId, out LandmarksModel? model);
            if (!result) continue;

            model!.SaveAllChanges(scope);
        }
        return Task.CompletedTask;
    }
}