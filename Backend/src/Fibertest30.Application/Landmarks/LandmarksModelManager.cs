﻿using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Concurrent;

namespace Fibertest30.Application;

// Singleton который будет хранить модели между запросами клиентов
public class LandmarksModelManager(IServiceScopeFactory serviceScopeFactory)
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

    public LandmarksModel UpdateOneLandmark(Guid modelId, ColoredLandmark changedLandmark)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) throw new ArgumentException();

        using var scope = serviceScopeFactory.CreateScope();
        return model!.UpdateOneLandmark(changedLandmark, scope);
    }

    public LandmarksModel UpdateFilterEmptyNodes(Guid modelId, bool isFilterOn)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) throw new ArgumentException();

        return model!.UpdateFilterEmptyNodes(isFilterOn);
    }

    public LandmarksModel CancelOneRowChanges(Guid modelId, int row)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) throw new ArgumentException();

        return model!.CancelOneRowChanges(row, serviceScopeFactory);
    }

    public LandmarksModel CancelAllChanges(Guid modelId)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) throw new ArgumentException();

        return model!.CancelAllRowsChanges();
    }

    public void DeleteModel(Guid modelId)
    {
        _models.TryRemove(modelId, out LandmarksModel? _);
    }

    public void SaveAllChanges(Guid modelId)
    {
        var result = _models.TryGetValue(modelId, out LandmarksModel? model);
        if (!result) throw new ArgumentException();

#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
        Task.Factory.StartNew(() => model!.SaveAllChanges(serviceScopeFactory));
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
    }
}