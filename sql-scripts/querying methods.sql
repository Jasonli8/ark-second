-- getFundsHoldingByDate (string fundType, date date)
WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS 
(
SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]
FROM [Shares].[Company] AS [c]
JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id]
JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]
)
SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue]
FROM All_Holding
WHERE [date] = ${date} AND [fundName] = $[fundType}
GROUP BY [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date]

-- getFundHoldingByTicker (string fundType, string ticker, date fromDate, date toDate)
WITH All_Holding([fundName],[description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]) AS 
(
SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue],[weight]
FROM [Shares].[Company] AS [c]
JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id]
JOIN [Shares].[Fund] AS [f] ON [f].[Id] = [h].[fundId]
)
SELECT [fundName], [description],[companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue]
FROM All_Holding
WHERE [fundName] = ${fundType} 
AND [ticker] = ${ticker} 
AND ([date] BETWEEN ${fromDate} AND ${toDate})

-- getFundHoldingChangeByTicker (string ticker, string range)
WITH All_Holding([companyId],[companyName],[ticker],[cusip],[date],[shares],[marketValue]) AS 
(
SELECT [companyId],[companyName],[ticker],[cusip],[date],SUM([shares]) AS [shares],SUM([marketValue]) AS [marketValue]
FROM [Shares].[Company] AS [c]
JOIN [Shares].[Holding] AS [h] ON [h].[companyId] = [c].[Id]
WHERE [date] BETWEEN ${fromDate} AND ${toDate}
AND [ticker] = ${ticker} 
GROUP BY [description],[companyId],[companyName],[ticker],[cusip],[date]
)
SELECT [companyId],[companyName],[ticker],[cusip],[date],
([shares] - LAG([shares], 1) OVER(ORDER BY [date])) AS [sharesDifference],
[marketValue] - LAG([marketValue], 1) OVER(ORDER BY [date]) AS [marketValueDifference]
FROM All_Holding
