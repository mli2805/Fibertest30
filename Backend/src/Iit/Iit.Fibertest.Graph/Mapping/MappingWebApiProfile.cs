﻿using AutoMapper;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public class MappingWebApiProfile : Profile
    {
        public MappingWebApiProfile()
        {
            CreateMap<AccidentLineModel, AccidentLineDto>();
            CreateMap<Measurement, TraceStateDto>()
                .ForMember(dest => dest.RegistrationTimestamp,
                    opt => opt.MapFrom(src => src.EventRegistrationTimestamp))
                .ForMember(dest => dest.Accidents,
                    opt => opt.Ignore());

            CreateMap<UpdateMeasurementDto, UpdateMeasurement>();
            CreateMap<UpdateMeasurement, UpdateMeasurementDto>();

            CreateMap<NetworkEvent, NetworkEventDto>()
                .ForMember(dest => dest.EventId, opt => opt.MapFrom(src => src.Ordinal))
                .ForMember(dest => dest.EventRegistrationTimestamp, opt => opt.MapFrom(src => src.EventTimestamp));

            CreateMap<BopNetworkEvent, BopEventDto>()
                .ForMember(dest => dest.EventId,
                    opt => opt
                        .MapFrom(src => src.Ordinal))
                .ForMember(dest=> dest.BopAddress,
                    opt=> opt
                        .MapFrom(src => src.OtauIp + @" : " + src.TcpPort))
                .ForMember(dest => dest.EventRegistrationTimestamp,
                    opt => opt
                        .MapFrom(src => src.EventTimestamp))
                .ForMember(dest => dest.BopState,
                    opt => opt
                        .MapFrom(src => src.IsOk));

            CreateMap<RtuAccident, RtuAccidentDto>();
        }
    }
}
