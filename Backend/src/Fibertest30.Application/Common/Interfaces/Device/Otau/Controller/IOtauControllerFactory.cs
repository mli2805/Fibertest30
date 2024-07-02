namespace Fibertest30.Application;

public interface IOtauControllerFactory
{
    IOtauController CreateOcm();
    IOtauController CreateOsm(int chainAddress);
    IOtauController CreateOxc(string ip, int port);
}