using System.Linq.Expressions;

namespace Fibertest30.Infrastructure;

public static class DateTimeFilterQueryExtensions
{
    // The ApplyDateTimeFilter is used to filter the query by the date time field
    // Currently we have two types of date time fields: long and DateTime.
    
    // We use long to make the query faster by reducing the index size of the date time field,
    // and by reducing the row width in general.
    
    public static IQueryable<TEntity> ApplyDateTimeFilter<TEntity, TDateType>(
        this IQueryable<TEntity> query,
        IDateTime dateTime,
        DateTimeFilter dateTimeFilter,
        Expression<Func<TEntity, TDateType>> dateTimeSelector,
        Func<DateTime, TDateType> datetimeConverter)
    {
        var parameter = Expression.Parameter(typeof(TEntity));
        var property = Expression.Invoke(dateTimeSelector, parameter);
        
        if (dateTimeFilter.SearchWindow != null)
        {
            var start = datetimeConverter(dateTimeFilter.SearchWindow.Start);
            var end = datetimeConverter(dateTimeFilter.SearchWindow.End);

            var body = Expression.AndAlso(
                Expression.GreaterThanOrEqual(property, Expression.Constant(start)),
                Expression.LessThan(property, Expression.Constant(end))
            );
            query = query.Where(Expression.Lambda<Func<TEntity, bool>>(body, parameter));
            
        }
        else if (dateTimeFilter.RelativeFromNow != null)
        {
            var now = dateTime.UtcNow;
            var start = datetimeConverter(now - dateTimeFilter.RelativeFromNow.Value);
            var end = datetimeConverter(now);
            
            var body = Expression.AndAlso(
                Expression.GreaterThan(property, Expression.Constant(start)),
                Expression.LessThanOrEqual(property, Expression.Constant(end))
            );
            query = query.Where(Expression.Lambda<Func<TEntity, bool>>(body, parameter));
        }

        if (dateTimeFilter.LoadSince != null)
        {
            var loadSince = datetimeConverter(dateTimeFilter.LoadSince.Value);
            
            var body = dateTimeFilter.OrderDescending 
                ? Expression.LessThan(property, Expression.Constant(loadSince))
                : Expression.GreaterThan(property, Expression.Constant(loadSince));

            query = query.Where(Expression.Lambda<Func<TEntity, bool>>(body, parameter));
        }
        
        query = dateTimeFilter.OrderDescending 
            ? query.OrderByDescending(dateTimeSelector) 
            : query.OrderBy(dateTimeSelector);

        return query;
    }
}