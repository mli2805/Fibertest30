namespace Fibertest30.Application;

public interface IPortLabelRepository
{
    public Task<List<PortLabel>> GetAll(CancellationToken ct);
    public Task<PortLabel> Get(int portLabelId, CancellationToken ct);
    public Task<int> AddAndAttachPortLabel(string name, string hexColor, int monitoringPortId, CancellationToken ct);
    public Task UpdatePortLabel(int portLabelId, string name, string hexColor, CancellationToken ct);
    public Task AttachPortLabel(int portLabelId, int monitoringPortId, CancellationToken ct);
    public Task DetachPortLabelAndRemoveIfLast(int portLabelId, int monitoringPortId, CancellationToken ct);
    
}