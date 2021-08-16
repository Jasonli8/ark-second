USE [ASTS]
GO

/****** Object:  Table [User].[SecurityQuestion]    Script Date: 2021-08-12 3:13:43 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[User].[SecurityQuestion]') AND type in (N'U'))
DROP TABLE [User].[SecurityQuestion]
GO

/****** Object:  Table [User].[SecurityQuestion]    Script Date: 2021-08-12 3:13:43 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [User].[SecurityQuestion](
	[Id] [bigint] IDENTITY(1,1) NOT NULL,
	[question] [varchar](100) NOT NULL,
 CONSTRAINT [PK_User.SecurityQuestion] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


