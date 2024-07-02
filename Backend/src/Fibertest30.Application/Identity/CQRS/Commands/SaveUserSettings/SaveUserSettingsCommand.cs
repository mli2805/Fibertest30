using MediatR;

namespace Fibertest30.Application;

public record SaveUserSettingsCommand(UserSettings Settings) : IRequest<Unit>;

public class SaveUserSettingsCommandHandler : IRequestHandler<SaveUserSettingsCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserSettingsRepository _userSettingsRepository;

    public SaveUserSettingsCommandHandler( ICurrentUserService currentUserService, 
        IUserSettingsRepository userSettingsRepository)
    {
        _currentUserService = currentUserService;
        _userSettingsRepository = userSettingsRepository;
    }

    public async Task<Unit> Handle(SaveUserSettingsCommand request, CancellationToken cancellationToken)
    {
        await _userSettingsRepository.SaveUserSettings(_currentUserService.UserId!, request.Settings);
        return Unit.Value;
    }
}