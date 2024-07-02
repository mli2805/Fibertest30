namespace Fibertest30.IntegrationTests;

// The question is when should we use EntityFramework in memory database for tests?

// If we don't use Sqlite, but for example MySql,
// EF in memory would be a fine option to fake a database (with some drawbacks).

// There are drawbacks when using EF in memory database like:
// database constrains are ignored, can't test plain sql queries, can't test transactions, etc.

// All that drawbacks are not exist when using Sqlite in memory.
// The only think where EF in memory is probably better is performace.

// Maybe when (and if) we got a lot of integration tests and want to save some time
// we could switch some of those (which don't test the database constraints, etc) to EF in memory

// As I rule of thumb, use only SqliteTestBase for now.

public abstract class EntityFrameworkInMemoryTestBase : SqliteTestBase
{
    public EntityFrameworkInMemoryTestBase()
    {
        _useSqliteMemory = false;
    }
}

