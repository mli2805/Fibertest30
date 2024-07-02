
## To add a new migration: 

> cd Backend/src
>
> dotnet ef migrations add SomeMigrationNameLetsNotAddSpaces --project Fibertest30.Infrastructure --startup-project Fibertest30.Api --output-dir "Persistence\Migrations"


## To remove the last migration (if it hasn't applied to the database yet):

> dotnet ef migrations remove --project Fibertest30.Infrastructure --startup-project Fibertest30.Api

## To show the list of migrations:

> dotnet ef migrations list --project Fibertest30.Infrastructure --startup-project Fibertest30.Api

## To apply specific migration:

> dotnet ef database update MigrationNameFromListCommand --project Fibertest30.Infrastructure --startup-project Fibertest30.Api

## To update database to the latest manually

> dotnet ef database update --project Fibertest30.Infrastructure --startup-project Fibertest30.Api --connection "Data Source=data\rtu.db"
