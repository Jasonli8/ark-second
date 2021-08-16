USE [ASTS]
GO

ALTER TABLE [Shares].[Holding] DROP CONSTRAINT [FK_Holding_Fund]
GO

ALTER TABLE [Shares].[Holding] DROP CONSTRAINT [FK__Holdings__compan__37A5467C]
GO

/****** Object:  Table [Shares].[Holding]    Script Date: 2021-07-20 4:34:05 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Shares].[Holding]') AND type in (N'U'))
DROP TABLE [Shares].[Holding]
GO

/****** Object:  Table [Shares].[Company]    Script Date: 2021-07-20 4:31:50 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Shares].[Company]') AND type in (N'U'))
DROP TABLE [Shares].[Company]
GO

/****** Object:  Table [Shares].[Company]    Script Date: 2021-07-20 4:31:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Shares].[Company](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[companyName] [varchar](50) NOT NULL,
	[ticker] [varchar](10) NULL,
	[cusip] [varchar](50) NULL,
 CONSTRAINT [PK__Companie__AD5755B88D9F8347] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [AK_Stock] UNIQUE NONCLUSTERED 
(
	[ticker] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

CREATE TABLE [Shares].[Holding](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[companyId] [int] NOT NULL,
	[fundId] [int] NOT NULL,
	[date] [datetime] NOT NULL,
	[shares] [float] NULL,
	[marketValue] [float] NULL,
	[weight] [float] NULL,
 CONSTRAINT [PK_Holding] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [AK_Holding] UNIQUE NONCLUSTERED 
(
	[companyId] ASC,
	[fundId] ASC,
	[date] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [Shares].[Holding]  WITH CHECK ADD  CONSTRAINT [FK__Holdings__compan__37A5467C] FOREIGN KEY([companyId])
REFERENCES [Shares].[Company] ([Id])
GO

ALTER TABLE [Shares].[Holding] CHECK CONSTRAINT [FK__Holdings__compan__37A5467C]
GO

ALTER TABLE [Shares].[Holding]  WITH CHECK ADD  CONSTRAINT [FK_Holding_Fund] FOREIGN KEY([fundId])
REFERENCES [Shares].[Fund] ([Id])
GO

ALTER TABLE [Shares].[Holding] CHECK CONSTRAINT [FK_Holding_Fund]
GO

