namespace Fibertest30.Api;

public static class UserMappingExtensions
{
    public static User ToProto(this AuthenticatedUser authUser)
    {
        return new User()
        {
            UserId = authUser.User.Id,
            UserName = authUser.User.UserName,
            FirstName = authUser.User.FirstName,
            LastName = authUser.User.LastName,
            Email = authUser.User.Email ?? string.Empty,
            PhoneNumber = authUser.User.PhoneNumber ?? string.Empty,
            JobTitle = authUser.User.JobTitle,
            Role = authUser.Role.Name,
            Permissions = { authUser.Role.Permissions.Select(x => x.ToString()) }
        };
    }

    public static Role ToProto(this ApplicationRole role)
    {
        return new Role() { Name = role.Name, Permissions = { role.Permissions.Select(x => x.ToString()) } };
    }

    public static Fibertest30.Application.ApplicationUserPatch FromProto(this ApplicationUserPatch patch)
    {
        return new Fibertest30.Application.ApplicationUserPatch(
            patch.HasUserName ? patch.UserName : null,
            patch.HasFirstName ? patch.FirstName : null,
            patch.HasLastName ? patch.LastName : null,
            patch.HasEmail ? patch.Email : null,
            patch.HasPhoneNumber ? patch.PhoneNumber : null,
            patch.HasJobTitle ? patch.JobTitle : null,
            patch.HasRole ? patch.Role : null,
            patch.HasPassword ? patch.Password : null);
    }

    public static UserSettings ToProto(this Fibertest30.Application.UserSettings settings)
    {
        return new UserSettings()
        {
            Theme = settings.Theme,
            Language = settings.Language,
            DateTimeFormat = settings.DateTimeFormat,
            Zoom = settings.Zoom,
            Lat = settings.Lat,
            Lng = settings.Lng,
            ShowNodesFromZoom = settings.ShowNodesFromZoom,
            SourceMapId = settings.SourceMapId,
            SwitchOffSuspicionSignalling = settings.SwitchOffSuspicionSignalling,
            SwitchOffRtuStatusEventsSignalling = settings.SwitchOffRtuStatusEventsSignalling,
            LatLngFormat = settings.LatLngFormat,
        };
    }

    public static Fibertest30.Application.UserSettings FromProto(this UserSettings settings)
    {
        return new Fibertest30.Application.UserSettings()
        {
            Theme = settings.Theme,
            Language = settings.Language,
            DateTimeFormat = settings.DateTimeFormat,
            Zoom = settings.Zoom,
            Lat = settings.Lat,
            Lng = settings.Lng,
            ShowNodesFromZoom = settings.ShowNodesFromZoom,
            SourceMapId = settings.SourceMapId,
            SwitchOffSuspicionSignalling = settings.SwitchOffSuspicionSignalling,
            SwitchOffRtuStatusEventsSignalling = settings.SwitchOffRtuStatusEventsSignalling,
            LatLngFormat = settings.LatLngFormat,
        };
    }
}