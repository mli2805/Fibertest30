using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.UtilsLib;
using Microsoft.Extensions.DependencyInjection;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Fibertest30.Application;

public class LandmarksModel
{
    public Guid _landmarksModelId;

    private Trace? _selectedTrace;
    private bool _hasBaseRef;
    private bool _isFilterOn;
    private OtdrDataKnownBlocks? _sorData;

    // нужна для восстановления значений при нажатии Отменить
    private TraceModelForBaseRef _originalModel = null!;
    private TraceModelForBaseRef _changedModel = null!;

    // нужны для определения что изменилось,
    // использовать _originalLandmarkRows нельзя потому что там нет Node.Comment
    private List<Landmark> _originalLandmarks = null!;
    private List<Landmark> _changedLandmarks = null!;

    public List<ColoredLandmark> Rows { get; set; } = null!;
    private List<ColoredLandmark> _originalLandmarkRows = null!;

    private readonly UpdateFromLandmarksBatch _command = new();

    public async Task<bool> Initialize(IServiceScope scope, Guid landmarksModelId, Guid traceId)
    {
        _landmarksModelId = landmarksModelId;

        var writeModel = scope.ServiceProvider.GetRequiredService<Model>();
        var sorFileRepository = scope.ServiceProvider.GetRequiredService<ISorFileRepository>();

        _selectedTrace = writeModel.Traces.FirstOrDefault(t => t.TraceId == traceId);
        if (_selectedTrace == null) return false;

        _hasBaseRef = _selectedTrace.PreciseId != Guid.Empty;
        if (_hasBaseRef)
        {
            _sorData = await GetBase(writeModel, sorFileRepository, _selectedTrace.PreciseId);
            if (_sorData == null) return false;
        }

        // Clone() чтобы модели не были связаны с WriteModel и друг другом
        _changedModel = writeModel.GetTraceComponentsByIds(_selectedTrace).Clone();
        _originalModel = _changedModel.Clone();

        var landmarksBaseParser = scope.ServiceProvider.GetRequiredService<LandmarksBaseParser>();
        var landmarksGraphParser = scope.ServiceProvider.GetRequiredService<LandmarksGraphParser>();
        _changedLandmarks = _hasBaseRef
            ? landmarksBaseParser.GetLandmarksFromBaseRef(_sorData!, _changedModel)
            : landmarksGraphParser.GetLandmarksFromGraph(_selectedTrace);
        _originalLandmarks = _changedLandmarks.Clone();

        Rows = LandmarksToRows(_changedLandmarks, null, _isFilterOn);
        _originalLandmarkRows = Rows.Clone();
        return true;
    }

    private async Task<OtdrDataKnownBlocks?> GetBase(Model writeModel, ISorFileRepository sorFileRepository, Guid baseId)
    {
        var baseRef = writeModel.BaseRefs.First(b => b.Id == baseId);
        var sorBytes = await sorFileRepository.GetSorBytesAsync(baseRef.SorFileId);
        return sorBytes != null ? SorData.FromBytes(sorBytes) : null;
    }

    private List<ColoredLandmark> LandmarksToRows(
         List<Landmark> landmarks, List<ColoredLandmark>? oldLandmarkRows,
        bool withoutEmptyNodes)
    {
        var temp = withoutEmptyNodes
            ? landmarks.Where(l => l.EquipmentType != EquipmentType.EmptyNode)
            : landmarks;

        // do not search by NodeId - trace could go through the node twice (or more)
        return new(
            temp.Select(l => new ColoredLandmark()
                .FromLandmark(l, oldLandmarkRows?
                    .First(o => o.Number == l.Number))));
    }


    public async Task<LandmarksModel> UpdateOneLandmark(ColoredLandmark changedColoredLandmark, IServiceScope scope)
    {
        var hasRowChanges = false;

        var originalLandmark = _originalLandmarks.First(l => l.Number == changedColoredLandmark.Number);
        var changedLandmark = _changedLandmarks.First(l => l.Number == changedColoredLandmark.Number);
        changedColoredLandmark.ToLandmark(changedLandmark);

        var currentNode = _changedModel.NodeArray.First(n => n.NodeId == changedColoredLandmark.NodeId);
        if (originalLandmark.AreNodePropertiesChanged(changedLandmark))
        {
            currentNode.UpdateFrom(changedLandmark);
            _command.Add(currentNode);
            hasRowChanges = true;
        }

        if (!originalLandmark.UserInputLength.Equals(changedLandmark.UserInputLength))
        {
            var writeModel = scope.ServiceProvider.GetRequiredService<Model>();

            var currentFiber = _changedModel.FiberArray[changedLandmark.NumberIncludingAdjustmentPoints - 1];
            var allParts = writeModel.GetAllParts(currentFiber.FiberId);
            foreach (var fiberPartId in allParts)
            {
                var fiberPart = writeModel.Fibers.First(f => f.FiberId == fiberPartId);
                fiberPart.UserInputedLength = changedLandmark.IsUserInput ? changedLandmark.UserInputLength : 0;
            }
            _command.Add(currentFiber);
            hasRowChanges = true;
        }

        if (originalLandmark.AreEquipmentPropertiesChanged(changedLandmark))
        {
            var currentEquipment = _changedModel.EquipArray[changedLandmark.NumberIncludingAdjustmentPoints];
            currentEquipment.UpdateFrom(changedLandmark);
            _command.Add(currentEquipment);
            hasRowChanges = true;
        }

        if (hasRowChanges)
            Rows = ReCalculateLandmarks(scope);

        return this;
    }

    public LandmarksModel UpdateFilterEmptyNodes(bool isFilterOn)
    {
        _isFilterOn = isFilterOn;
        Rows = LandmarksToRows(_changedLandmarks, _originalLandmarkRows, _isFilterOn);
        return this;
    }

    public LandmarksModel CancelAllRowsChanges()
    {
        _changedModel = _originalModel.Clone();
        _changedLandmarks = _originalLandmarks.Clone();
        Rows = _originalLandmarkRows.Clone();

        return this;
    }

    private List<ColoredLandmark> ReCalculateLandmarks(IServiceScope scope)
    {
        // из-за изменения координат и пользовательских длин меняется колонка длина по GPS,
        // надо не собирать всю модель заново, а только расстояния пересчитать
        _changedModel = _changedModel.FillInGpsDistancesForTraceModel();

        // если есть сорка передвинуть ориентиры в сорке
        if (_hasBaseRef)
        {
            var withoutAdjustmentPoints = _changedModel.ExcludeAdjustmentPoints();
            var baseRefLandmarksTool = scope.ServiceProvider.GetRequiredService<BaseRefLandmarksTool>();
            baseRefLandmarksTool.ReCalculateLandmarksLocations(_sorData!, withoutAdjustmentPoints);
        }

        // заново извлечь ориентиры из изменившейся модели
        var landmarksBaseParser = scope.ServiceProvider.GetRequiredService<LandmarksBaseParser>();
        var landmarksGraphParser = scope.ServiceProvider.GetRequiredService<LandmarksGraphParser>();
        _changedLandmarks = _hasBaseRef
            ? landmarksBaseParser.GetLandmarksFromBaseRef(_sorData!, _changedModel)
            : landmarksGraphParser.GetLandmarksFromModel(_changedModel);

        return LandmarksToRows(_changedLandmarks, _originalLandmarkRows, _isFilterOn);
    }
}