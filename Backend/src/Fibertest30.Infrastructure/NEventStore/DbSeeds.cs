﻿using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;

namespace Fibertest30.Infrastructure;

public static class DbSeeds
{
    public static readonly List<object> Collection = new List<object>
    {
        new AddZone { IsDefaultZone = true, Title = Resources.SID_Default_Zone },
        new AddUser
        { UserId = Guid.NewGuid(), Title = "developer",
            EncodedPassword = "zse4%RDX".GetHashString(), Role = Role.Developer, ZoneId = Guid.Empty },
        new AddUser
        { UserId = Guid.NewGuid(), Title = "root",
            EncodedPassword = "root".GetHashString(), Role = Role.Root, ZoneId = Guid.Empty },
        // new AddUser
        // { UserId = Guid.NewGuid(), Title = "operator", 
        //     EncodedPassword = "operator".GetHashString(), Role = Role.Operator, ZoneId = Guid.Empty },
        // new AddUser
        // { UserId = Guid.NewGuid(), Title = "supervisor", 
        //     EncodedPassword = "supervisor".GetHashString(), Role = Role.Supervisor, ZoneId = Guid.Empty },
        // new AddUser
        // { UserId = Guid.NewGuid(), Title = "weboperator", 
        //     EncodedPassword = "weboperator".GetHashString(), Role = Role.WebOperator, ZoneId = Guid.Empty },
        // new AddUser
        // { UserId = Guid.NewGuid(), Title = "websupervisor", 
        //     EncodedPassword = "websupervisor".GetHashString(), Role = Role.WebSupervisor, ZoneId = Guid.Empty },
        // new AddUser
        // { UserId = Guid.NewGuid(), Title = "superclient", 
        //     EncodedPassword = "superclient".GetHashString(), Role = Role.SuperClient, ZoneId = Guid.Empty },
    };
}