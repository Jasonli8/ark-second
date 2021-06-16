USE ArkSecondDB
GO

-- create Shares schema
CREATE SCHEMA [User] AUTHORIZATION dbo;
GO

-- create Shares.Companies table
IF OBJECT_ID('User.Users', 'U') IS NOT NULL
	DROP TABLE [User].[Users];

CREATE TABLE [User].[Users]
(
	[userid]		INT			NOT NULL PRIMARY KEY IDENTITY(1,1),
	[user]			varchar(50)	NOT NULL,
	[firstName]		varchar(50)	NOT NULL,
	[lastName]		varchar(50)	NOT NULL,
	[email]			varchar(50)	NOT NULL,
	[password]		varchar(50)	NOT NULL,
);
GO