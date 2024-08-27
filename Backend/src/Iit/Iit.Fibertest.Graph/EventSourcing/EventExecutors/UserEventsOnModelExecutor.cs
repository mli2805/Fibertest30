﻿using AutoMapper;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public static class UserEventsOnModelExecutor
    {
        private static readonly IMapper Mapper = new MapperConfiguration(
            cfg => cfg.AddProfile<MappingEventToDomainModelProfile>()).CreateMapper();

        public static string? AddUser(this Model model, UserAdded e)
        {
            model.Users.Add(Mapper.Map<User>(e));
            return null;
        }

        public static string? ApplyLicense(this Model model, LicenseApplied e)
        {
            if (!e.IsIncremental)
            {
                var securityAdmin = model.Users.FirstOrDefault(u => u.Role == Role.SecurityAdmin);
                if (securityAdmin != null)
                    model.Users.Remove(securityAdmin);
                model.Licenses.Clear();
                if (e.ClientStationCount.Value < 1)
                    e.ClientStationCount.Value = 1;
            }
            else
            {
                if (model.Licenses.First().IsMachineKeyRequired)
                    e.WebClientCount.Value = 0;
            }
            model.Licenses.Add(Mapper.Map<License>(e));

            if (e.IsMachineKeyRequired)
            {
                if (model.Users.All(u => u.Role != Role.SecurityAdmin))
                {
                    model.Users.Add(new User()
                    {
                        UserId = e.AdminUserId,
                        Role = Role.SecurityAdmin,
                        Title = @"admin",
                        EncodedPassword = e.SecurityAdminPassword,
                        ZoneId = Guid.Empty,
                        Email = new EmailReceiver(),
                        Sms = new SmsReceiver(),
                    });
                }

                var user = model.Users.FirstOrDefault(u => u.UserId == e.UserId);
                if (user == null) return null;
                user.MachineKey = e.MachineKey;
            }

            return null;
        }

        public static string? UpdateUser(this Model model, UserUpdated source)
        {
            var destination = model.Users.First(f => f.UserId == source.UserId);
            Mapper.Map(source, destination);
            return null;
        }

        public static string? AssignUsersMachineKey(this Model model, UsersMachineKeyAssigned source)
        {
            var destination = model.Users.First(f => f.UserId == source.UserId);
            destination.MachineKey = source.MachineKey;
            return null;
        }

        public static string? RemoveUser(this Model model, UserRemoved e)
        {
            model.Users.Remove(model.Users.First(f => f.UserId == e.UserId));
            return null;
        }


    }
}