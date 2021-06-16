USE ArkSecondDB;
GO

-- inserting into Shares.Companies
INSERT INTO [Shares].[Companies]([companyname], [ticker], [cusip])
	SELECT [a].[company], [a].[ticker], [a].[cusip]
	FROM [dbo].[ARK_INNOVATION_ETF_ARKK_HOLDINGS] AS [a]
	WHERE ([a].[company] IS NOT NULL) 
	AND (NOT EXISTS (SELECT * FROM [Shares].[Companies] AS [c] WHERE [c].[companyname] = [a].[company]))

-- inserting into Shares.Holdings
INSERT INTO [Shares].[Holdings]([companyid], [date], [shares], [marketvalue], [weight])
	SELECT [c].[companyid], [a].[date], [a].[shares], [a].[market_value], [a].[weight]
	FROM [dbo].[ARK_INNOVATION_ETF_ARKK_HOLDINGS] AS [a]
	JOIN Shares.Companies AS [c] ON [c].[companyname] = [a].[company]