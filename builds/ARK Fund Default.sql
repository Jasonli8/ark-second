USE [ASTS]
GO

/****** Object:  Table [Shares].[Fund]    Script Date: 2021-08-12 3:14:26 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[Shares].[Fund]') AND type in (N'U'))
DROP TABLE [Shares].[Fund]
GO

/****** Object:  Table [Shares].[Fund]    Script Date: 2021-08-12 3:14:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [Shares].[Fund](
	[Id] [int] NOT NULL,
	[fundName] [varchar](50) NOT NULL,
	[description] [varchar](50) NULL,
	[csvName] [varchar](200) NULL,
 CONSTRAINT [PK_Shares.Funds] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


