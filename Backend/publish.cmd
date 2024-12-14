dotnet publish Fibertest30.sln -c Release --runtime linux-x64 --no-self-contained

xcopy /E/Y/I c:\VsGitProjects\Fibertest30\Backend\src\Fibertest30.Api\bin\Release\net7.0\linux-x64\publish c:\temp\publish

ren c:\temp\publish api

pause


