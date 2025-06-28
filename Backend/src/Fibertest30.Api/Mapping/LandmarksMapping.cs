using AutoMapper;

namespace Fibertest30.Api;

public class LandmarksMappingProfile : Profile
{
    public LandmarksMappingProfile()
    {
        CreateMap<Iit.Fibertest.Graph.ColoredLandmark, ColoredLandmark>()
            .ForMember(d => d.EquipmentType,
                opt =>
                                opt.MapFrom(s => s.EquipmentType.ToProto()))
            .ForMember(d => d.GpsCoors,
                opt =>
                                opt.MapFrom(s => s.GpsCoors.ToProto()));
    }
}

public static class LandmarksMapping
{
    private static readonly IMapper _mapper =
        new MapperConfiguration(cfg => cfg.AddProfile<LandmarksMappingProfile>()).CreateMapper();
    public static LandmarksModel ToProto(this Application.LandmarksModel model)
    {
        var r = new LandmarksModel()
        {
            LandmarksModelId = model._landmarksModelId.ToString(),
            Landmarks = { model.Rows.Select(_mapper.Map<ColoredLandmark>) }
        };

        return r;
    }
}
