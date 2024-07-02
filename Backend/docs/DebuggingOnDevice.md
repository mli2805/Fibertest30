== TLDR

Currently remote debugging on ARM device via Visual Studio is not possible, probably due to the bug in .NET 7 runtime implementation on ARM.
There is also an issue with Visual Studio remote bootstrap script.

TODO: Try to retarget solution to .NET 8 and then try the debugging (.NET 8 is already installed on the device in /opt).


== Remote debugging approach

It's generally possible to debug the remote process in Visual Studio.
One way is to install Visual Studio tools on the remote machine - not available for ARM32. 
Another way is to use Visual Studio -> Debug -> Attach to process -> Connection type: SSH.
With this type Visual Studio will connect to the remote device, download the needed tools and then start the debugging session.


== Issue with bootstraping and workaround

When you try to remotely debug via SSH on RFTS-400 device, the debugging session seems to start, but no breakpoints are hit,
no usual debug information (modules, variables, etc) is available.
The reason is that Visual Studio fails to download the needed tools on the device.
This is a common problem, and can be googled by e.g. '"Visual Studio" SSH debugging problem ".vs-debugger"'.
E.g., see https://developercommunity.visualstudio.com/t/VS2022-remote-debugging-over-SSH-does-no/10394545?q=%5BFixed+In%3A+Visual+Studio+2022+version+17.8+Preview+1%5D

In our case the problem is with the /root device folder, which is determined as SSH user home folder by Visual Studio.
Although this folder does not seem to be readonly, there is no actual free space in it, so Visual Studio just fails to download the needed files to it.
(TODO: Ask Yanjun about the details)

Since Visual Studio first creates `.vs-debugger` folder and then works in it, the workaround is to create a symlink instead, pointing to some appropriate partition, e.g.:

   mkdir /home/root/.vs-debugger
   cd /root
   ln -s /home/root/.vs-debugger .vs-debugger

After this, the Visual Studio remote SSH debugging starts fine.


== Segmentation fault when debugging on .NET 7

The fatal problem for now is that it's still not possible to debug on .NET 7 ARM runtime.
The process being debugged crashes with Segmentation fault.
The reason seems to be the following issue: https://github.com/dotnet/runtime/issues/81921


== Other notes

By default Visual Studio may not give enough logs for what is does and it may be hard to identify the problem.
Possible useful tricks are:
 - running `devenv` with the `/Log` flag, which will make it to actually generate some logs in its normal location (%AppData%\Microsoft\VisualStudio\<version>\ActivityLog)
 - running `DebugAdapterHost.Logging /OutputWindow /On` in Visual Studio Command Window, which will output logs related to the remote debug in the Output Window (Source: Debug).

Since attaching to the remote process may take some time, it may be useful to add some configurable startup delay to the Program.cs.
