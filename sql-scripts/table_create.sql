USE ArkSecondDB
GO

-- create Shares schema
CREATE SCHEMA Shares AUTHORIZATION dbo;
GO

-- create Shares.Companies table
IF OBJECT_ID('Shares.Companies', 'U') IS NOT NULL
	DROP TABLE Shares.Companies;

CREATE TABLE Shares.Companies
(
	[companyid]		INT			NOT NULL PRIMARY KEY IDENTITY(1,1),
	[companyname]	varchar(50)	NOT NULL,
	[ticker]		varchar(10),
	[cusip]			varchar(50),
);
GO

-- create Shares.Holdings table
IF OBJECT_ID('Shares.Holdings', 'U') IS NOT NULL
	DROP TABLE Shares.Holdings;

CREATE TABLE Shares.Holdings
(
	[companyid]		INT			NOT NULL FOREIGN KEY REFERENCES Shares.Companies(companyid),
	[date]			DATETIME	NOT NULL,
	[shares]		FLOAT,
	[marketvalue]	FLOAT,
	[weight]		FLOAT,
);
GO